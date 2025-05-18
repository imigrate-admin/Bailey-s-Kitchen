#!/bin/bash

# Define the path to the .env file
ENV_FILE="../.env"

# Check if .env file already exists
if [ -f "$ENV_FILE" ]; then
    read -p "The .env file already exists. Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

# Create or overwrite the .env file
cat > "$ENV_FILE" << EOL
# Server Configuration
NODE_ENV=development
PORT=5004

# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/baileys_kitchen?schema=public"

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,http://web-client:3000,http://baileys-kitchen-web-client:3000

# Logging Configuration
LOG_LEVEL=debug

# API Configuration
API_PREFIX=/api/blog

# Security Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h

# Rate Limiting
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX_REQUESTS=100

# Cache Configuration
CACHE_TTL=3600 # 1 hour in seconds

# Pagination Defaults
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=50
EOL

# Make the file readable only by the owner
chmod 600 "$ENV_FILE"

echo "Environment file has been created at $ENV_FILE"
echo "Please review and modify the values as needed."
echo "Important: Make sure to change the JWT_SECRET to a secure value in production!" 