#!/bin/bash
# ------------------------------------------------------------------------------
# Database Restore Script for Bailey's Kitchen
#
# This script restores a PostgreSQL database from a backup file,
# creates a safety backup before restoration, verifies backup integrity,
# and handles errors appropriately.
#
# Usage: ./restore-db.sh BACKUP_FILE [--force]
# - BACKUP_FILE: Path to the backup file (can be .sql or .sql.gz)
# - --force: Optional. Skip confirmation prompts
#
# Examples:
#   ./restore-db.sh ./db-backups/baileys_kitchen_backup_20250508_120000.sql.gz
#   ./restore-db.sh ./db-backups/baileys_kitchen_backup_20250508_120000.sql --force
# ------------------------------------------------------------------------------

# Configuration
CONTAINER_NAME="baileys-kitchen-postgres"
DB_USER="postgres"
DB_NAME="baileys_kitchen"
BACKUP_DIR="/var/lib/postgresql/backup"
TEMP_DIR="/tmp"
LOG_FILE="./db-restore.log"
FORCE_MODE=false

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

# Parse arguments
if [ "$#" -lt 1 ]; then
    echo "Usage: ./restore-db.sh BACKUP_FILE [--force]"
    echo "Example: ./restore-db.sh ./db-backups/baileys_kitchen_backup_20250508_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

# Check for force flag
if [ "$#" -gt 1 ] && [ "$2" == "--force" ]; then
    FORCE_MODE=true
    log_message "Force mode enabled, skipping confirmations"
fi

# Verify backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    handle_error "Backup file not found: $BACKUP_FILE"
fi

log_message "Starting database restore process"
log_message "Using backup file: $BACKUP_FILE"

# Check if the container is running
if ! docker ps | grep -q $CONTAINER_NAME; then
    handle_error "Container $CONTAINER_NAME is not running"
fi

# Create a safety backup before restoration
SAFETY_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SAFETY_BACKUP="${DB_NAME}_safety_backup_${SAFETY_TIMESTAMP}.sql"
log_message "Creating safety backup before restoration: $SAFETY_BACKUP"

if docker exec $CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME -f "${BACKUP_DIR}/${SAFETY_BACKUP}"; then
    log_message "Safety backup created successfully: ${BACKUP_DIR}/${SAFETY_BACKUP}"
else
    if [ "$FORCE_MODE" = false ]; then
        read -p "Failed to create safety backup. Continue anyway? (y/N): " confirm
        if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
            handle_error "Restoration aborted by user"
        fi
    else
        log_message "WARNING: Failed to create safety backup but continuing due to force mode"
    fi
fi

# Check if the backup is compressed
IS_COMPRESSED=false
if [[ "$BACKUP_FILE" == *.gz ]]; then
    IS_COMPRESSED=true
    log_message "Backup is compressed, preparing for decompression"
fi

# Confirmation prompt
if [ "$FORCE_MODE" = false ]; then
    echo "WARNING: This will overwrite the current database with data from the backup."
    echo "Database: $DB_NAME in container $CONTAINER_NAME"
    echo "Backup file: $BACKUP_FILE"
    read -p "Are you sure you want to proceed? (y/N): " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        log_message "Restoration aborted by user"
        exit 0
    fi
fi

# Process the backup file
if [ "$IS_COMPRESSED" = true ]; then
    # For compressed files
    TEMP_UNCOMPRESSED="${TEMP_DIR}/$(basename "$BACKUP_FILE" .gz)"
    log_message "Decompressing backup file..."
    if gunzip -c "$BACKUP_FILE" > "$TEMP_UNCOMPRESSED"; then
        log_message "Backup decompressed successfully to $TEMP_UNCOMPRESSED"
        RESTORE_FILE="$TEMP_UNCOMPRESSED"
    else
        handle_error "Failed to decompress backup file"
    fi
else
    # For uncompressed files
    RESTORE_FILE="$BACKUP_FILE"
fi

# Copy the backup file to the container
CONTAINER_RESTORE_FILE="${BACKUP_DIR}/$(basename "$RESTORE_FILE")"
log_message "Copying backup file to container..."
if docker cp "$RESTORE_FILE" "${CONTAINER_NAME}:${CONTAINER_RESTORE_FILE}"; then
    log_message "Backup file copied to container: $CONTAINER_RESTORE_FILE"
else
    handle_error "Failed to copy backup file to container"
fi

# Verify backup integrity
log_message "Verifying backup integrity..."
if ! docker exec $CONTAINER_NAME psql -U $DB_USER -d postgres -c "\l" > /dev/null 2>&1; then
    handle_error "PostgreSQL server not responding for verification check"
fi

# Restore the database
log_message "Restoring database from backup..."
if docker exec $CONTAINER_NAME psql -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME}_temp;" && \
   docker exec $CONTAINER_NAME psql -U $DB_USER -d postgres -c "CREATE DATABASE ${DB_NAME}_temp;" && \
   docker exec $CONTAINER_NAME psql -U $DB_USER -d "${DB_NAME}_temp" -f "$CONTAINER_RESTORE_FILE"; then
    log_message "Database restored to temporary database for verification"
else
    handle_error "Failed to restore to temporary database for verification"
fi

# Verify restoration success
log_message "Verifying restoration success..."
if ! docker exec $CONTAINER_NAME psql -U $DB_USER -d "${DB_NAME}_temp" -c "\dt" > /dev/null 2>&1; then
    handle_error "Temporary restored database verification failed"
fi

# Final confirmation
if [ "$FORCE_MODE" = false ]; then
    echo "Verification successful. Ready to replace the production database."
    read -p "Proceed with final restoration? (y/N): " final_confirm
    if [[ ! "$final_confirm" =~ ^[Yy]$ ]]; then
        log_message "Final restoration aborted by user"
        docker exec $CONTAINER_NAME psql -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME}_temp;"
        exit 0
    fi
fi

# Perform actual restoration
log_message "Performing final database restoration..."
if docker exec $CONTAINER_NAME psql -U $DB_USER -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB_NAME}';" && \
   docker exec $CONTAINER_NAME psql -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS ${DB_NAME};" && \
   docker exec $CONTAINER_NAME psql -U $DB_USER -d postgres -c "ALTER DATABASE ${DB_NAME}_temp RENAME TO ${DB_NAME};"; then
    log_message "Database restored successfully!"
else
    handle_error "Failed to perform final database restoration"
fi

# Clean up
if [ "$IS_COMPRESSED" = true ]; then
    log_message "Cleaning up temporary files..."
    rm -f "$TEMP_UNCOMPRESSED"
fi

# Show summary
log_message "Restoration process completed successfully."
log_message "Database '$DB_NAME' has been restored from: $BACKUP_FILE"
log_message "Safety backup is available at: ${BACKUP_DIR}/${SAFETY_BACKUP}"

# Make the script executable
chmod +x restore-db.sh

exit 0

