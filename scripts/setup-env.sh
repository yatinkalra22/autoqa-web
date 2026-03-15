#!/usr/bin/env bash
# ============================================================================
# AutoQA — Environment Setup Script
# ============================================================================
# Interactive script to configure .env.local with all required variables.
#
# Usage:
#   ./scripts/setup-env.sh
# ============================================================================

set -euo pipefail

ENV_FILE=".env.local"

echo "==> AutoQA Environment Setup"
echo ""

if [[ -f "$ENV_FILE" ]]; then
  echo "    Found existing $ENV_FILE"
  read -p "    Overwrite? [y/N] " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "    Keeping existing config."
    exit 0
  fi
fi

echo ""
echo "--- API Configuration ---"
read -p "API URL [http://localhost:3001]: " API_URL
API_URL="${API_URL:-http://localhost:3001}"

read -p "WebSocket URL [ws://localhost:3001]: " WS_URL
WS_URL="${WS_URL:-ws://localhost:3001}"

echo ""
echo "--- Firebase Configuration ---"
echo "Get these from: https://console.firebase.google.com/project/_/settings/general"
echo ""

read -p "Firebase API Key: " FB_API_KEY
read -p "Firebase Auth Domain: " FB_AUTH_DOMAIN
read -p "Firebase Project ID: " FB_PROJECT_ID
read -p "Firebase Storage Bucket [press Enter to skip]: " FB_STORAGE
read -p "Firebase Messaging Sender ID [press Enter to skip]: " FB_MESSAGING
read -p "Firebase App ID: " FB_APP_ID

cat > "$ENV_FILE" <<EOF
NEXT_PUBLIC_API_URL=$API_URL
NEXT_PUBLIC_WS_URL=$WS_URL

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=$FB_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$FB_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$FB_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$FB_STORAGE
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$FB_MESSAGING
NEXT_PUBLIC_FIREBASE_APP_ID=$FB_APP_ID
EOF

echo ""
echo "==> $ENV_FILE written successfully!"
echo ""
echo "Next steps:"
echo "  1. Enable Google sign-in in Firebase Console"
echo "  2. Add http://localhost:3000 to Authorized Domains"
echo "  3. Run: pnpm dev"
