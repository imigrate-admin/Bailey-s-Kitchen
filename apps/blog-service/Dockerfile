FROM node:18-bullseye-slim

WORKDIR /app

# Install OpenSSL 1.1
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY apps/blog-service/package*.json ./apps/blog-service/

# Install dependencies
RUN npm install
RUN cd apps/blog-service && npm install

# Install global dependencies
RUN npm install -g typescript ts-node

# Copy source code and config files
COPY apps/blog-service/prisma ./apps/blog-service/prisma
COPY apps/blog-service/src ./apps/blog-service/src
COPY apps/blog-service/tsconfig.json ./apps/blog-service/

# Set working directory to blog service
WORKDIR /app/apps/blog-service

# Generate Prisma client
RUN npx prisma generate

# Create dist directory and compile TypeScript
RUN npx tsc --project tsconfig.json

# Expose port
EXPOSE 5004

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5004
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/baileys_kitchen?schema=public"

# Start the service
CMD ["node", "dist/index.js"] 