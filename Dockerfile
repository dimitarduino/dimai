# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Install ffmpeg and other dependencies
RUN apk add --no-cache ffmpeg

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY .npmrc ./
RUN npm install --legacy-peer-deps

# Copy the rest of the app (excluding .env.production)
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]