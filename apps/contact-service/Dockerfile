# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Set environment variable to skip husky installation
ENV HUSKY=0
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./
COPY apps/contact-service/package*.json ./apps/contact-service/
COPY apps/contact-service/tsconfig.json ./apps/contact-service/
COPY apps/contact-service/nest-cli.json ./apps/contact-service/

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Build the application
RUN cd apps/contact-service && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Set environment variable to skip husky installation
ENV HUSKY=0
ENV NODE_ENV=production

# Copy package files
COPY package*.json ./
COPY apps/contact-service/package*.json ./apps/contact-service/
COPY apps/contact-service/tsconfig.json ./apps/contact-service/
COPY apps/contact-service/nest-cli.json ./apps/contact-service/

# Install production dependencies
RUN npm install --omit=dev

# Copy built application
COPY --from=builder /app/apps/contact-service/dist ./apps/contact-service/dist

# Copy email templates
COPY apps/contact-service/src/modules/contact/mailer/templates ./apps/contact-service/dist/modules/contact/mailer/templates

# Set environment variables
ENV PORT=5005

# Expose port
EXPOSE 5005

# Start the application
CMD ["node", "apps/contact-service/dist/main"] 