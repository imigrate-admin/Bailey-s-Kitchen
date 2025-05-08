#!/bin/bash
# ------------------------------------------------------------------------------
# Database Monitoring Script for Bailey's Kitchen
#
# This script monitors the health of the PostgreSQL database system:
# - Checks backup status and age
# - Verifies database connectivity
# - Monitors disk space usage
# - Examines logs for errors
# - Sends alerts if issues are found
# - Generates a health report
#
# Usage: ./monitor-db.sh [--email=recipient@example.com] [--slack=webhook_url]
#        ./monitor-db.sh --threshold=3 --critical=1
#
# Options:
#   --email=EMAIL     Send report to this email (requires mailx)
#   --slack=URL       Send alerts to Slack webhook URL
#   --threshold=DAYS  Warning if no backups in last N days (default: 2)
#   --critical=DAYS   Critical if no backups in last N days (default: 3)
#   --quiet           Suppress output except for errors
#   --json            Output in JSON format
#
# Exit codes:
#   0 - All checks passed
#   1 - Warning level issues found
#   2 - Critical issues found
# ------------------------------------------------------------------------------

# Configuration
CONTAINER_NAME="baileys-kitchen-postgres"
DB_USER="postgres"
DB_NAME="baileys_kitchen"
BACKUP_DIR="./db-backups"
LOG_FILES=("db-backup.log" "db-restore.log")
REPORT_FILE="./db-health-report.html"
JSON_REPORT_FILE="./db-health-report.json"
WARNING_THRESHOLD=2  # Days
CRITICAL_THRESHOLD=3 # Days
EMAIL_RECIPIENT=""
SLACK_WEBHOOK=""
QUIET_MODE=false
JSON_OUTPUT=false

# Status tracking
STATUS="OK"  # OK, WARNING, CRITICAL
ISSUES=()
WARNINGS=0
CRITICALS=0

# Color codes for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Parse command-line arguments
for arg in "$@"; do
    case $arg in
        --email=*)
            EMAIL_RECIPIENT="${arg#*=}"
            ;;
        --slack=*)
            SLACK_WEBHOOK="${arg#*=}"
            ;;
        --threshold=*)
            WARNING_THRESHOLD="${arg#*=}"
            ;;
        --critical=*)
            CRITICAL_THRESHOLD="${arg#*=}"
            ;;
        --quiet)
            QUIET_MODE=true
            ;;
        --json)
            JSON_OUTPUT=true
            ;;
        *)
            echo "Unknown argument: $arg"
            echo "Usage: ./monitor-db.sh [--email=recipient@example.com] [--slack=webhook_url]"
            exit 1
            ;;
    esac
done

# Function to print log messages
log_message() {
    local level=$1
    local message=$2
    
    if [ "$QUIET_MODE" = false ] || [ "$level" = "ERROR" ] || [ "$level" = "CRITICAL" ]; then
        local color=$NC
        case $level in
            "OK") color=$GREEN ;;
            "INFO") color=$NC ;;
            "WARNING") color=$YELLOW ;;
            "ERROR"|"CRITICAL") color=$RED ;;
        esac
        
        echo -e "${color}[$(date +"%Y-%m-%d %H:%M:%S")] ${level}: ${message}${NC}"
    fi
}

# Function to update status
update_status() {
    local level=$1
    local message=$2
    
    ISSUES+=("${level}: ${message}")
    
    case $level in
        "WARNING")
            WARNINGS=$((WARNINGS + 1))
            if [ "$STATUS" = "OK" ]; then
                STATUS="WARNING"
            fi
            ;;
        "CRITICAL")
            CRITICALS=$((CRITICALS + 1))
            STATUS="CRITICAL"
            ;;
    esac
}

# Function to send Slack alert
send_slack_alert() {
    local message=$1
    local color=$2  # good (green), warning (yellow), danger (red)
    
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -s -X POST -H 'Content-type: application/json' \
            --data "{\"attachments\":[{\"color\":\"${color}\",\"title\":\"Database Health Alert\",\"text\":\"${message}\"}]}" \
            $SLACK_WEBHOOK > /dev/null
        
        if [ $? -eq 0 ]; then
            log_message "INFO" "Slack notification sent"
        else
            log_message "WARNING" "Failed to send Slack notification"
        fi
    fi
}

