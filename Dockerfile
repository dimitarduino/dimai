# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Install ffmpeg and other dependencies
RUN apk add --no-cache ffmpeg

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) first for better caching
COPY package*.json ./
# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Explicitly set environment variables at build time
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Build the Next.js application
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]