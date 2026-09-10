# Portfolio Backend API

Express.js backend with Supabase/PostgreSQL database for portfolio contact form.

---

## 🚀 Quick Start

```bash
# Start with Docker (Recommended)
docker-compose up

# Or use Makefile
make start

# Or install and run manually
npm install
npm run dev
```

**API:** http://localhost:5000

---

## 📚 Documentation

**→ [Start Here: Documentation Index](./docs/INDEX.md)** ⭐

All comprehensive documentation is organized in the `docs/` folder:

### Quick Access
- **[Quick Start](./docs/QUICKSTART.md)** - Get running in 2 minutes
- **[API Reference](./docs/API_DOCUMENTATION.md)** - All 30+ endpoints
- **[Supabase RPC](./docs/SUPABASE_RPC_GUIDE.md)** - RPC functions & optimization
- **[Deploy to Supabase](./docs/APPLY_TO_SUPABASE.md)** - Cloud deployment

### Core Documentation
- **[Main API Docs](./docs/README.md)** - Complete API documentation & usage
- **[QUICKSTART.md](./docs/QUICKSTART.md)** - Get running in 2 minutes
- **[SETUP_CHECKLIST.md](./docs/SETUP_CHECKLIST.md)** - Detailed step-by-step setup

### Specialized Guides
- **[DOCKER.md](./docs/DOCKER.md)** - Complete Docker setup guide
- **[DATABASE.md](./docs/DATABASE.md)** - Database schema & management

---

## 🛠️ Technology Stack

- **Framework:** Express.js
- **Database:** PostgreSQL 16 (Docker) or Supabase (Cloud)
- **Security:** Helmet, CORS, Rate Limiting
- **Container:** Docker + Docker Compose

---

## 📁 Project Structure

```
Backend/
├── docs/                      # 📚 All documentation
│   ├── README.md             # Complete API docs
│   ├── QUICKSTART.md         # Quick start guide
│   ├── SETUP_CHECKLIST.md    # Setup steps
│   ├── DOCKER.md             # Docker guide
│   └── DATABASE.md           # Database docs
│
├── src/                       # API source code
│   └── index.js              # Main Express server
│
├── database/                  # Database schemas
│   ├── schema.sql            # Supabase schema
│   └── schema-docker.sql     # Docker schema
│
├── docker-compose.yml         # Docker configuration
├── Dockerfile                 # Production image
├── Dockerfile.dev            # Development image
├── Makefile                  # Quick commands
├── package.json              # Dependencies
├── .env.example              # Environment template
└── .gitignore               # Git ignore rules
```

---

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/contact` | POST | Submit contact form |
| `/api/messages` | GET | Get all messages (admin) |

---

## 📦 Quick Commands

```bash
# Docker
make start         # Start all services
make stop          # Stop services
make logs          # View logs
make test          # Test API
make db-shell      # Database shell

# Manual
npm install        # Install dependencies
npm run dev        # Development server
npm start          # Production server
```

---

## 🔒 Environment Variables

Required in `.env`:

```env
# Database (choose one)
DATABASE_URL=postgresql://user:pass@localhost:5432/portfolio
# OR
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx

# Server
PORT=5000
NODE_ENV=development
```

See [.env.example](./.env.example) for complete configuration.

---

## 🧪 Testing

```bash
# Health check
curl http://localhost:5000/health

# Submit message
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello!"}'
```

---

## 🐛 Troubleshooting

Check the comprehensive documentation:
- [DOCKER.md](./docs/DOCKER.md) - Docker issues
- [DATABASE.md](./docs/DATABASE.md) - Database issues
- [SETUP_CHECKLIST.md](./docs/SETUP_CHECKLIST.md) - Setup problems

---

## 📄 License

MIT License - See LICENSE file for details

---

**For complete documentation, see the [docs/](./docs/) folder.**
