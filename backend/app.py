from flask import Flask, request, jsonify
from flask_cors import CORS
import pennylane as qml
from pennylane import numpy as np
import os
import requests
from together import Together
import logging
import json

# from flask_jwt_extended import JWTManager, create_access_token, jwt_required
# from datetime import timedelta

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

# # Configuration (auth disabled)
# app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'super-secret-key-change-this')
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
# jwt = JWTManager(app)
#
# ADMIN_USER = "admin"
# ADMIN_PASS = "password"
#
# @app.route('/login', methods=['POST'])
# def login():
#     username = request.json.get('username', None)
#     password = request.json.get('password', None)
#     if username == ADMIN_USER and password == ADMIN_PASS:
#         access_token = create_access_token(identity=username)
#         return jsonify(access_token=access_token), 200
#     else:
#         return jsonify({"msg": "Bad username or password"}), 401




# CONFIG
QUBITS = 14
LAYERS = int(os.environ.get("QM_LAYERS", "6"))
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

# Feature metadata for holistic reporting
FEATURE_METADATA = [
    {"index": 0, "name": "Cognitive Connectivity", "category": "Neurocognitive", "description": "Focus and attention capacity measured through cognitive tasks", "source": "game"},
    {"index": 1, "name": "Memory Function", "category": "Neurocognitive", "description": "Hippocampal-dependent memory performance", "source": "game"},
    {"index": 2, "name": "Sleep Quality", "category": "Lifestyle", "description": "Sleep duration and quality patterns", "source": "survey"},
    {"index": 3, "name": "Developmental Stage", "category": "Demographic", "description": "Age-normalized pubertal/developmental stage", "source": "proctor"},
    {"index": 4, "name": "Anxiety Level", "category": "Emotional", "description": "Anxiety symptoms detected through voice prosody analysis", "source": "biometric"},
    {"index": 5, "name": "Social Isolation", "category": "Emotional", "description": "Social withdrawal indicators from voice analysis", "source": "biometric"},
    {"index": 6, "name": "Substance Risk", "category": "Behavioral", "description": "Risk factors for substance use", "source": "survey"},
    {"index": 7, "name": "Diet Quality", "category": "Lifestyle", "description": "Nutritional habits and dietary patterns", "source": "survey"},
    {"index": 8, "name": "Academic Pressure", "category": "Environmental", "description": "Perceived academic stress and workload", "source": "survey"},
    {"index": 9, "name": "Family History", "category": "Genetic", "description": "Family history of mental health conditions", "source": "estimated"},
    {"index": 10, "name": "Bullying Exposure", "category": "Environmental", "description": "Exposure to bullying or peer victimization", "source": "estimated"},
    {"index": 11, "name": "Safety Perception", "category": "Environmental", "description": "Perceived safety in environment", "source": "estimated"},
    {"index": 12, "name": "Social Monitoring", "category": "Environmental", "description": "Level of social support and monitoring", "source": "estimated"},
    {"index": 13, "name": "Physical Activity", "category": "Lifestyle", "description": "Exercise and physical activity levels", "source": "estimated"},
]

def convert_to_rating(value):
    """Convert 0-1 normalized value to 1-5 rating scale"""
    # Map 0-1 to 1-5: 0->1, 0.25->2, 0.5->3, 0.75->4, 1->5
    return max(1, min(5, round(value * 4 + 1)))

def get_severity_level(risk_prob, depression_prob):
    combined = float(risk_prob) * 0.6 + float(depression_prob) * 0.4
    if combined >= 0.80:
        return {"level": "Critical", "color": "red", "recommendation": "Immediate professional intervention recommended. Contact school counselor or crisis line."}
    elif combined >= 0.65:
        return {"level": "Severe", "color": "orange", "recommendation": "Professional evaluation strongly recommended within 1-2 weeks."}
    elif combined >= 0.45:
        return {"level": "Moderate", "color": "yellow", "recommendation": "Monitor closely. Consider scheduling a check-in with school counselor."}
    elif combined >= 0.25:
        return {"level": "Mild", "color": "green", "recommendation": "Continue monitoring. Encourage healthy habits and open communication."}
    else:
        return {"level": "Minimal", "color": "green", "recommendation": "No immediate concerns. Continue regular wellness check-ins."}

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "quantum_backend": "online"})

