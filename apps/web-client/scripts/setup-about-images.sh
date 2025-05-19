#!/bin/bash

# Define the base public images directory
PUBLIC_DIR="../public/images"
TEAM_DIR="$PUBLIC_DIR/team"

# Create directories if they don't exist
mkdir -p "$PUBLIC_DIR"
mkdir -p "$TEAM_DIR"

# Function to download a placeholder image if it doesn't exist
download_image() {
  local path=$1
  local width=$2
  local height=$3
  
  if [ ! -f "$path" ]; then
    echo "Downloading placeholder image for $path"
    curl "https://via.placeholder.com/${width}x${height}" -o "$path"
  else
    echo "Image already exists: $path"
  fi
}

# Download placeholder images
download_image "$PUBLIC_DIR/about-hero.jpg" 1920 400
download_image "$PUBLIC_DIR/mission.jpg" 800 400
download_image "$TEAM_DIR/founder.jpg" 400 400
download_image "$TEAM_DIR/nutritionist.jpg" 400 400
download_image "$TEAM_DIR/chef.jpg" 400 400

echo "Image setup complete!"
echo "Please replace the placeholder images with actual images in:"
echo "- $PUBLIC_DIR/about-hero.jpg"
echo "- $PUBLIC_DIR/mission.jpg"
echo "- $TEAM_DIR/founder.jpg"
echo "- $TEAM_DIR/nutritionist.jpg"
echo "- $TEAM_DIR/chef.jpg" 