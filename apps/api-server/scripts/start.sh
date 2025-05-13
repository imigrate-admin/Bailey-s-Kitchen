#!/bin/sh

# Wait for database to be ready
echo "Waiting for database..."
sleep 5

# Run database migrations
echo "Running database migrations..."
npm run typeorm migration:run

# Start the application
echo "Starting application..."
if [ "$NODE_ENV" = "development" ]; then
  npm run dev
else
  npm run start:prod
fi
