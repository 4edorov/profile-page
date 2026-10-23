#!/usr/bin/env bash
# Build the Profile Site locally and copy it to the server over SSH.
# There is no CI: the local checks below are the only gate before going live.
# See docs/adr/0003-self-hosted-manual-deploy.md.
#
# Usage: pnpm run deploy [--dry-run]
set -euo pipefail
cd "$(dirname "$0")/.."

dry_run=""
case "${1:-}" in
  "") ;;
  --dry-run) dry_run="--dry-run" ;;
  *)
    echo "usage: pnpm run deploy [--dry-run]" >&2
    exit 2
    ;;
esac

if [[ ! -f .env.deploy ]]; then
  echo "Missing .env.deploy: copy .env.deploy.example and fill it in." >&2
  exit 1
fi
set -a
# shellcheck source=/dev/null
source .env.deploy
set +a
: "${DEPLOY_HOST:?DEPLOY_HOST must be set in .env.deploy}"
: "${DEPLOY_PATH:?DEPLOY_PATH must be set in .env.deploy}"

# What goes live must be exactly a commit, so VERSION identifies it.
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Refusing to deploy: the working tree has uncommitted changes." >&2
  exit 1
fi

pnpm run check
pnpm run build
git rev-parse HEAD > build/client/VERSION

rsync_cmd=(rsync -rlz -e "ssh -p ${DEPLOY_PORT:-22}" ${dry_run:+"$dry_run"})
target="${DEPLOY_HOST}:${DEPLOY_PATH%/}"

# In-place update, ordered so visitors mid-deploy never get HTML that points
# at missing files: new hashed assets first, then the HTML and data that
# reference them, and only then remove what the new build no longer has.
"${rsync_cmd[@]}" build/client/assets/ "${target}/assets/"
"${rsync_cmd[@]}" build/client/ "${target}/"
"${rsync_cmd[@]}" --delete build/client/ "${target}/"

echo "Deployed $(cat build/client/VERSION) to ${target}${dry_run:+ (dry run)}"
