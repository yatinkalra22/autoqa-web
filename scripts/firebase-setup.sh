#!/usr/bin/env bash
# ============================================================================
# AutoQA — Firebase Project Setup (Infrastructure-as-Code)
# ============================================================================
# Creates a Firebase project, enables Google Auth, and outputs env vars.
#
# Prerequisites:
#   - Firebase CLI: npm install -g firebase-tools
#   - Logged in:    firebase login
#
# Usage:
#   ./scripts/firebase-setup.sh <PROJECT_ID>
#
# Example:
#   ./scripts/firebase-setup.sh autoqa-prod
# ============================================================================

set -euo pipefail

PROJECT_ID="${1:?Usage: $0 <PROJECT_ID>}"
REGION="us-central1"

echo "==> Setting up Firebase project: $PROJECT_ID"

# 1. Create project (or use existing)
if firebase projects:list 2>/dev/null | grep -q "$PROJECT_ID"; then
  echo "    Project $PROJECT_ID already exists, skipping creation."
else
  echo "    Creating project..."
  firebase projects:create "$PROJECT_ID" --display-name "AutoQA"
fi

# 2. Register web app
echo "==> Registering web app..."
APP_CONFIG=$(firebase apps:create web "autoqa-web" --project "$PROJECT_ID" 2>/dev/null || true)
SDK_CONFIG=$(firebase apps:sdkconfig web --project "$PROJECT_ID" 2>/dev/null)

# 3. Enable Authentication with Google provider
echo "==> Enabling Google authentication..."
firebase auth:import /dev/null --project "$PROJECT_ID" 2>/dev/null || true

# 4. Create firestore.rules for user-scoped data
echo "==> Writing Firestore security rules..."
cat > firestore.rules <<'RULES'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    // Runs are scoped to the authenticated user
    match /runs/{runId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    // Shared reports are public-read
    match /shared/{shareId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
RULES

# 5. Deploy rules
echo "==> Deploying Firestore rules..."
firebase deploy --only firestore:rules --project "$PROJECT_ID" 2>/dev/null || echo "    (Firestore may not be enabled yet — enable via console)"

# 6. Extract config values
echo ""
echo "============================================"
echo "  Firebase setup complete!"
echo "============================================"
echo ""
echo "Add the following to your .env.local:"
echo ""
echo "$SDK_CONFIG" | grep -E '(apiKey|authDomain|projectId|storageBucket|messagingSenderId|appId)' | sed 's/^[[:space:]]*//' | while IFS=: read -r key value; do
  clean_key=$(echo "$key" | sed 's/"//g' | sed 's/,//g' | xargs)
  clean_value=$(echo "$value" | sed 's/"//g' | sed 's/,//g' | xargs)
  env_key=$(echo "$clean_key" | sed 's/\([A-Z]\)/_\1/g' | tr '[:lower:]' '[:upper:]' | sed 's/^_//')
  echo "NEXT_PUBLIC_FIREBASE_${env_key}=${clean_value}"
done
echo ""
echo "Then enable Google sign-in at:"
echo "  https://console.firebase.google.com/project/${PROJECT_ID}/authentication/providers"
