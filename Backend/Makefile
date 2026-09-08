# =============================================================================
# Portfolio Backend - Makefile
# =============================================================================
# Quick commands for Docker management
# =============================================================================

.PHONY: help start stop restart logs build clean test db-shell db-backup

# Default target
help:
	@echo "Portfolio Backend - Available Commands:"
	@echo ""
	@echo "  make start        - Start all services"
	@echo "  make start-dev    - Start in development mode (hot reload)"
	@echo "  make start-admin  - Start with pgAdmin"
	@echo "  make stop         - Stop all services"
	@echo "  make restart      - Restart all services"
	@echo "  make logs         - View logs"
	@echo "  make build        - Rebuild containers"
	@echo "  make clean        - Remove containers and volumes"
	@echo "  make test         - Test API endpoints"
	@echo "  make db-shell     - Connect to PostgreSQL"
	@echo "  make db-backup    - Backup database"
	@echo "  make ps           - Show running containers"

# Start services
start:
	docker-compose up -d
	@echo "✓ Services started!"
	@echo "  API: http://localhost:5000"
	@echo "  Database: localhost:5432"

start-dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
	@echo "✓ Development mode started with hot reload!"

start-admin:
	docker-compose --profile admin up -d
	@echo "✓ Services started with pgAdmin!"
	@echo "  API: http://localhost:5000"
	@echo "  pgAdmin: http://localhost:5050"

# Stop services
stop:
	docker-compose down
	@echo "✓ Services stopped!"

# Restart services
restart:
	docker-compose restart
	@echo "✓ Services restarted!"

# View logs
logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-postgres:
	docker-compose logs -f postgres

# Build containers
build:
	docker-compose build
	@echo "✓ Containers rebuilt!"

# Clean everything (WARNING: deletes data!)
clean:
	docker-compose down -v --rmi local
	@echo "✓ Cleaned up containers, volumes, and images!"

# Test API
test:
	@echo "Testing API endpoints..."
	@curl -s http://localhost:5000/health | jq || echo "API not responding"
	@echo ""
	@echo "Submitting test message..."
	@curl -s -X POST http://localhost:5000/api/contact \
		-H "Content-Type: application/json" \
		-d '{"name":"Test User","email":"test@example.com","message":"Test message from Makefile"}' | jq

# Database shell
db-shell:
	docker-compose exec postgres psql -U portfolio_user -d portfolio

# Database backup
db-backup:
	@mkdir -p backups
	docker-compose exec postgres pg_dump -U portfolio_user portfolio > backups/backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "✓ Database backed up to backups/"

# Show running containers
ps:
	docker-compose ps

# Install dependencies locally (for IDE)
install:
	npm install
	@echo "✓ Dependencies installed!"
