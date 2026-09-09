#!/usr/bin/env bash
# Despliegue del sitio estático en S3 + CloudFront.
# Documentación completa del montaje en DEPLOY.md.
set -euo pipefail

BUCKET="${COZETA_BUCKET:-cozeta-web-prod}"
DISTRIBUTION_ID="${COZETA_DISTRIBUTION_ID:-}"
PERFIL="${AWS_PROFILE:-cozeta}"

if [ -z "$DISTRIBUTION_ID" ]; then
  echo "Falta COZETA_DISTRIBUTION_ID (id de la distribución de CloudFront)." >&2
  echo "Ejemplo: COZETA_DISTRIBUTION_ID=E1234ABCDEF ./deploy.sh" >&2
  exit 1
fi

echo "▸ Generando el build de producción"
npm run build

echo "▸ Subiendo assets con hash (caché de 1 año, inmutables)"
aws s3 sync dist/ "s3://$BUCKET" --delete --profile "$PERFIL" \
  --exclude "*" --include "_astro/*" \
  --cache-control "public, max-age=31536000, immutable"

echo "▸ Subiendo imágenes, modelos y demás estáticos (30 días)"
aws s3 sync dist/ "s3://$BUCKET" --delete --profile "$PERFIL" \
  --exclude "_astro/*" --exclude "*.html" --exclude "*.xml" --exclude "robots.txt" \
  --cache-control "public, max-age=2592000"

# El HTML no lleva hash en el nombre: si se cachea, los usuarios se quedan
# con la versión anterior aunque los assets ya sean nuevos.
echo "▸ Subiendo HTML (sin caché de navegador)"
aws s3 sync dist/ "s3://$BUCKET" --delete --profile "$PERFIL" \
  --exclude "*" --include "*.html" \
  --cache-control "public, max-age=0, must-revalidate"

echo "▸ Subiendo sitemap y robots.txt (1 hora)"
aws s3 sync dist/ "s3://$BUCKET" --delete --profile "$PERFIL" \
  --exclude "*" --include "*.xml" --include "robots.txt" \
  --cache-control "public, max-age=3600"

echo "▸ Invalidando la caché de CloudFront"
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --profile "$PERFIL" \
  --query 'Invalidation.Id' --output text

echo "✓ Desplegado. Repasa el checklist final de DEPLOY.md."