@app.route('/predict', methods=['POST'])
# @jwt_required()
def predict():
    """
    Expects JSON: { "features": [0.1, 0.5, ... 14 items] }
    Returns comprehensive holistic prediction including:
    - Risk probability and tier
    - Depression probability
    - Severity assessment
    - Detailed feature breakdown with 1-5 ratings
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

    # Feature 1: Gradient-based attribution
    grad_fn = qml.grad(circuit, argnum=1)
    try:
        grads = grad_fn(weights, x)
        # Signed contribution = gradient * feature value
        contributions = [float(grads[i]) * float(x[i]) for i in range(len(x))]
        total_abs = sum(abs(c) for c in contributions) or 1.0
        feature_contributions = []
        for i, meta in enumerate(FEATURE_METADATA):
            pct = (contributions[i] / total_abs) * 100
            feature_contributions.append({
                "name": meta["name"],
                "value": float(x[i]),
                "rating": max(1, min(5, round(float(x[i]) * 4 + 1))),
                "contribution_pct": round(abs(pct), 1),
                "direction": "risk" if pct > 0 else "protective"
            })
        feature_contributions.sort(key=lambda c: c["contribution_pct"], reverse=True)
    except Exception as e:
        logger.warning(f"Gradient attribution failed: {e}")
        feature_contributions = []

    # Feature 5: Confidence band via weight perturbation
    try:
        perturbed_probs = []
        for _ in range(5):
            noise = np.random.normal(0, 0.01, weights.shape)
            perturbed_weights = weights + noise
            p_exp = circuit(perturbed_weights, x)
            perturbed_probs.append(float((p_exp + 1) / 2))
        confidence_band = {
            "low": round(min(perturbed_probs) * 100, 1),
            "high": round(max(perturbed_probs) * 100, 1),
            "spread": round((max(perturbed_probs) - min(perturbed_probs)) * 100, 1)
        }
    except Exception as e:
        logger.warning(f"Confidence band computation failed: {e}")
        confidence_band = {"low": 0, "high": 0, "spread": 0}
    
    # Calculate depression probability
    # Since model was trained on depression data, use risk as base
    # Adjust based on anxiety and isolation (key depression indicators)
    anxiety_weight = features[4]  # Index 4: Anxiety
    isolation_weight = features[5]  # Index 5: Isolation
    # Multi-factor depression probability using all features
    sleep_factor = 1.0 - float(features[2])       # Poor sleep increases risk
    substance_factor = float(features[6])           # Higher substance risk
    academic_factor = float(features[8])            # Higher academic pressure
    family_factor = float(features[9])              # Family history
    bullying_factor = float(features[10])           # Bullying exposure
    safety_factor = 1.0 - float(features[11])      # Lower safety increases risk
    social_factor = 1.0 - float(features[12])       # Less monitoring increases risk
    physical_factor = 1.0 - float(features[13])     # Less activity increases risk

    depression_prob = (
        float(risk_prob) * 0.30 +
        float(anxiety_weight) * 0.15 +
        float(isolation_weight) * 0.10 +
        sleep_factor * 0.10 +
        academic_factor * 0.08 +
        family_factor * 0.07 +
        bullying_factor * 0.06 +
        substance_factor * 0.05 +
        safety_factor * 0.03 +
        social_factor * 0.03 +
        physical_factor * 0.03
    )
    depression_prob = min(1.0, max(0.0, float(depression_prob)))
    
    # Detect default-heavy inputs for confidence reporting
    default_count = sum(1 for f in features if abs(float(f) - 0.5) < 0.05)
    feature_variance = float(np.var(x))

    if default_count >= 8:
        confidence = {"level": "low", "note": f"{default_count} of 14 features at default values. Results may not be fully personalized.", "default_features": default_count, "feature_variance": feature_variance}
    elif default_count >= 5:
        confidence = {"level": "moderate", "note": f"{default_count} of 14 features at default values.", "default_features": default_count, "feature_variance": feature_variance}
    else:
        confidence = {"level": "high", "note": "All major features have measured or observed values.", "default_features": default_count, "feature_variance": feature_variance}

    # Risk Tiers
    tier = "Low"
    if risk_prob > 0.4: tier = "Moderate"
    if risk_prob > 0.7: tier = "High"
    if risk_prob > 0.85: tier = "Crisis"

    # Feature 2: Tier context for trajectory indicator
    risk_pct = float(risk_prob * 100)
    tier_boundaries = [
        ("Low", 0, 40, "Moderate"),
        ("Moderate", 40, 70, "High"),
        ("High", 70, 85, "Crisis"),
        ("Crisis", 85, 100, None),
    ]
    tier_context = {}
    for t_name, t_min, t_max, t_next in tier_boundaries:
        if t_name == tier:
            prev_idx = tier_boundaries.index((t_name, t_min, t_max, t_next)) - 1
            prev_name = tier_boundaries[prev_idx][0] if prev_idx >= 0 else None
            tier_context = {
                "current_tier": t_name,
                "tier_min": t_min,
                "tier_max": t_max,
                "points_to_next_tier": round(t_max - risk_pct, 1) if t_next else 0,
                "next_tier_name": t_next,
                "points_above_prev_tier": round(risk_pct - t_min, 1),
                "prev_tier_name": prev_name,
            }
            break

    # Severity Assessment
    severity = get_severity_level(risk_prob, depression_prob)
    
    # Build detailed feature report
    feature_report = []
    for meta in FEATURE_METADATA:
        idx = meta["index"]
        value = float(features[idx])
        rating = convert_to_rating(value)
        
        # Determine status
        if meta["source"] == "estimated":
            if abs(value - 0.5) < 0.01:
                status = "estimated"
                status_text = "Estimated (default - not directly assessed)"
            else:
                status = "proctor"
                status_text = "Assessed by clinical proctor"
        else:
            status = "measured"
            status_text = f"Measured via {meta['source']}"
        
        # Determine health indicator
        if meta["category"] in ["Emotional", "Behavioral"]:
            # For emotional/behavioral: lower is better
            health_indicator = "good" if value < 0.3 else ("moderate" if value < 0.6 else "concerning")
        else:
            # For lifestyle/neurocognitive: higher is generally better
            health_indicator = "good" if value > 0.7 else ("moderate" if value > 0.4 else "concerning")
        
        feature_report.append({
            "index": idx,
            "name": meta["name"],
            "category": meta["category"],
            "description": meta["description"],
            "value": value,
            "rating": rating,
            "status": status,
            "status_text": status_text,
            "health_indicator": health_indicator,
            "source": meta["source"]
        })

    # Feature 3: LLM-generated clinical notes for concerning features
    clinical_notes = []
    concerning = [f for f in feature_report if f["health_indicator"] == "concerning"]
    if concerning:
        try:
            api_key = os.environ.get("TOGETHER_API_KEY")
            if api_key:
                client = Together(api_key=api_key)
                features_text = "\n".join([f"- {f['name']}: {f['rating']}/5 ({f['description']})" for f in concerning])
                prompt = f"""For each concerning mental health screening feature below, provide:
