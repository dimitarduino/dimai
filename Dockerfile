# syntax=docker/dockerfile:1

############################
# 1) Dependencies stage
############################
FROM node:20-alpine AS deps

WORKDIR /app

# Install only what is needed to install node modules
COPY package*.json ./
COPY .npmrc ./

# deterministic install (better than npm install)
RUN npm ci --legacy-peer-deps


############################
# 2) Build stage
############################
FROM node:20-alpine AS builder

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY . .

# Build Next.js
RUN npm run build


############################
# 3) Runtime stage (secure)
############################
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# install ffmpeg only in runtime (needed by app)
RUN apk add --no-cache ffmpeg

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy only needed runtime files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Install ONLY production dependencies
COPY --from=deps /app/node_modules ./node_modules
RUN npm prune --omit=dev

# Fix permissions
RUN chown -R app:app /app

USER app

EXPOSE 3000
CMD ["npm", "start"]