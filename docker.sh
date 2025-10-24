#!/bin/bash

# SharePro Frontend Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}


# Function to start production environment
prod_start() {
    print_status "Starting production environment..."
    docker-compose up --build -d
    
    print_status "Services started successfully!"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend API: http://localhost:8000"
    print_status "GraphQL Playground: http://localhost:8000/graphql/"
    print_status "Flower (Celery monitoring): http://localhost:5555"
}

# Function to start development environment with hot reloading
dev_start() {
    print_status "Starting development environment with hot reloading..."
    docker-compose -f docker-compose.dev.yml up --build
    
    print_status "Development server started!"
    print_status "Frontend: http://localhost:3000"
    print_status "Hot reloading is enabled - changes will auto-refresh"
    print_status "Press Ctrl+C to stop"
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."
    docker-compose down
    
    print_status "Services stopped."
}

# Function to show logs
show_logs() {
    SERVICE=${1:-frontend}
    print_status "Showing logs for $SERVICE..."
    docker-compose logs -f $SERVICE
}

# Function to clean up Docker resources
cleanup() {
    print_status "Cleaning up Docker resources..."
    docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans
    docker-compose down --volumes --remove-orphans
    docker system prune -f
    print_status "Cleanup completed."
}

# Function to rebuild containers
rebuild() {
    print_status "Rebuilding containers..."
    docker-compose -f docker-compose.dev.yml down
    docker-compose down
    docker-compose -f docker-compose.dev.yml build --no-cache
    docker-compose build --no-cache
    print_status "Rebuild completed."
}

# Function to reset development environment (full clean)
reset_dev() {
    print_status "Resetting development environment..."
    docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans
    docker volume prune -f
    docker image prune -f
    docker-compose -f docker-compose.dev.yml build --no-cache
    print_status "Development environment reset completed."
}

# Main script logic
case "$1" in

    "dev")
        check_docker
        dev_start
        ;;
    "prod")
        check_docker
        prod_start
        ;;
    "stop")
        stop_services
        ;;
    "logs")
        show_logs $2
        ;;
    "cleanup")
        cleanup
        ;;
    "rebuild")
        check_docker
        rebuild
        ;;
    "reset")
        check_docker
        reset_dev
        ;;
    "help"|"--help"|"-h")
        echo "SharePro Frontend Docker Management"
        echo ""
        echo "Usage: $0 {command} [options]"
        echo ""
        echo "Commands:"
        echo "  dev                 Start development environment with hot reloading"
        echo "  prod                Start production environment"
        echo "  stop                Stop all services"
        echo "  logs [service]      Show logs for a service (default: frontend)"
        echo "  cleanup             Clean up Docker resources"
        echo "  rebuild             Rebuild containers from scratch"
        echo "  reset               Reset development environment (full clean + rebuild)"
        echo "  help                Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 dev              # Start development with hot reloading"
        echo "  $0 prod             # Start production environment"
        echo "  $0 reset            # Reset development environment (if having issues)"
        echo "  $0 logs frontend    # Show frontend logs"
        echo "  $0 logs api         # Show backend API logs"
        echo "  $0 stop             # Stop all services"
        echo ""
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information."
        exit 1
        ;;
esac