1. A brief plain-language explanation (1 sentence, accessible to non-clinicians)
2. A clinical note referencing DSM-5 criteria (1 sentence, for mental health professionals)

Features:
{features_text}

Respond in JSON array format: [{{"feature_name": "...", "plain_note": "...", "clinical_note": "..."}}]
Only return the JSON array, no other text."""

                resp = client.chat.completions.create(
                    model="meta-llama/Llama-3-70b-chat-hf",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=1000,
                    temperature=0.3,
                )
                raw = resp.choices[0].message.content.strip()
                # Extract JSON from response
                if '[' in raw:
                    raw = raw[raw.index('['):raw.rindex(']')+1]
                clinical_notes = json.loads(raw)
        except Exception as e:
            logger.warning(f"Clinical notes generation failed: {e}")
            clinical_notes = []

    return jsonify({
        # Core predictions
        "risk_probability": float(risk_prob),
        "risk_percentage": float(risk_prob * 100),
        "risk_tier": tier,
        "depression_probability": float(depression_prob),
        "depression_percentage": float(depression_prob * 100),

        # Severity assessment
        "severity": severity,

        # Confidence assessment
        "confidence": confidence,

        # Technical details
        "quantum_raw": float(exp_val),
        "decision_threshold": 0.45,
        "confidence_band": confidence_band,

        # Feature contributions (gradient-based)
        "feature_contributions": feature_contributions,

        # Risk trajectory context
        "tier_context": tier_context,

        # Clinical notes for concerning features
        "clinical_notes": clinical_notes,

        # Comprehensive feature breakdown
        "feature_report": feature_report,

        # Summary statistics
        "summary": {
            "total_features": 14,
            "measured_features": len([f for f in feature_report if f["status"] in ("measured", "proctor")]),
            "estimated_features": len([f for f in feature_report if f["status"] == "estimated"]),
            "average_rating": float(sum([f["rating"] for f in feature_report]) / len(feature_report)),
            "concerning_features": len([f for f in feature_report if f["health_indicator"] == "concerning"])
        }
    })

@app.route('/analyze-voice', methods=['POST'])
def analyze_voice():
    """
    Receives audio blob, sends to Hume Prosody API, returns anxiety/isolation scores.
    Falls back to simulated scores if Hume is unavailable or rate-limited.
    """
    logger.info("=== VOICE PROSODY ANALYSIS ===")

    if not HUME_API_KEY:
        logger.warning("Hume API key not configured, returning fallback")
        return jsonify({"fallback": True}), 503

    audio_file = request.files.get('audio')
    if not audio_file:
        return jsonify({"error": "No audio file provided"}), 400

    try:
        import tempfile, time

        # Save audio to temp file
        with tempfile.NamedTemporaryFile(suffix='.webm', delete=False) as tmp:
            audio_file.save(tmp)
            tmp_path = tmp.name

        # Submit job to Hume Batch API
        hume_url = "https://api.hume.ai/v0/batch/jobs"
        headers = {"X-Hume-Api-Key": HUME_API_KEY}

        with open(tmp_path, 'rb') as f:
            files = {"file": ("recording.webm", f, "audio/webm")}
            data = {"json": json.dumps({"models": {"prosody": {}}})}
            resp = requests.post(hume_url, headers=headers, files=files, data=data, timeout=10)

        os.unlink(tmp_path)

        if resp.status_code == 429:
            logger.warning("Hume rate limit hit, returning fallback")
            return jsonify({"fallback": True}), 503

        if resp.status_code not in (200, 201):
            logger.error(f"Hume job submit failed: {resp.status_code} - {resp.text}")
            return jsonify({"fallback": True}), 503

        job_id = resp.json().get("job_id")
        if not job_id:
            logger.error("No job_id in Hume response")
            return jsonify({"fallback": True}), 503

        logger.info(f"Hume job submitted: {job_id}")

        # Poll for results (max 30 seconds)
        predictions_url = f"https://api.hume.ai/v0/batch/jobs/{job_id}/predictions"
        for attempt in range(15):
            time.sleep(2)
            pred_resp = requests.get(predictions_url, headers=headers, timeout=10)

            if pred_resp.status_code == 200:
                results = pred_resp.json()
                # Extract prosody emotions
                anxiety_emotions = ["Anxiety", "Fear", "Distress"]
                isolation_emotions = ["Sadness", "Tiredness", "Boredom"]

                anxiety_score = 0.1
                isolation_score = 0.1
                emotion_count = 0

                for source in results:
                    for result in source.get("results", {}).get("predictions", []):
                        for group in result.get("models", {}).get("prosody", {}).get("grouped_predictions", []):
                            for prediction in group.get("predictions", []):
                                emotions = {e["name"]: e["score"] for e in prediction.get("emotions", [])}
                                emotion_count += 1

                                anx_vals = [emotions.get(e, 0) for e in anxiety_emotions if e in emotions]
                                iso_vals = [emotions.get(e, 0) for e in isolation_emotions if e in emotions]

                                if anx_vals:
                                    anxiety_score = max(anxiety_score, sum(anx_vals) / len(anx_vals))
                                if iso_vals:
                                    isolation_score = max(isolation_score, sum(iso_vals) / len(iso_vals))

                if emotion_count > 0:
                    logger.info(f"Hume analysis complete: anxiety={anxiety_score:.3f}, isolation={isolation_score:.3f}")
                    return jsonify({
                        "anxiety": min(1.0, anxiety_score),
                        "isolation": min(1.0, isolation_score)
                    })
                else:
                    logger.warning("No emotion predictions found in Hume results")
                    return jsonify({"fallback": True}), 503

            elif pred_resp.status_code == 400:
                # Job still processing
                continue
            else:
                logger.error(f"Hume predictions poll failed: {pred_resp.status_code}")
                return jsonify({"fallback": True}), 503

        logger.warning("Hume job timed out after 30 seconds")
        return jsonify({"fallback": True}), 503

    except Exception as e:
        logger.error(f"Voice analysis error: {str(e)}", exc_info=True)
        # Clean up temp file if it exists
        try:
            os.unlink(tmp_path)
        except:
            pass
        return jsonify({"fallback": True}), 503


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
# @jwt_required()
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
