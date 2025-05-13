FROM --platform=linux/arm64 node:20

# Set up workspace root
WORKDIR /app

# Copy root package files for workspace setup
COPY package.json package-lock.json ./

# Create apps directory structure
RUN mkdir -p apps/product-service

# Copy product-service package.json
COPY apps/product-service/package.json ./apps/product-service/

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Set working directory to product-service for building and running
WORKDIR /app/apps/product-service

# Build the application
RUN npm run build

# Start the application in development mode
CMD ["npm", "run", "start:dev"]

