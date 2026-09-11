#!/usr/bin/env bash
set -Eeuo pipefail

AWS_REGION=${AWS_REGION:-ca-central-1}
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-736681843818}
IMAGE_TAG=${IMAGE_TAG:-portfolio-20260910-1}
SITE_DOMAIN=${SITE_DOMAIN:-threadandbutter.ca}
DEPLOY_DIR=${DEPLOY_DIR:-/opt/threadandbutter/deploy}
PARAMETER_PREFIX=${PARAMETER_PREFIX:-/threadandbutter/prod}
REGISTRY=${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
ENV_FILE=${DEPLOY_DIR}/production.env

get_parameter() {
  aws ssm get-parameter \
    --name "${PARAMETER_PREFIX}/$1" \
    --with-decryption \
    --query Parameter.Value \
    --output text \
    --region "${AWS_REGION}"
}

STRIPE_SECRET_KEY=$(get_parameter stripe-secret-key)
SMTP_HOST=$(get_parameter smtp-host)
SMTP_PORT=$(get_parameter smtp-port)
SMTP_USERNAME=$(get_parameter smtp-username)
SMTP_PASSWORD=$(get_parameter smtp-password)
EMAIL_FROM_ADDRESS=$(get_parameter email-from-address)
ADMIN_EMAIL=$(get_parameter admin-email)
CLOUDINARY_CLOUD_NAME=$(get_parameter cloudinary-cloud-name)
CLOUDINARY_API_KEY=$(get_parameter cloudinary-api-key)
CLOUDINARY_API_SECRET=$(get_parameter cloudinary-api-secret)
CLOUDFLARE_ACCOUNT_ID=$(get_parameter cloudflare-account-id)
CLOUDFLARE_API_TOKEN=$(get_parameter cloudflare-api-token)

POSTGRES_PASSWORD=$(openssl rand -hex 32)
AUTH_OTP_PEPPER=$(openssl rand -hex 48)
AUTH_JWT_SECRET=$(openssl rand -hex 48)
CUSTOM_EMBROIDERY_HMAC_SECRET=$(openssl rand -hex 48)

umask 077
{
  printf 'DEPLOY_ENV_FILE=production.env\n'
  printf 'BACKEND_IMAGE=%s/threadandbutter-backend:%s\n' "${REGISTRY}" "${IMAGE_TAG}"
  printf 'FRONTEND_IMAGE=%s/threadandbutter-frontend:%s\n' "${REGISTRY}" "${IMAGE_TAG}"
  printf 'SITE_ADDRESS=%s, www.%s\n' "${SITE_DOMAIN}" "${SITE_DOMAIN}"
  printf 'HTTP_PORT=80\nHTTPS_PORT=443\n'
  printf 'POSTGRES_DB=threadandbutter\nPOSTGRES_USER=threadandbutter\n'
  printf 'POSTGRES_PASSWORD=%s\n' "${POSTGRES_PASSWORD}"
  printf 'VITE_CLOUDINARY_CLOUD_NAME=%s\n' "${CLOUDINARY_CLOUD_NAME}"
  printf 'APP_TIME_ZONE=America/Toronto\n'
  printf 'STOREFRONT_URL=https://%s\n' "${SITE_DOMAIN}"
  printf 'STRIPE_SECRET_KEY=%s\nSTRIPE_WEBHOOK_SECRET=\n' "${STRIPE_SECRET_KEY}"
  printf 'CHECKOUT_FREE_SHIPPING_THRESHOLD_CENTS=10000\n'
  printf 'CHECKOUT_STANDARD_SHIPPING_CENTS=1500\n'
  printf 'CHECKOUT_AUTOMATIC_TAX_ENABLED=false\n'
  printf 'AUTH_OTP_PEPPER=%s\n' "${AUTH_OTP_PEPPER}"
  printf 'AUTH_JWT_SECRET=%s\n' "${AUTH_JWT_SECRET}"
  printf 'CUSTOM_EMBROIDERY_HMAC_SECRET=%s\n' "${CUSTOM_EMBROIDERY_HMAC_SECRET}"
  printf 'AUTH_JWT_ISSUER=https://%s\n' "${SITE_DOMAIN}"
  printf 'AUTH_JWT_AUDIENCE=thread-and-butter-web\n'
  printf 'AUTH_SECURE_COOKIES=true\nAUTH_EMAIL_ENABLED=true\n'
  printf 'PUBLIC_CONTACT_LIMIT=5\nPUBLIC_CONTACT_WINDOW_SECONDS=900\n'
  printf 'PUBLIC_REQUEST_LIMIT=5\nPUBLIC_REQUEST_WINDOW_SECONDS=3600\n'
  printf 'PUBLIC_PREVIEW_LIMIT=10\nPUBLIC_PREVIEW_WINDOW_SECONDS=3600\n'
  printf 'EMAIL_NOTIFICATIONS_ENABLED=true\n'
  printf 'THREAD_AND_BUTTER_ADMIN_EMAIL=%s\n' "${ADMIN_EMAIL}"
  printf 'THREAD_AND_BUTTER_ADMIN_PHONE=+16477005182\n'
  printf 'EMAIL_FROM_ADDRESS=%s\nEMAIL_REPLY_TO_ADDRESS=%s\n' "${EMAIL_FROM_ADDRESS}" "${ADMIN_EMAIL}"
  printf 'SMTP_HOST=%s\nSMTP_PORT=%s\n' "${SMTP_HOST}" "${SMTP_PORT}"
  printf 'SMTP_USERNAME=%s\nSMTP_PASSWORD=%s\n' "${SMTP_USERNAME}" "${SMTP_PASSWORD}"
  printf 'SMTP_AUTH=true\nSMTP_STARTTLS_ENABLED=true\nSMTP_STARTTLS_REQUIRED=true\n'
  printf 'CLOUDINARY_CLOUD_NAME=%s\n' "${CLOUDINARY_CLOUD_NAME}"
  printf 'CLOUDINARY_API_KEY=%s\n' "${CLOUDINARY_API_KEY}"
  printf 'CLOUDINARY_API_SECRET=%s\n' "${CLOUDINARY_API_SECRET}"
  printf 'CLOUDINARY_DELIVERY_TYPE=authenticated\n'
  printf 'CLOUDFLARE_ACCOUNT_ID=%s\n' "${CLOUDFLARE_ACCOUNT_ID}"
  printf 'CLOUDFLARE_API_TOKEN=%s\n' "${CLOUDFLARE_API_TOKEN}"
  printf 'CLOUDFLARE_AI_MODEL=@cf/black-forest-labs/flux-2-klein-4b\n'
  printf 'SMS_NOTIFICATIONS_ENABLED=false\n'
} > "${ENV_FILE}"

chown ubuntu:ubuntu "${ENV_FILE}"
chmod 0600 "${ENV_FILE}"

sudo -u ubuntu -H bash -c \
  "aws ecr get-login-password --region '${AWS_REGION}' | docker login --username AWS --password-stdin '${REGISTRY}'"

sudo -u ubuntu -H bash -c \
  "cd '${DEPLOY_DIR}' && ./scripts/deploy.sh production.env"

