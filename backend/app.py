from flask import Flask, request, jsonify
from flask_cors import CORS
import pennylane as qml
from pennylane import numpy as np
import os
import requests
from together import Together
import logging
import json

from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from datetime import timedelta

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Enable CORS with comprehensive configuration for Cloud Run deployment
# This handles preflight OPTIONS requests automatically
# Note: We use origins="*" but Flask-CORS will handle it properly without duplicates
CORS(app,
     resources={r"/*": {
         "origins": "*",
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
         "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
         "expose_headers": ["Content-Type", "Authorization"],
         "supports_credentials": False,
         "max_age": 3600
     }},
     automatic_options=True)

# Remove the manual after_request handler to avoid duplicate CORS headers
# Flask-CORS already handles all CORS headers automatically

# Configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-key-change-this')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
jwt = JWTManager(app)

# Hardcoded User
ADMIN_USER = "admin"
ADMIN_PASS = "password"

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    
    if username == ADMIN_USER and password == ADMIN_PASS:
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401




# CONFIG
QUBITS = 14
LAYERS = 2
# Try multiple possible paths for weights file
WEIGHTS_PATHS = ['quantum_weights.npy', 'backend/quantum_weights.npy', '/app/quantum_weights.npy', '/app/backend/quantum_weights.npy']
HUME_API_KEY = os.environ.get('HUME_API_KEY')
HUME_SECRET_KEY = os.environ.get('HUME_SECRET_KEY')

# QUANTUM DEVICE
dev = qml.device("default.qubit", wires=QUBITS)

@qml.qnode(dev)
def circuit(weights, x):
    qml.AngleEmbedding(features=x * np.pi, wires=range(QUBITS), rotation='Y')
    qml.StronglyEntanglingLayers(weights, wires=range(QUBITS))
    return qml.expval(qml.PauliZ(0))

def load_weights():
    # Try to find weights file in multiple possible locations
    for weights_path in WEIGHTS_PATHS:
        try:
            if os.path.exists(weights_path):
                print(f"Loading weights from: {weights_path}")
                return np.load(weights_path)
        except Exception as e:
            print(f"Error loading weights from {weights_path}: {e}")
            continue
    
    print("Weights not found in any expected location. Using random initialization.")
    return np.random.random((LAYERS, QUBITS, 3))

# Global Weights
weights = load_weights()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "quantum_backend": "online"})

@app.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    """
    Expects JSON: { "features": [0.1, 0.5, ... 14 items] }
    Returns: { "risk_score": 0.85, "support_tier": "Crisis" }
    """
    data = request.json
    if not data or 'features' not in data:
        return jsonify({"error": "Missing features"}), 400
    
    features = data['features']
    if len(features) != 14:
        return jsonify({"error": f"Expected 14 features, got {len(features)}"}), 400

    # Ensure float
    x = np.array(features, dtype=float)
    
    # Run Quantum Circuit
    # Expectation Z is between -1 and 1
    exp_val = circuit(weights, x)
    
    # Map to Probability [0, 1]
    # P(Risk) = (Z + 1) / 2
    risk_prob = (exp_val + 1) / 2
    
    # Tiers
    tier = "Low"
    if risk_prob > 0.4: tier = "Moderate"
    if risk_prob > 0.7: tier = "High"
    if risk_prob > 0.85: tier = "Crisis"

    return jsonify({
        "risk_probability": float(risk_prob),
        "risk_tier": tier,
        "quantum_raw": float(exp_val)
    })

