FROM node:22-alpine AS build

WORKDIR /workspace

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite embeds VITE_* variables in the compiled browser bundle. A Cloudinary cloud
# name is public configuration, not a secret.
ARG VITE_CLOUDINARY_CLOUD_NAME
ENV VITE_CLOUDINARY_CLOUD_NAME=${VITE_CLOUDINARY_CLOUD_NAME}

RUN npm run build

FROM caddy:2-alpine AS runtime

COPY --from=build /workspace/dist /srv

EXPOSE 80 443 443/udp
