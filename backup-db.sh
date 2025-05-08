#!/bin/bash
# ------------------------------------------------------------------------------
# Database Backup Script for Bailey's Kitchen
#
# This script creates timestamped backups of the PostgreSQL database,
# manages backup retention, and handles errors appropriately.
#
# Usage: ./backup-db.sh [MAX_BACKUPS]
# - MAX_BACKUPS: Optional. Number of backups to keep (defaults to 7)
#
# Examples:
#   ./backup-db.sh        # Keeps last 7 backups
#   ./backup-db.sh 14     # Keeps last 14 backups
# ------------------------------------------------------------------------------

# Configuration
CONTAINER_NAME="baileys-kitchen-postgres"
DB_USER="postgres"
DB_NAME="baileys_kitchen"
BACKUP_DIR="/var/lib/postgresql/backup"
HOST_BACKUP_DIR="./db-backups"  # Local directory to store backups
MAX_BACKUPS=${1:-7}             # Default to keeping 7 backups
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${DB_NAME}_backup_${TIMESTAMP}.sql"
LOG_FILE="./db-backup.log"

# Create local backup directory if it doesn't exist
mkdir -p "${HOST_BACKUP_DIR}"

# Function to log messages
log_message() {
    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    echo "[$timestamp] $1" | tee -a "${LOG_FILE}"
}

# Function to handle errors
handle_error() {
    log_message "ERROR: $1"
    exit 1
}

# Check if the container is running
if ! docker ps | grep -q $CONTAINER_NAME; then
    handle_error "Container $CONTAINER_NAME is not running"
fi

# Ensure backup directory exists in the container
log_message "Ensuring backup directory exists in the container..."
docker exec $CONTAINER_NAME mkdir -p $BACKUP_DIR || handle_error "Failed to create backup directory"

# Create the backup
log_message "Creating backup: $BACKUP_FILE"
if docker exec $CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME -f "${BACKUP_DIR}/${BACKUP_FILE}"; then
    log_message "Backup created successfully in container"
else
    handle_error "Failed to create backup"
fi

# Copy the backup from the container to the host
log_message "Copying backup to host system..."
docker cp "${CONTAINER_NAME}:${BACKUP_DIR}/${BACKUP_FILE}" "${HOST_BACKUP_DIR}/" || \
    handle_error "Failed to copy backup to host"

log_message "Backup copied to host: ${HOST_BACKUP_DIR}/${BACKUP_FILE}"

# Compress the backup file on the host
log_message "Compressing backup file..."
gzip -f "${HOST_BACKUP_DIR}/${BACKUP_FILE}" || handle_error "Failed to compress backup"
log_message "Backup compressed: ${HOST_BACKUP_DIR}/${BACKUP_FILE}.gz"

# Manage backup retention
log_message "Managing backup retention (keeping last $MAX_BACKUPS backups)..."
BACKUP_COUNT=$(ls -1 "${HOST_BACKUP_DIR}"/*.gz 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS" ]; then
    # Calculate how many files to delete
    DELETE_COUNT=$((BACKUP_COUNT - MAX_BACKUPS))
    
    # Delete oldest backups
    ls -1t "${HOST_BACKUP_DIR}"/*.gz | tail -n $DELETE_COUNT | while read file; do
        log_message "Removing old backup: $file"
        rm "$file" || log_message "WARNING: Failed to remove $file"
    done
    
    log_message "Removed $DELETE_COUNT old backup(s)"
fi

# Show summary
log_message "Backup completed successfully."
log_message "Total backups: $(ls -1 "${HOST_BACKUP_DIR}"/*.gz 2>/dev/null | wc -l)"

# Make the script executable
chmod +x backup-db.sh

exit 0

