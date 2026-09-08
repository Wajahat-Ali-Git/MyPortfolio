# Docker Setup Guide

Complete guide to run the Portfolio Backend with Docker and local PostgreSQL.

---

## 🐳 What's Included

- **PostgreSQL 16** - Local database
- **Backend API** - Express.js server
- **pgAdmin** - Web-based database management (optional)

---

## 📋 Prerequisites

- Docker Desktop installed
- Docker Compose installed (usually comes with Docker Desktop)

### Install Docker

**Windows/Mac:**
- Download from [docker.com](https://www.docker.com/products/docker-desktop)

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

---

## 🚀 Quick Start

### 1. Start All Services

```bash
# Start PostgreSQL + Backend API
docker-compose up

# Or run in background (detached mode)
docker-compose up -d
```

### 2. Verify Everything is Running

```bash
# Check running containers
docker-compose ps

# View logs
docker-compose logs -f
```

Expected output:
```
portfolio-postgres    running
portfolio-backend     running
```

### 3. Test the API

```bash
# Health check
curl http://localhost:5000/health

# Submit a test message
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello from Docker!"}'
```

---

## 🔧 Available Commands

### Start Services

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Start with pgAdmin (database UI)
docker-compose --profile admin up
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database!)
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f postgres
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild Images

```bash
# Rebuild backend after code changes
docker-compose build backend

# Rebuild and start
docker-compose up --build
```

---

## 🛠️ Development Mode

For active development with hot reload:

```bash
# Use development configuration
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Your code changes will auto-reload!
```

---

## 🗄️ Database Access

### Connect via psql

```bash
# Access PostgreSQL shell
docker-compose exec postgres psql -U portfolio_user -d portfolio

# Run queries
SELECT * FROM contact_messages;
```

### Connect via pgAdmin (Web UI)

1. Start with admin profile:
   ```bash
   docker-compose --profile admin up
   ```

2. Open browser: `http://localhost:5050`

3. Login:
   - Email: `admin@portfolio.local`
   - Password: `admin`

4. Add server:
   - **Name:** Portfolio DB
   - **Host:** postgres
   - **Port:** 5432
   - **Username:** portfolio_user
   - **Password:** portfolio_password_change_me
   - **Database:** portfolio

### Direct Connection (External Tools)

Connect using:
- **Host:** localhost
- **Port:** 5432
- **Database:** portfolio
- **Username:** portfolio_user
- **Password:** portfolio_password_change_me

---

## 📊 Database Management

### View Data

```bash
# Connect to database
docker-compose exec postgres psql -U portfolio_user -d portfolio

# List tables
\dt

# View messages
SELECT id, name, email, LEFT(message, 50) as preview, created_at 
FROM contact_messages 
ORDER BY created_at DESC 
LIMIT 10;

# Count messages
SELECT COUNT(*) FROM contact_messages;
```

### Backup Database

```bash
# Export to SQL file
docker-compose exec postgres pg_dump -U portfolio_user portfolio > backup.sql

# Export as custom format (compressed)
docker-compose exec postgres pg_dump -U portfolio_user -Fc portfolio > backup.dump
```

### Restore Database

```bash
# From SQL file
docker-compose exec -T postgres psql -U portfolio_user portfolio < backup.sql

# From custom format
docker-compose exec postgres pg_restore -U portfolio_user -d portfolio backup.dump
```

---

## 🔒 Security Configuration

### Change Default Passwords

Edit `docker-compose.yml`:

```yaml
environment:
  POSTGRES_PASSWORD: YOUR_SECURE_PASSWORD
  API_KEY: YOUR_SECURE_API_KEY
```

Or use `.env.docker.local`:

```bash
# Copy template
cp .env.docker .env.docker.local

# Edit with your values
nano .env.docker.local

# Use it
docker-compose --env-file .env.docker.local up
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `Port 5000 is already allocated`

**Solution:**
```bash
# Change port in docker-compose.yml
ports:
  - "5001:5000"  # Maps host:5001 to container:5000
```

### Database Connection Failed

**Solution:**
```bash
# Check if PostgreSQL is healthy
docker-compose ps

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Container Won't Start

**Solution:**
```bash
# View container logs
docker-compose logs backend

# Remove and rebuild
docker-compose down
docker-compose up --build
```

### Reset Everything

**Warning: Deletes all data!**

```bash
# Stop and remove everything
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Start fresh
docker-compose up --build
```

---

## 📈 Performance Tuning

### Increase PostgreSQL Memory

Edit `docker-compose.yml`:

```yaml
postgres:
  command: postgres -c shared_buffers=256MB -c max_connections=200
```

### Limit Container Resources

```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 512M
```

---

## 🔄 Environment Switching

### Development

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Production

```bash
docker-compose -f docker-compose.yml up
```

---

## 📦 Volume Management

### List Volumes

```bash
docker volume ls | grep portfolio
```

### Inspect Volume

```bash
docker volume inspect backend_postgres_data
```

### Backup Volume

```bash
docker run --rm -v backend_postgres_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup.tar.gz /data
```

---

## 🚢 Deployment

### Export Images

```bash
# Save images
docker save -o backend.tar backend:latest
docker save -o postgres.tar postgres:16-alpine

# Load on another machine
docker load -i backend.tar
docker load -i postgres.tar
```

### Docker Hub

```bash
# Tag image
docker tag backend your-username/portfolio-backend:latest

# Push to Docker Hub
docker push your-username/portfolio-backend:latest
```

---

## 🔍 Monitoring

### Container Stats

```bash
# Real-time stats
docker stats

# Specific container
docker stats portfolio-backend
```

### Health Checks

```bash
# Check health status
docker inspect portfolio-backend | grep Health -A 10
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)

---

## 🆘 Need Help?

1. Check logs: `docker-compose logs -f`
2. Verify connectivity: `docker-compose ps`
3. Test database: `docker-compose exec postgres psql -U portfolio_user -d portfolio`
4. Review [Troubleshooting](#-troubleshooting) section above

---

**Happy Dockering! 🐳**
