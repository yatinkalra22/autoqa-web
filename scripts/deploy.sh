#!/usr/bin/env bash
# ============================================================================
# AutoQA — Automated Cloud Deployment Script
# ============================================================================
# Builds and deploys AutoQA to Vercel (or Firebase Hosting as fallback).
#
# Usage:
#   ./scripts/deploy.sh [--production]
#
# Options:
#   --production    Deploy to production (default: preview deployment)
#
# Prerequisites:
#   - Vercel CLI: npm i -g vercel
#   - Authenticated: vercel login
#   - Environment variables set in Vercel dashboard or .env.production
# ============================================================================

set -euo pipefail

PROD_FLAG=""
DEPLOY_TARGET="preview"

if [[ "${1:-}" == "--production" ]]; then
  PROD_FLAG="--prod"
  DEPLOY_TARGET="production"
fi

echo "==> AutoQA Cloud Deployment ($DEPLOY_TARGET)"
echo ""

# 1. Pre-flight checks
echo "==> Pre-flight checks..."

if ! command -v vercel &>/dev/null; then
  echo "    ERROR: Vercel CLI not found. Install with: npm i -g vercel"
  exit 1
fi

if [[ ! -f "package.json" ]]; then
  echo "    ERROR: Must be run from project root."
  exit 1
fi

# 2. Verify environment
echo "==> Checking environment variables..."
REQUIRED_VARS=(
  "NEXT_PUBLIC_API_URL"
  "NEXT_PUBLIC_WS_URL"
  "NEXT_PUBLIC_FIREBASE_API_KEY"
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  "NEXT_PUBLIC_FIREBASE_APP_ID"
)

MISSING=0
for var in "${REQUIRED_VARS[@]}"; do
  if ! vercel env ls 2>/dev/null | grep -q "$var"; then
    echo "    WARNING: $var may not be set in Vercel"
    MISSING=$((MISSING + 1))
  fi
done

if [[ $MISSING -gt 0 ]]; then
  echo ""
  echo "    $MISSING variable(s) may be missing. Set them with:"
  echo "    vercel env add VARIABLE_NAME"
  echo ""
fi

# 3. Lint
echo "==> Running lint..."
pnpm lint 2>/dev/null || echo "    Lint warnings found (non-blocking)"

# 4. Build
echo "==> Building..."
pnpm build

# 5. Deploy
echo "==> Deploying to Vercel ($DEPLOY_TARGET)..."
DEPLOY_URL=$(vercel $PROD_FLAG --yes 2>&1 | tail -1)

echo ""
echo "============================================"
echo "  Deployment complete!"
echo "============================================"
echo ""
echo "  URL: $DEPLOY_URL"
echo "  Target: $DEPLOY_TARGET"
echo ""

if [[ "$DEPLOY_TARGET" == "preview" ]]; then
  echo "  To promote to production:"
  echo "    vercel --prod"
fi
