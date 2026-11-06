#!/usr/bin/env bash
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

# What goes live must be exactly a tagged Version, so VERSION identifies it.
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Refusing to deploy: the working tree has uncommitted changes." >&2
  exit 1
fi
version="$(node -p 'require("./package.json").version')"
tag="v${version}"
if [[ "$(git rev-parse -q --verify "refs/tags/${tag}^{commit}")" != "$(git rev-parse HEAD)" ]]; then
  echo "Refusing to deploy: HEAD is not tagged ${tag}. See \"Cutting a Version\" in README.md." >&2
  exit 1
fi
if [[ "$(git ls-remote --tags origin "refs/tags/${tag}" | cut -f1)" != "$(git rev-parse "refs/tags/${tag}")" ]]; then
  echo "Refusing to deploy: ${tag} is not on origin. Run: git push origin ${tag}" >&2
  exit 1
fi

pnpm run check
pnpm run build
printf '%s\n%s\n' "$version" "$(git rev-parse HEAD)" > build/client/VERSION

rsync_cmd=(rsync -rlz -e "ssh -p ${DEPLOY_PORT:-22}" ${dry_run:+"$dry_run"})
target="${DEPLOY_HOST}:${DEPLOY_PATH%/}"

# Assets, then the HTML that references them, then deletions: visitors mid-deploy never get HTML pointing at missing files.
"${rsync_cmd[@]}" build/client/assets/ "${target}/assets/"
"${rsync_cmd[@]}" build/client/ "${target}/"
"${rsync_cmd[@]}" --delete build/client/ "${target}/"

echo "Deployed ${tag} ($(git rev-parse --short HEAD)) to ${target}${dry_run:+ (dry run)}"