# Function to send email alert
send_email_alert() {
    local subject=$1
    local message=$2
    
    if [ -n "$EMAIL_RECIPIENT" ]; then
        if command -v mail > /dev/null 2>&1; then
            echo -e "$message" | mail -s "$subject" $EMAIL_RECIPIENT
            
            if [ $? -eq 0 ]; then
                log_message "INFO" "Email notification sent to $EMAIL_RECIPIENT"
            else
                log_message "WARNING" "Failed to send email notification"
            fi
        else
            log_message "WARNING" "Mail command not found. Cannot send email."
        fi
    fi
}

# Generate HTML report header
generate_report_header() {
    cat > $REPORT_FILE << EOL
<!DOCTYPE html>
<html>
<head>
    <title>Database Health Report - $(date +"%Y-%m-%d")</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1000px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        h2 { color: #444; margin-top: 20px; }
        .ok { color: green; }
        .warning { color: orange; }
        .critical { color: red; }
        .summary { font-weight: bold; margin: 20px 0; font-size: 1.2em; padding: 10px; border-radius: 5px; }
        .summary.ok { background-color: #e8f5e9; color: #2e7d32; }
        .summary.warning { background-color: #fff8e1; color: #ff8f00; }
        .summary.critical { background-color: #ffebee; color: #c62828; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .timestamp { color: #888; font-size: 0.8em; }
    </style>
</head>
<body>
    <h1>Database Health Report</h1>
    <p class="timestamp">Generated on: $(date)</p>
EOL
}

# Initialize JSON report
initialize_json_report() {
    cat > $JSON_REPORT_FILE << EOL
{
  "timestamp": "$(date -Iseconds)",
  "status": "initializing",
  "checks": []
}
EOL
}

# Add a check result to JSON report
add_json_check() {
    local name=$1
    local status=$2
    local details=$3
    
    # Create a temporary file with the new check
    local temp_file=$(mktemp)
    jq --arg name "$name" --arg status "$status" --arg details "$details" \
       '.checks += [{"name": $name, "status": $status, "details": $details}]' \
       $JSON_REPORT_FILE > $temp_file
    
    # Replace the original file
    mv $temp_file $JSON_REPORT_FILE
}

# Update final JSON status
update_json_status() {
    local temp_file=$(mktemp)
    jq --arg status "$STATUS" --arg warnings "$WARNINGS" --arg criticals "$CRITICALS" \
       '.status = $status | .warnings = ($warnings | tonumber) | .criticals = ($criticals | tonumber)' \
       $JSON_REPORT_FILE > $temp_file
    
    # Replace the original file
    mv $temp_file $JSON_REPORT_FILE
}

# Check if required tools are available
check_requirements() {
    log_message "INFO" "Checking required tools..."
    
    if ! command -v docker > /dev/null 2>&1; then
        update_status "CRITICAL" "Docker not found"
        return 1
    fi
    
    if ! command -v jq > /dev/null 2>&1; then
        log_message "WARNING" "jq not found. JSON output features will be limited."
    fi
    
    if [ -n "$EMAIL_RECIPIENT" ] && ! command -v mail > /dev/null 2>&1; then
        log_message "WARNING" "mail command not found. Email notifications will not work."
    fi
    
    return 0
}

# Check if container is running
check_container() {
    log_message "INFO" "Checking container status..."
    
    if docker ps | grep -q $CONTAINER_NAME; then
        local container_status=$(docker inspect -f '{{.State.Status}}' $CONTAINER_NAME)
        local health_status=$(docker inspect -f '{{.State.Health.Status}}' $CONTAINER_NAME 2>/dev/null || echo "N/A")
        
        log_message "OK" "Container $CONTAINER_NAME is running (Status: $container_status, Health: $health_status)"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "container_status" "OK" "Container $CONTAINER_NAME is running (Status: $container_status, Health: $health_status)"
        fi
        
        echo "<h2>Container Status</h2>" >> $REPORT_FILE
        echo "<p class='ok'>Container $CONTAINER_NAME is running</p>" >> $REPORT_FILE
        echo "<ul>" >> $REPORT_FILE
        echo "<li>Status: $container_status</li>" >> $REPORT_FILE
        echo "<li>Health: $health_status</li>" >> $REPORT_FILE
        echo "</ul>" >> $REPORT_FILE
        
        return 0
    else
        update_status "CRITICAL" "Container $CONTAINER_NAME is not running"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "container_status" "CRITICAL" "Container $CONTAINER_NAME is not running"
        fi
        
        echo "<h2>Container Status</h2>" >> $REPORT_FILE
        echo "<p class='critical'>Container $CONTAINER_NAME is not running</p>" >> $REPORT_FILE
        
        return 1
    fi
}

# Check database connectivity
check_db_connectivity() {
    log_message "INFO" "Checking database connectivity..."
    
    if docker exec $CONTAINER_NAME pg_isready -U $DB_USER -d $DB_NAME > /dev/null 2>&1; then
        log_message "OK" "Successfully connected to database $DB_NAME"
        
        local db_version=$(docker exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT version();")
        local db_uptime=$(docker exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT date_trunc('second', current_timestamp - pg_postmaster_start_time());")
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "db_connectivity" "OK" "Successfully connected to database $DB_NAME (Version: ${db_version}, Uptime: ${db_uptime})"
        fi
        
        echo "<h2>Database Connectivity</h2>" >> $REPORT_FILE
        echo "<p class='ok'>Successfully connected to database $DB_NAME</p>" >> $REPORT_FILE
        echo "<ul>" >> $REPORT_FILE
        echo "<li>Version: ${db_version}</li>" >> $REPORT_FILE
        echo "<li>Uptime: ${db_uptime}</li>" >> $REPORT_FILE
        echo "</ul>" >> $REPORT_FILE
        
        return 0
    else
        update_status "CRITICAL" "Failed to connect to database $DB_NAME"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "db_connectivity" "CRITICAL" "Failed to connect to database $DB_NAME"
        fi
        
        echo "<h2>Database Connectivity</h2>" >> $REPORT_FILE
        echo "<p class='critical'>Failed to connect to database $DB_NAME</p>" >> $REPORT_FILE
        
        return 1
    fi
}

# Check backup status
check_backup_status() {
    log_message "INFO" "Checking backup status..."
    
    if [ ! -d "$BACKUP_DIR" ]; then
        update_status "WARNING" "Backup directory $BACKUP_DIR does not exist"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "backup_status" "WARNING" "Backup directory $BACKUP_DIR does not exist"
        fi
        
        echo "<h2>Backup Status</h2>" >> $REPORT_FILE
        echo "<p class='warning'>Backup directory $BACKUP_DIR does not exist</p>" >> $REPORT_FILE
        
        return 1
    fi
    
    # Count backups
    local backup_count=$(find $BACKUP_DIR -name "*.sql*" | wc -l | tr -d ' ')
    
    # Find latest backup
    local latest_backup=$(find $BACKUP_DIR -name "*.sql*" -type f -printf "%T@ %p\n" 2>/dev/null | sort -nr | head -1 | cut -d' ' -f2-)
    
    # Get latest backup age in days
    local backup_age=0 # Default to 0 for new or fresh backups
    
    if [ -n "$latest_backup" ]; then
        local backup_time=$(date -r "$latest_backup" +%s)
        local current_time=$(date +%s)
        backup_age=$(( (current_time - backup_time) / 86400 ))
    fi
    
    echo "<h2>Backup Status</h2>" >> $REPORT_FILE
    echo "<table>" >> $REPORT_FILE
    echo "<tr><th>Metric</th><th>Value</th></tr>" >> $REPORT_FILE
    echo "<tr><td>Total Backups</td><td>$backup_count</td></tr>" >> $REPORT_FILE
    
    if [ -n "$latest_backup" ]; then
        local backup_timestamp=$(date -r "$latest_backup" "+%Y-%m-%d %H:%M:%S")
        local backup_size=$(ls -lh "$latest_backup" | awk '{print $5}')
        echo "<tr><td>Latest Backup</td><td>$(basename "$latest_backup")</td></tr>" >> $REPORT_FILE
        echo "<tr><td>Backup Date</td><td>$backup_timestamp</td></tr>" >> $REPORT_FILE
        echo "<tr><td>Backup Size</td><td>$backup_size</td></tr>" >> $REPORT_FILE
        echo "<tr><td>Backup Age</td><td>$backup_age days</td></tr>" >> $REPORT_FILE
    else
        echo "<tr><td>Latest Backup</td><td>No backups found</td></tr>" >> $REPORT_FILE
    fi
    echo "</table>" >> $REPORT_FILE
    
    # Evaluate backup status
    if [ "$backup_count" -eq 0 ]; then
        update_status "CRITICAL" "No backups found"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "backup_status" "CRITICAL" "No backups found"
        fi
        
        echo "<p class='critical'>No backups found</p>" >> $REPORT_FILE
        return 2
    elif [ "$backup_age" -ge "$CRITICAL_THRESHOLD" ]; then
        update_status "CRITICAL" "Latest backup is $backup_age days old (threshold: $CRITICAL_THRESHOLD days)"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "backup_status" "CRITICAL" "Latest backup is $backup_age days old (threshold: $CRITICAL_THRESHOLD days)"
        fi
        
        echo "<p class='critical'>Latest backup is $backup_age days old (threshold: $CRITICAL_THRESHOLD days)</p>" >> $REPORT_FILE
        return 2
    elif [ "$backup_age" -ge "$WARNING_THRESHOLD" ] && [ "$backup_age" -lt "$CRITICAL_THRESHOLD" ]; then
        update_status "WARNING" "Latest backup is $backup_age days old (threshold: $WARNING_THRESHOLD days)"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "backup_status" "WARNING" "Latest backup is $backup_age days old (threshold: $WARNING_THRESHOLD days)"
        fi
        
        echo "<p class='warning'>Latest backup is $backup_age days old (threshold: $WARNING_THRESHOLD days)</p>" >> $REPORT_FILE
        return 1
    else
        # For backups less than a day old
        local age_description
        if [ "$backup_age" -eq 0 ]; then
            age_description="Fresh backup (less than a day old)"
        else
            age_description="Latest backup is $backup_age days old"
        fi
        
        log_message "OK" "$age_description"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "backup_status" "OK" "$age_description"
        fi
        
        echo "<p class='ok'>$age_description</p>" >> $REPORT_FILE
    fi
    
    return 0
}

# Check disk space usage
check_disk_space() {
    log_message "INFO" "Checking disk space usage..."
    
    # Check container disk space
    local container_disk_info=$(docker exec $CONTAINER_NAME df -h /var/lib/postgresql/data | tail -n 1)
    local container_total=$(echo "$container_disk_info" | awk '{print $2}')
    local container_used=$(echo "$container_disk_info" | awk '{print $3}')
    local container_avail=$(echo "$container_disk_info" | awk '{print $4}')
    local container_use_percent=$(echo "$container_disk_info" | awk '{print $5}' | tr -d '%')
    
    # Check volume disk space
    local volume_size=$(docker system df -v | grep baileys_postgres_data | awk '{print $4}')
    
    # Check host disk space for backup directory
    local host_disk_info=$(df -h $BACKUP_DIR | tail -n 1)
    local host_total=$(echo "$host_disk_info" | awk '{print $2}')
    local host_used=$(echo "$host_disk_info" | awk '{print $3}')
    local host_avail=$(echo "$host_disk_info" | awk '{print $4}')
    local host_use_percent=$(echo "$host_disk_info" | awk '{print $5}' | tr -d '%')
    
    # Calculate backup directory size
    local backup_size=$(du -sh $BACKUP_DIR 2>/dev/null | awk '{print $1}')
    
    echo "<h2>Disk Space Usage</h2>" >> $REPORT_FILE
    echo "<table>" >> $REPORT_FILE
    echo "<tr><th>Location</th><th>Total</th><th>Used</th><th>Available</th><th>Use %</th></tr>" >> $REPORT_FILE
    echo "<tr><td>Container Data Directory</td><td>$container_total</td><td>$container_used</td><td>$container_avail</td><td>$container_use_percent%</td></tr>" >> $REPORT_FILE
    echo "<tr><td>Docker Volume</td><td colspan='4'>$volume_size</td></tr>" >> $REPORT_FILE
    echo "<tr><td>Host (Backup Directory)</td><td>$host_total</td><td>$host_used</td><td>$host_avail</td><td>$host_use_percent%</td></tr>" >> $REPORT_FILE
    echo "<tr><td>Backup Directory Size</td><td colspan='4'>$backup_size</td></tr>" >> $REPORT_FILE
    echo "</table>" >> $REPORT_FILE
    
    # Evaluate disk space status
    if [ "$container_use_percent" -ge 90 ]; then
        update_status "CRITICAL" "Database container disk usage is at $container_use_percent% (>= 90%)"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "disk_space" "CRITICAL" "Database container disk usage is at $container_use_percent% (>= 90%)"
        fi
        
        echo "<p class='critical'>Database container disk usage is at $container_use_percent% (>= 90%)</p>" >> $REPORT_FILE
    elif [ "$container_use_percent" -ge 80 ]; then
        update_status "WARNING" "Database container disk usage is at $container_use_percent% (>= 80%)"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "disk_space" "WARNING" "Database container disk usage is at $container_use_percent% (>= 80%)"
        fi
        
        echo "<p class='warning'>Database container disk usage is at $container_use_percent% (>= 80%)</p>" >> $REPORT_FILE
    else
        log_message "OK" "Database container disk usage is at $container_use_percent%"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "disk_space" "OK" "Database container disk usage is at $container_use_percent%"
        fi
        
        echo "<p class='ok'>Database container disk usage is at $container_use_percent%</p>" >> $REPORT_FILE
    fi
    
    # Check host disk space
    if [ "$host_use_percent" -ge 90 ]; then
        update_status "CRITICAL" "Host disk usage for backups is at $host_use_percent% (>= 90%)"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "host_disk_space" "CRITICAL" "Host disk usage for backups is at $host_use_percent% (>= 90%)"
        fi
        
        echo "<p class='critical'>Host disk usage for backups is at $host_use_percent% (>= 90%)</p>" >> $REPORT_FILE
    elif [ "$host_use_percent" -ge 80 ]; then
        update_status "WARNING" "Host disk usage for backups is at $host_use_percent% (>= 80%)"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "host_disk_space" "WARNING" "Host disk usage for backups is at $host_use_percent% (>= 80%)"
        fi
        
        echo "<p class='warning'>Host disk usage for backups is at $host_use_percent% (>= 80%)</p>" >> $REPORT_FILE
    else
        log_message "OK" "Host disk usage for backups is at $host_use_percent%"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "host_disk_space" "OK" "Host disk usage for backups is at $host_use_percent%"
        fi
        
        echo "<p class='ok'>Host disk usage for backups is at $host_use_percent%</p>" >> $REPORT_FILE
    fi
    
    return 0
}

# Check database logs for errors
check_logs() {
    log_message "INFO" "Checking logs for errors..."
    
    echo "<h2>Log Analysis</h2>" >> $REPORT_FILE
    echo "<table>" >> $REPORT_FILE
    echo "<tr><th>Log File</th><th>Status</th><th>Errors</th><th>Warnings</th></tr>" >> $REPORT_FILE
    
    # Check database logs inside container - try multiple possible log locations
    local log_locations=(
        "/var/log/postgresql/postgresql.log" 
        "/var/lib/postgresql/data/log/postgresql.log" 
        "/var/lib/postgresql/data/pgdata/log/postgresql.log"
        "/var/lib/postgresql/data/pgdata/pg_log/postgresql.log"
        "/var/lib/postgresql/data/log/postgresql-*.log"
    )
    local log_found=false
    local log_path=""
    
    for log_location in "${log_locations[@]}"; do
        if docker exec $CONTAINER_NAME test -f "$log_location" 2>/dev/null; then
            log_found=true
            log_path="$log_location"
            break
        fi
    done
    
    if [ "$log_found" = true ]; then
        local db_error_count=$(docker exec $CONTAINER_NAME grep -c "ERROR:" "$log_path" 2>/dev/null || echo 0)
        local db_warning_count=$(docker exec $CONTAINER_NAME grep -c "WARNING:" "$log_path" 2>/dev/null || echo 0)
        
        echo "<tr><td>PostgreSQL Log</td>" >> $REPORT_FILE
        
        if [ "$db_error_count" -gt 0 ]; then
            update_status "WARNING" "Found $db_error_count errors in database log"
            echo "<td class='warning'>Errors found</td><td>$db_error_count</td><td>$db_warning_count</td></tr>" >> $REPORT_FILE
            
            # Extract recent errors
            local recent_errors=$(docker exec $CONTAINER_NAME grep "ERROR:" "$log_path" | tail -5)
            echo "<tr><td colspan='4'><strong>Recent Errors:</strong><pre>$recent_errors</pre></td></tr>" >> $REPORT_FILE
            
            if [ "$JSON_OUTPUT" = true ]; then
                add_json_check "postgresql_log" "WARNING" "Found $db_error_count errors in database log"
            fi
        else
            log_message "OK" "No errors found in database log"
            echo "<td class='ok'>No errors</td><td>0</td><td>$db_warning_count</td></tr>" >> $REPORT_FILE
            
            if [ "$JSON_OUTPUT" = true ]; then
                add_json_check "postgresql_log" "OK" "No errors found in database log"
            fi
        fi
    else
        echo "<tr><td>PostgreSQL Log</td><td class='ok'>Not found (normal for new setup)</td><td>-</td><td>-</td></tr>" >> $REPORT_FILE
        log_message "INFO" "PostgreSQL log file not found in container (normal for new setup)"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "postgresql_log" "OK" "PostgreSQL log file not found in container (normal for new setup)"
        fi
    fi
    
    # Check backup logs
    for log_file in "${LOG_FILES[@]}"; do
        if [ -f "$log_file" ]; then
            local error_count=$(grep -c "ERROR:" "$log_file" 2>/dev/null || echo 0)
            local warning_count=$(grep -c "WARNING:" "$log_file" 2>/dev/null || echo 0)
            
            # Make sure counts are valid integers
            if ! [[ "$error_count" =~ ^[0-9]+$ ]]; then
                error_count=0
            fi
            if ! [[ "$warning_count" =~ ^[0-9]+$ ]]; then
                warning_count=0
            fi
            
            echo "<tr><td>$log_file</td>" >> $REPORT_FILE
            
            if [ "$error_count" -gt 0 ]; then
                update_status "WARNING" "Found $error_count errors in $log_file"
                echo "<td class='warning'>Errors found</td><td>$error_count</td><td>$warning_count</td></tr>" >> $REPORT_FILE
                
                # Extract recent errors
                local recent_errors=$(grep "ERROR:" "$log_file" | tail -5)
                echo "<tr><td colspan='4'><strong>Recent Errors:</strong><pre>$recent_errors</pre></td></tr>" >> $REPORT_FILE
                
                if [ "$JSON_OUTPUT" = true ]; then
                    add_json_check "${log_file}_analysis" "WARNING" "Found $error_count errors in $log_file"
                fi
            else
                log_message "OK" "No errors found in $log_file"
                echo "<td class='ok'>No errors</td><td>0</td><td>$warning_count</td></tr>" >> $REPORT_FILE
                
                if [ "$JSON_OUTPUT" = true ]; then
                    add_json_check "${log_file}_analysis" "OK" "No errors found in $log_file"
                fi
            fi
        else
            echo "<tr><td>$log_file</td><td class='warning'>Not found</td><td>-</td><td>-</td></tr>" >> $REPORT_FILE
            # Not finding log files is normal for a new installation, don't count as warning
            log_message "INFO" "Log file $log_file not found (normal for new setup)"
            
            if [ "$JSON_OUTPUT" = true ]; then
                add_json_check "${log_file}_analysis" "OK" "Log file $log_file not found (normal for new setup)"
            fi
        fi
    done
    
    echo "</table>" >> $REPORT_FILE
    return 0
}

# Check database statistics
check_db_stats() {
    log_message "INFO" "Checking database statistics..."
    
    if ! docker exec $CONTAINER_NAME pg_isready -U $DB_USER -d $DB_NAME > /dev/null 2>&1; then
        log_message "WARNING" "Cannot check database statistics: database is not available"
        return 1
    fi
    
    # Get database size
    local db_size=$(docker exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));")
    
    # Get table counts
    local table_count=$(docker exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
    
    # Get connection counts
    local active_connections=$(docker exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM pg_stat_activity WHERE datname = '$DB_NAME';")
    local max_connections=$(docker exec $CONTAINER_NAME psql -U $DB_USER -t -c "SHOW max_connections;")
    
    # Get transaction stats
    local transactions=$(docker exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT xact_commit + xact_rollback FROM pg_stat_database WHERE datname = '$DB_NAME';")
    
    # Get lock information
    local locks_count=$(docker exec $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM pg_locks l JOIN pg_database d ON l.database = d.oid WHERE d.datname = '$DB_NAME';")
    
    echo "<h2>Database Statistics</h2>" >> $REPORT_FILE
    echo "<table>" >> $REPORT_FILE
    echo "<tr><th>Metric</th><th>Value</th></tr>" >> $REPORT_FILE
    echo "<tr><td>Database Size</td><td>$db_size</td></tr>" >> $REPORT_FILE
    echo "<tr><td>Tables Count</td><td>$table_count</td></tr>" >> $REPORT_FILE
    echo "<tr><td>Active Connections</td><td>$active_connections</td></tr>" >> $REPORT_FILE
    echo "<tr><td>Max Connections</td><td>$max_connections</td></tr>" >> $REPORT_FILE
    echo "<tr><td>Total Transactions</td><td>$transactions</td></tr>" >> $REPORT_FILE
    echo "<tr><td>Current Locks</td><td>$locks_count</td></tr>" >> $REPORT_FILE
    echo "</table>" >> $REPORT_FILE
    
    # Evaluate connection usage
    local connection_percent=$((active_connections * 100 / max_connections))
    
    if [ "$connection_percent" -ge 80 ]; then
        update_status "WARNING" "High connection usage: $connection_percent% of max connections ($active_connections/$max_connections)"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "db_connections" "WARNING" "High connection usage: $connection_percent% of max connections ($active_connections/$max_connections)"
        fi
        
        echo "<p class='warning'>High connection usage: $connection_percent% of max connections ($active_connections/$max_connections)</p>" >> $REPORT_FILE
    else
        log_message "OK" "Connection usage: $connection_percent% of max connections ($active_connections/$max_connections)"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "db_connections" "OK" "Connection usage: $connection_percent% of max connections ($active_connections/$max_connections)"
        fi
        
        echo "<p class='ok'>Connection usage: $connection_percent% of max connections ($active_connections/$max_connections)</p>" >> $REPORT_FILE
    fi
    
    # Check if there are too many locks
    if [ "$locks_count" -ge 100 ]; then
        update_status "WARNING" "High number of locks: $locks_count"
        
        if [ "$JSON_OUTPUT" = true ]; then
            add_json_check "db_locks" "WARNING" "High number of locks: $locks_count"
        fi
        
        echo "<p class='warning'>High number of locks: $locks_count</p>" >> $REPORT_FILE
    fi
    
    return 0
}

# Generate summary report
generate_summary() {
    log_message "INFO" "Generating summary report..."
    
    # Log current issue counts before resetting
    log_message "INFO" "Final counts before summary: $WARNINGS warnings, $CRITICALS critical issues"
    
    # Re-check status is in sync with counters
    if [ "$CRITICALS" -gt 0 ]; then
        STATUS="CRITICAL"
    elif [ "$WARNINGS" -gt 0 ]; then
        STATUS="WARNING"
    else
        STATUS="OK"
    fi
    
    # Determine status color class
    local status_class="ok"
    if [ "$STATUS" = "WARNING" ]; then
        status_class="warning"
    elif [ "$STATUS" = "CRITICAL" ]; then
        status_class="critical"
    fi
    
    # Create summary section
    echo "<h2>Summary</h2>" >> $REPORT_FILE
    echo "<p class='summary ${status_class}'>Overall Status: $STATUS</p>" >> $REPORT_FILE
    echo "<ul>" >> $REPORT_FILE
    echo "<li>Warnings: $WARNINGS</li>" >> $REPORT_FILE
    echo "<li>Critical Issues: $CRITICALS</li>" >> $REPORT_FILE
    echo "</ul>" >> $REPORT_FILE
    
    # List issues if any
    if [ ${#ISSUES[@]} -gt 0 ]; then
        echo "<h3>Issues Found:</h3>" >> $REPORT_FILE
        echo "<ol>" >> $REPORT_FILE
        for issue in "${ISSUES[@]}"; do
            echo "<li>$issue</li>" >> $REPORT_FILE
        done
        echo "</ol>" >> $REPORT_FILE
    fi
    
    # Close HTML report
    echo "</body></html>" >> $REPORT_FILE
    
    log_message "INFO" "Report generated: $REPORT_FILE"
    
    # Update JSON report status
    if [ "$JSON_OUTPUT" = true ]; then
        update_json_status
        log_message "INFO" "JSON report generated: $JSON_REPORT_FILE"
    fi
}

# Send report via email
send_report() {
    if [ -n "$EMAIL_RECIPIENT" ]; then
        log_message "INFO" "Sending report to $EMAIL_RECIPIENT..."
        
        local subject="Database Health Report - $(date +"%Y-%m-%d") - Status: $STATUS"
        local message="Please see the attached report for details.\n\n"
        message+="Summary:\n"
        message+="- Status: $STATUS\n"
        message+="- Warnings: $WARNINGS\n"
        message+="- Critical Issues: $CRITICALS\n"
        
        if [ ${#ISSUES[@]} -gt 0 ]; then
            message+="\nIssues Found:\n"
            for issue in "${ISSUES[@]}"; do
                message+="- $issue\n"
            done
        fi
        
        send_email_alert "$subject" "$message"
    fi
    
    # Send Slack alert if status is not OK
    if [ -n "$SLACK_WEBHOOK" ] && [ "$STATUS" != "OK" ]; then
        local color="good"
        if [ "$STATUS" = "WARNING" ]; then
            color="warning"
        elif [ "$STATUS" = "CRITICAL" ]; then
            color="danger"
        fi
        
        local message="Database Health Alert - Status: $STATUS\n"
        message+="- Warnings: $WARNINGS\n"
        message+="- Critical Issues: $CRITICALS\n"
        
        if [ ${#ISSUES[@]} -gt 0 ]; then
            message+="\nIssues Found:\n"
            for issue in "${ISSUES[@]}"; do
                message+="- $issue\n"
            done
        fi
        
        send_slack_alert "$message" "$color"
    fi
}

# Reset issue counters
reset_counters() {
    WARNINGS=0
    CRITICALS=0
    ISSUES=()
    STATUS="OK"
}

# Main function
main() {
    # Initialize reports
    generate_report_header
    
    if [ "$JSON_OUTPUT" = true ]; then
        initialize_json_report
    fi
    
    # Reset issue counters
    reset_counters
    
    # Check if required tools are available
    check_requirements || exit 2
    
    # Run checks
    check_container
    container_status=$?
    
    if [ $container_status -eq 0 ]; then
        check_db_connectivity
        connectivity_status=$?
        
        if [ $connectivity_status -eq 0 ]; then
            check_db_stats
        fi
    fi
    
    # These checks can run independently
    check_backup_status
    check_disk_space
    check_logs
    
    # Debug issue counts
    log_message "INFO" "Status check: $WARNINGS warnings, $CRITICALS critical issues"
    
    # Recalculate status based on actual counts
    if [ "$CRITICALS" -gt 0 ]; then
        STATUS="CRITICAL"
    elif [ "$WARNINGS" -gt 0 ]; then
        STATUS="WARNING"
    else
        STATUS="OK"
    fi
    
    # Generate summary and send reports
    generate_summary
    send_report
    
    # Print final status message
    if [ "$STATUS" = "OK" ]; then
        log_message "OK" "All checks passed successfully"
    else
        log_message "$STATUS" "Issues detected: $WARNINGS warnings, $CRITICALS critical issues"
    fi
    
    # Return appropriate exit code
    if [ "$STATUS" = "CRITICAL" ]; then
        return 2
    elif [ "$STATUS" = "WARNING" ]; then
        return 1
    else
        return 0
    fi
}

# Make the script executable
chmod +x monitor-db.sh

# Execute main function
main
exit $?
