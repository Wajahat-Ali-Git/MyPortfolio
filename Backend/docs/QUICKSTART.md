# 🚀 Quick Start Guide

Get your portfolio backend running in 2 minutes!

---

## Option 1: Docker (Recommended for Local Development)

### Prerequisites
- Docker Desktop installed

### Start Everything

```bash
cd Backend

# Option A: Use docker-compose
docker-compose up

# Option B: Use Makefile (simpler)
make start
```

That's it! 🎉

**Services Running:**
- 🌐 API: http://localhost:5000
- 🗄️ PostgreSQL: localhost:5432
- 📊 pgAdmin (optional): http://localhost:5050

### Test It

```bash
# Health check
curl http://localhost:5000/health

# Submit a message
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello!"}'
```

### Common Commands

```bash
make start        # Start services
make stop         # Stop services
make logs         # View logs
make db-shell     # Database shell
make test         # Test API
make help         # See all commands
```

---

## Option 2: Supabase Cloud (For Production)

### Prerequisites
- Supabase account
- Node.js installed

### Setup

1. **Get Supabase Credentials**
   - Go to https://supabase.com/dashboard
   - Create a project
   - Copy URL and keys from Settings → API

2. **Configure Environment**
   ```bash
   cd Backend
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Run Database Schema**
   - Open Supabase SQL Editor
   - Copy & paste contents of `database/schema.sql`
   - Click "Run"

4. **Install & Start**
   ```bash
   npm install
   npm run dev
   ```

**API Running:** http://localhost:5000

---

## Option 3: Local PostgreSQL (Manual Setup)

### Prerequisites
- PostgreSQL installed
- Node.js installed

### Setup

1. **Create Database**
   ```bash
   createdb portfolio
   psql portfolio < database/schema.sql
   ```

2. **Configure Environment**
   ```bash
   cd Backend
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   DATABASE_URL=postgresql://your_user:your_password@localhost:5432/portfolio
   ```

3. **Install & Start**
   ```bash
   npm install
   npm run dev
   ```

---

## 🧪 Testing

### Test API Endpoints

```bash
# Health Check
curl http://localhost:5000/health

# Submit Contact Form
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "This is a test message"
  }'

# Get All Messages (requires API key)
curl http://localhost:5000/api/messages \
  -H "X-API-Key: your_api_key_here"
```

---

## 📝 Next Steps

### 1. Connect Frontend

```bash
cd ../portfolio

# Create environment file
cp .env.local.example .env.local

# Edit with your credentials
nano .env.local
```

Add:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Test Contact Form

```bash
npm run dev
```

Visit: http://localhost:3001/contact

### 3. Deploy to Production

See [Backend/README.md](./README.md) for deployment instructions.

---

## 🐛 Troubleshooting

### "Port 5000 already in use"

**Docker:**
```yaml
# Edit docker-compose.yml
ports:
  - "5001:5000"
```

**Local:**
```env
# Edit .env
PORT=5001
```

### "Cannot connect to database"

**Check Docker:**
```bash
docker-compose ps
docker-compose logs postgres
```

**Check Supabase:**
- Verify credentials in `.env`
- Check Supabase dashboard status

### "Module not found"

```bash
npm install
```

---

## 📚 Full Documentation

- [DOCKER.md](./DOCKER.md) - Complete Docker guide
- [README.md](./README.md) - API documentation
- [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - Detailed setup
- [database/README.md](./database/README.md) - Database guide

---

## 🆘 Need Help?

1. Check logs:
   - Docker: `make logs` or `docker-compose logs -f`
   - Local: Check terminal output

2. Verify services:
   - Docker: `make ps` or `docker-compose ps`
   - Local: `curl http://localhost:5000/health`

3. Database issues:
   - Docker: `make db-shell`
   - Local: `psql portfolio`

---

**Ready to build! 🚀**
