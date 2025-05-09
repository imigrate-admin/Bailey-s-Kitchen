FROM --platform=linux/arm64 node:20

# Set up workspace root
WORKDIR /app

# Copy root package files for workspace setup
COPY package.json package-lock.json ./

# Create apps directory structure
RUN mkdir -p apps/user-service

# Copy user-service package.json
COPY apps/user-service/package.json ./apps/user-service/

# Install dependencies except bcrypt 
RUN npm install

# Copy the rest of the code
COPY . .

# Set working directory to user-service for building and running
WORKDIR /app/apps/user-service

# Install bcrypt with explicit architecture flags
RUN npm uninstall bcrypt && \
    npm install bcrypt --build-from-source --target_arch=arm64 --target_platform=linux

# Build the application
RUN npm run build

# Start the application in development mode
CMD ["npm", "run", "start:dev"]

