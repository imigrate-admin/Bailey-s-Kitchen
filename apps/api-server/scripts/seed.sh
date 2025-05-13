#!/bin/sh

# Wait for database to be ready
echo "Waiting for database..."
sleep 5

# Run the seeder
echo "Running database seeder..."
ts-node src/config/seed.ts
