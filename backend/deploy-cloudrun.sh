#!/bin/bash

# Cloud Run deployment script for the Quantum Mind backend.
# Usage: PROJECT_ID=your-project-id ./deploy-cloudrun.sh [region]

set -e

PROJECT_ID="${PROJECT_ID:?Set PROJECT_ID to your GCP project, e.g. PROJECT_ID=quantum-minds ./deploy-cloudrun.sh}"
SERVICE_NAME="quantum-backend"
REGION="${1:-us-central1}"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

cd "$(dirname "$0")"

gcloud config set project "${PROJECT_ID}"

gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com

# Build on Cloud Build rather than locally: the image is large and this avoids
# an amd64 cross-build from an Apple Silicon machine.
gcloud builds submit --tag "${IMAGE_NAME}:latest" .

# min-instances 0 keeps idle cost at zero; max-instances caps a runaway bill.
# The quantum circuit is CPU-bound, so 1 CPU with threads matches the gunicorn
# config in the Dockerfile.
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE_NAME}:latest" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 8080 \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5 \
  --timeout 120 \
  --set-env-vars "HUME_API_KEY=${HUME_API_KEY:-},HUME_SECRET_KEY=${HUME_SECRET_KEY:-},TOGETHER_API_KEY=${TOGETHER_API_KEY:-},JWT_SECRET_KEY=${JWT_SECRET_KEY:-}" \
  --project "${PROJECT_ID}"

SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --platform managed \
  --region "${REGION}" \
  --format 'value(status.url)' \
  --project "${PROJECT_ID}")

echo ""
echo "Backend URL: ${SERVICE_URL}"
echo "Set this as VITE_API_URL in the Vercel project, then redeploy the frontend."
