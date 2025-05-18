#!/bin/bash

# Bailey's Kitchen - Docker Container Monitoring Script
# This script monitors Docker containers and HTTP endpoints
# It logs resource usage and health status every 30 seconds

# Colors for formatting output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Container IDs/names to monitor
PRODUCT_SERVICE="baileys-kitchen-product-service"
WEB_CLIENT="baileys-kitchen-web-client"
DATABASE="baileys-kitchen-postgres"

# Endpoints to check
WEB_ENDPOINT="http://localhost:3000"
API_ENDPOINT="http://localhost:5003/api/v1/health"

# Log file paths
LOG_DIR="./monitoring_logs"
mkdir -p "$LOG_DIR"
RESOURCE_LOG="$LOG_DIR/resource_usage_$(date +"%Y%m%d").log"
ERROR_LOG="$LOG_DIR/errors_$(date +"%Y%m%d").log"

# Print header
print_header() {
  echo -e "${BLUE}=========================================================${NC}"
  echo -e "${BLUE}      Bailey's Kitchen - Container Monitoring            ${NC}"
  echo -e "${BLUE}      Started: $(date '+%Y-%m-%d %H:%M:%S')              ${NC}"
  echo -e "${BLUE}=========================================================${NC}"
}

# Print a separator line
print_separator() {
  echo -e "${CYAN}----------------------------------------------------------${NC}"
}

# Log error message
log_error() {
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo -e "${RED}[ERROR] $1${NC}"
  echo "[$timestamp] ERROR: $1" >> "$ERROR_LOG"
}

# Check if container is running
check_container_status() {
  local container_name="$1"
  local container_status=$(docker inspect --format '{{.State.Status}}' "$container_name" 2>/dev/null)
  
  if [ $? -ne 0 ]; then
    log_error "Container '$container_name' not found"
    return 1
  fi
  
  if [ "$container_status" != "running" ]; then
    log_error "Container '$container_name' is not running (status: $container_status)"
    return 1
  fi
  
  return 0
}

# Check HTTP endpoint health
check_endpoint_health() {
  local endpoint="$1"
  local name="$2"
  local status_code
  
  # Use curl to check endpoint with a 5-second timeout
  status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$endpoint")
  
  if [ $? -ne 0 ]; then
    log_error "Failed to connect to $name endpoint: $endpoint"
    echo -e "  ${RED}● $name: Unreachable${NC}"
    return 1
  fi
  
  # Check if status code is 2xx (success)
  if [[ "$status_code" =~ ^2[0-9][0-9]$ ]]; then
    echo -e "  ${GREEN}● $name: Healthy (HTTP $status_code)${NC}"
  else
    log_error "$name endpoint returned HTTP $status_code: $endpoint"
    echo -e "  ${RED}● $name: Unhealthy (HTTP $status_code)${NC}"
    return 1
  fi
  
  return 0
}

# Collect and format Docker stats
collect_docker_stats() {
  local container_name="$1"
  local service_name="$2"
  
  # Check if container exists and is running
  if ! check_container_status "$container_name"; then
    echo -e "  ${RED}● $service_name: Container not running${NC}"
    return 1
  fi
  
  # Collect stats (non-streaming) - CPU, Memory, Network I/O
  local stats=$(docker stats --no-stream --format "{{.CPUPerc}},{{.MemUsage}},{{.MemPerc}},{{.NetIO}},{{.PIDs}}" "$container_name")
  
  if [ -z "$stats" ]; then
    log_error "Failed to collect stats for $service_name"
    return 1
  fi
  
  # Parse stats
  IFS=',' read -r cpu_usage mem_usage mem_perc net_io pids <<< "$stats"
  
  # Format and colorize output
  echo -e "  ${PURPLE}$service_name:${NC}"
  echo -e "    CPU: ${YELLOW}$cpu_usage${NC}"
  echo -e "    Memory: ${YELLOW}$mem_usage${NC} (${YELLOW}$mem_perc${NC})"
  echo -e "    Network I/O: ${YELLOW}$net_io${NC}"
  echo -e "    Processes: ${YELLOW}$pids${NC}"
  
  # Log to file for historical analysis
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$timestamp] $service_name - CPU: $cpu_usage, Memory: $mem_usage ($mem_perc), Network I/O: $net_io, PIDs: $pids" >> "$RESOURCE_LOG"
  
  return 0
}

# Main monitoring loop
main() {
  print_header
  
  while true; do
    echo -e "\n${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')] Checking system health...${NC}"
    
    # Check container status and resource usage
    print_separator
    echo -e "${CYAN}Resource Usage:${NC}"
    collect_docker_stats "$PRODUCT_SERVICE" "Product Service"
    collect_docker_stats "$WEB_CLIENT" "Web Client"
    collect_docker_stats "$DATABASE" "Database"
    
    # Check endpoint health
    print_separator
    echo -e "${CYAN}Endpoint Health:${NC}"
    check_endpoint_health "$WEB_ENDPOINT" "Web Client"
    check_endpoint_health "$API_ENDPOINT" "Product API"
    
    print_separator
    echo -e "${BLUE}Next check in 30 seconds... (Press Ctrl+C to stop)${NC}"
    
    # Wait for next iteration
    sleep 30
  done
}

# Cleanup function on script exit
cleanup() {
  echo -e "\n${BLUE}Monitoring stopped at $(date '+%Y-%m-%d %H:%M:%S')${NC}"
  echo -e "${BLUE}Logs are available at:${NC}"
  echo -e "  ${YELLOW}$RESOURCE_LOG${NC}"
  echo -e "  ${YELLOW}$ERROR_LOG${NC}"
  exit 0
}

# Set up trap for clean exit
trap cleanup SIGINT SIGTERM

# Start monitoring
main
