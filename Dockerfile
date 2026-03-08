# -----------------------------
# BUILD STAGE
# -----------------------------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Install ffmpeg if needed
    RUN apk add --no-cache ffmpeg
    
    # Copy package files and install dependencies
    COPY package*.json ./
    COPY .npmrc ./
    RUN npm ci --legacy-peer-deps
    
    # Copy the rest of the source code
    COPY . .
    
    # -----------------------------
    # Build-time public environment variables
    # -----------------------------
    ARG NEXT_PUBLIC_APP_URL
    ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    ARG NEXT_PUBLIC_CLERK_SIGN_IN_URL
    ARG NEXT_PUBLIC_CLERK_SIGN_UP_URL
    ARG NEXT_PUBLIC_FIREBASE_APIKEY
    ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    ARG NEXT_PUBLIC_FIREBASE_APP_ID
    ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    ARG NEXT_PUBLIC_DATABASE_URL
    ARG VERCEL_URL
    
    ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
    ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    ENV NEXT_PUBLIC_CLERK_SIGN_IN_URL=$NEXT_PUBLIC_CLERK_SIGN_IN_URL
    ENV NEXT_PUBLIC_CLERK_SIGN_UP_URL=$NEXT_PUBLIC_CLERK_SIGN_UP_URL
    ENV NEXT_PUBLIC_FIREBASE_APIKEY=$NEXT_PUBLIC_FIREBASE_APIKEY
    ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
    ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    ENV NEXT_PUBLIC_DATABASE_URL=$NEXT_PUBLIC_DATABASE_URL
    ENV VERCEL_URL=$VERCEL_URL
    
    # Build the Next.js app
    RUN npm run build
    
    # -----------------------------
    # RUNTIME STAGE
    # -----------------------------
    FROM node:20-alpine AS runtime
    
    WORKDIR /app
    ENV NODE_ENV=production
    
    # Install ffmpeg for runtime video processing
    RUN apk add --no-cache ffmpeg
    
    # Create non-root user
    RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
    
    # Copy built app from builder stage
    COPY --from=builder /app ./
    
    # Set permissions for non-root user
    RUN chown -R nextjs:nodejs /app
    
    # Switch to non-root
    USER nextjs
    
    # Expose port
    EXPOSE 3000
    
    # Use tmpfs for Next.js cache and /tmp for runtime temp files (set when running container)
    # Start the Next.js app
    CMD ["npm", "start"]