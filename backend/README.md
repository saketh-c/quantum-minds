# Quantum Minds — Backend

Flask API serving a 14-qubit variational quantum classifier (PennyLane) for
multimodal mental health risk screening.

This is a research prototype built for a science fair project. It is not a
diagnostic tool and is not a substitute for evaluation by a licensed
professional.

## Endpoints

| Route | Method | Rate limit | Notes |
|---|---|---|---|
| `/health` | GET | none | Liveness check; left unlimited for uptime pings |
| `/predict` | POST | 60/hour | Runs the VQC. Body: `{"features": [14 floats 0-1]}` |
| `/analyze-voice` | POST | 15/hour | Hume prosody. Needs `HUME_API_KEY` |
| `/hume/token` | POST | 15/hour | Hume EVI token. Needs Hume credentials |
| `/analyze_transcript` | POST | 15/hour | Together LLM notes. Needs `TOGETHER_API_KEY` |

Limits are per-IP. The Hume and Together endpoints spend real API credits and
run without authentication, so they are capped tightly; `/predict` is capped
loosely because it burns CPU on the host.

Rate limiting uses in-process memory storage, which assumes a long-lived
process. It is ineffective on stateless serverless platforms, where each
invocation resets the counters.

## Configuration

The service starts and serves predictions without any of these set; only the
voice and LLM-note features degrade.

- `HUME_API_KEY`, `HUME_SECRET_KEY` — voice prosody analysis
- `TOGETHER_API_KEY` — LLM-generated clinical notes
- `JWT_SECRET_KEY` — reserved; auth is currently disabled

## Runtime footprint

Roughly 104 MB resident and ~0.15s per prediction, so a 512 MB instance is
ample.

## Deployment

The `Dockerfile` binds gunicorn to port 8080 and installs
`requirements-serve.txt`, which omits torch, pandas, and scikit-learn — those
are imported only by `train_vqc.py`, `evaluate_model.py`, and
`preprocess_kaggle.py`, none of which run in the container. That keeps the
image near 400 MB instead of 1.3 GB, which is what governs cold-start time.

Any Docker host works. `deploy-cloudrun.sh` covers Google Cloud Run
specifically.

## Local development

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt        # includes training deps
gunicorn --bind 0.0.0.0:5001 app:app
```
