# ── Stage 1: Build React 19 SPA with Vite ───────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for Vite)
RUN npm ci

# Copy frontend source code
COPY . .

# Build arguments for Vite environment variables
ARG VITE_BACKEND_URL=""
ARG VITE_GOOGLE_CLIENT_ID=""

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Compile static bundle into /app/dist
RUN npm run build

# ── Stage 2: Serve with Nginx Alpine (Ultra-lightweight ~25MB) ──────
FROM nginx:alpine

# Clean out default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration with SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
