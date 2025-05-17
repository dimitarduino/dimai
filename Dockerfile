# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Install ffmpeg and other dependencies
RUN apk add --no-cache ffmpeg

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app (excluding .env.production)
COPY . .

# Optional: set ARGs if you're injecting at build time (but not needed on Render)
# ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]