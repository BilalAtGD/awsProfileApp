# ── Production Node.js Backend ───────────────────────────────────────
FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production

# Create and set working directory
WORKDIR /app

# Copy dependency definition files first for layer caching
COPY package*.json ./

# Install only production dependencies (clean and fast)
RUN npm ci --only=production

# Copy application source code
COPY . .

# Use non-root node user for security
USER node

# Document the port Express runs on
EXPOSE 5000

# Start Express API server
CMD ["node", "server.js"]
