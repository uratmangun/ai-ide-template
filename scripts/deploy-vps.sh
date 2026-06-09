#!/usr/bin/env bash
set -euo pipefail

REMOTE="${REMOTE:-ubuntu@100.117.130.2}"
IMAGE_TAG="${IMAGE_TAG:-localhost/ai-ide-template:latest}"
SERVICE="${SERVICE:-ai-ide-template.service}"
TAR_PATH="${TAR_PATH:-/tmp/ai-ide-template.tar}"
DOMAIN="${DOMAIN:-https://ai-template.uratmangun.ovh/}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> Building image ${IMAGE_TAG}"
podman build -t "${IMAGE_TAG}" .

echo "==> Saving image to ${TAR_PATH}"
podman save -o "${TAR_PATH}" "${IMAGE_TAG}"

echo "==> Copying image to ${REMOTE}"
scp "${TAR_PATH}" "${REMOTE}:${TAR_PATH}"

echo "==> Loading image and restarting ${SERVICE}"
ssh "${REMOTE}" bash -s <<EOF
set -euo pipefail
podman load -i ${TAR_PATH}
if systemctl --user is-active ${SERVICE} >/dev/null 2>&1; then
  systemctl --user restart ${SERVICE}
elif systemctl is-active ${SERVICE} >/dev/null 2>&1; then
  sudo systemctl restart ${SERVICE}
else
  echo "Service ${SERVICE} not found (user or system). Check quadlet unit name."
  exit 1
fi
podman ps --filter name=ai-ide-template
curl -fsSI http://127.0.0.1:3000 | head -n 1
EOF

echo "==> Checking public domain"
curl -fsS -o /dev/null -w "HTTP %{http_code} %{url_effective}\n" "${DOMAIN}"