@app.route('/hume/token', methods=['POST'])
def hume_token():
    """
    Fetches ephemeral access token for Hume EVI.
    """
    logger.info("=== HUME API TOKEN REQUEST ===")
    
    if not HUME_API_KEY or not HUME_SECRET_KEY:
        logger.error("Hume credentials not configured")
        return jsonify({
            "error": "Hume credentials not configured",
            "message": "HUME_API_KEY and HUME_SECRET_KEY environment variables must be set in Cloud Run"
        }), 500

    # Official endpoint: POST https://api.hume.ai/oauth2-cc/token
    token_url = "https://api.hume.ai/oauth2-cc/token"
    auth = (HUME_API_KEY, HUME_SECRET_KEY)
    data = {"grant_type": "client_credentials"}
    
    logger.info(f"Hume Token Request - URL: {token_url}")
    logger.info(f"Hume Token Request - Data: {data}")
    logger.info(f"Hume Token Request - Auth: (API_KEY: {HUME_API_KEY[:10]}..., SECRET_KEY: {HUME_SECRET_KEY[:10]}...)")
    
    try:
        # Basic Auth is standard for Client Creds
        resp = requests.post(token_url, auth=auth, data=data)
        
        logger.info(f"Hume Token Response - Status: {resp.status_code}")
        
        if resp.status_code == 200:
            response_data = resp.json()
            logger.info(f"Hume Token Response - Success: {json.dumps(response_data, indent=2)}")
            return jsonify(response_data)
        else:
            logger.error(f"Hume Token Response - Error: {resp.status_code} - {resp.text}")
            return jsonify({"error": "Failed to get token", "details": resp.text}), resp.status_code
    except Exception as e:
        logger.error(f"Hume Token Exception: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/analyze_transcript', methods=['POST'])
@jwt_required()
def analyze_transcript():
    """
    Analyzes transcript using Together API (Llama 3) to extract health ratings.
    """
    logger.info("=== TOGETHER API TRANSCRIPT ANALYSIS ===")
    
    data = request.json
    transcript = data.get('transcript', '')
    manual_ratings = data.get('manual_ratings', {})
    
    logger.info(f"Together API Request - Transcript length: {len(transcript)} chars")
    logger.info(f"Together API Request - Transcript preview: {transcript[:100]}...")
    logger.info(f"Together API Request - Manual ratings: {manual_ratings}")
    
    if not transcript:
        logger.warning("Together API Request - No transcript provided")
        return jsonify({"error": "No transcript provided"}), 400

    # Get API key from environment variable (required)
    api_key = os.environ.get("TOGETHER_API_KEY")
    if not api_key:
        logger.error("Together API key not configured")
        return jsonify({
            "error": "Together API key not configured",
            "message": "TOGETHER_API_KEY environment variable must be set in Cloud Run"
        }), 500
    
    try:
        client = Together(api_key=api_key)
        
        prompt = f"""
        Analyze the following user transcript about their mental health.
        Extract numerical ratings (1-10) for the following categories based on the text.
        
        CRITICAL INSTRUCTION: If the user explicitly states a rating (e.g., "I rate my sleep a 2", "Anxiety is 10/10"), you MUST use that exact number.
        If not explicitly mentioned, infer a likely value based on sentiment.
        If no information is present for a category, use 5 (neutral).
        
        Categories:
        - Sleep Quality (1=Poor, 10=Excellent)
        - Anxiety Level (1=Low, 10=High)
        - Academic Pressure (1=Low, 10=High)
        - Diet Quality (1=Poor, 10=Excellent)
        - Social Activity (1=Low, 10=High)

        Transcript: "{transcript}"

        Return the result as a VALID JSON object with keys: "sleep", "anxiety", "academic", "diet", "social".
        Do not explain. Return ONLY the JSON.
        """

        request_payload = {
            "model": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that extracts structured data from text. Output only valid JSON."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 200,
            "temperature": 0.7,
        }
        
        logger.info(f"Together API Request - Model: {request_payload['model']}")
        logger.info(f"Together API Request - Max tokens: {request_payload['max_tokens']}")
        logger.info(f"Together API Request - Temperature: {request_payload['temperature']}")
        logger.info(f"Together API Request - Prompt length: {len(prompt)} chars")

        response = client.chat.completions.create(**request_payload)

        logger.info(f"Together API Response - Status: Success")
        logger.info(f"Together API Response - Model used: {response.model if hasattr(response, 'model') else 'N/A'}")
        logger.info(f"Together API Response - Usage: {response.usage if hasattr(response, 'usage') else 'N/A'}")

        content = response.choices[0].message.content.strip()
        logger.info(f"Together API Response - Raw content length: {len(content)} chars")
        logger.info(f"Together API Response - Raw content preview: {content[:200]}...")
        
        # Simple cleanup
        original_content = content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
            logger.info("Together API Response - Cleaned: Removed markdown code block wrapper")
        elif "{" in content:
            start = content.find("{")
            end = content.rfind("}") + 1
            content = content[start:end]
            logger.info("Together API Response - Cleaned: Extracted JSON from mixed content")

        ratings = json.loads(content)
        logger.info(f"Together API Response - Parsed ratings: {json.dumps(ratings, indent=2)}")

        # Merge with explicit manual ratings if provided in request
        if manual_ratings:
            logger.info(f"Together API Response - Merging manual ratings: {manual_ratings}")
            for key, val in manual_ratings.items():
                if val is not None:
                    ratings[key] = val
            logger.info(f"Together API Response - Final ratings after merge: {json.dumps(ratings, indent=2)}")
        
        return jsonify({
            "analysis": ratings,
            "transcript_received": transcript
        })

    except json.JSONDecodeError as e:
        logger.error(f"Together API Exception - JSON decode error: {str(e)}")
        logger.error(f"Together API Exception - Content that failed to parse: {original_content[:500]}")
        return jsonify({
            "error": f"Failed to parse JSON response: {str(e)}",
            "raw_content": original_content[:500],
            "fallback": {
                "sleep": 5, "anxiety": 5, "academic": 5, "diet": 5, "social": 5
            }
        }), 500
    except Exception as e:
        logger.error(f"Together API Exception: {str(e)}", exc_info=True)
        # Fallback simulated response if API fails
        return jsonify({
            "error": str(e),
            "fallback": {
                "sleep": 5, "anxiety": 5, "academic": 5, "diet": 5, "social": 5
            }
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
