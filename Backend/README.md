# Supabase Database & Backend Configuration

This folder manages the **Supabase PostgreSQL database schema, migrations, and configuration** for the portfolio website.

The portfolio frontend communicates directly with Supabase via `@supabase/supabase-js` and Next.js Server Actions — there is no separate custom Express server required.

---

## 📁 Folder Structure

```
Backend/
├── supabase/
│   ├── config.toml                              # Supabase CLI project configuration
│   └── migrations/                              # SQL migration files (applied in order)
│       ├── 20260909000001_initial_schema.sql    # Core portfolio tables & RLS policies
│       ├── 20260909000002_rpc_functions.sql     # Supabase RPC helper functions
│       ├── 20260910000001_contact_messages.sql  # Contact form submissions table
│       ├── 20260910000002_seed_portfolio_data.sql # Initial seed data
│       ├── 20260910000003_site_settings.sql     # Site-wide settings table
│       ├── 20260911000001_fix_admin_select_rls.sql # Admin RLS policy fixes
│       └── 20260921000001_resume_storage.sql    # Resume/CV file storage bucket & table
│
├── tests/                                       # Manual test & verification scripts
│   ├── test-db-connection.js                    # Tests Supabase & PostgreSQL connections
│   ├── test-api-endpoints.js                    # Smoke-tests backend API endpoints
│   ├── verify-tables.js                         # Verifies all DB tables exist
│   └── README.md                                # How to run the test scripts
│
├── docs/                                        # Extended backend documentation
│   ├── INDEX.md                                 # Documentation index
│   ├── README.md                                # Full backend reference
│   ├── DATABASE.md                              # Database schema reference
│   ├── API_DOCUMENTATION.md                     # API endpoint reference
│   ├── SUPABASE_RPC_GUIDE.md                    # Supabase RPC function guide
│   ├── DOCKER.md                                # Docker setup guide
│   ├── QUICKSTART.md                            # Quick start guide
│   ├── SETUP_CHECKLIST.md                       # Setup checklist
│   └── APPLY_TO_SUPABASE.md                     # Applying migrations to Supabase
│
└── README.md                                    # This file
```

---

## 🚀 Supabase CLI Commands

### 1. Prerequisites
Install the Supabase CLI globally:
```bash
npm install -g supabase
```

### 2. Remote Project Management (Cloud)

```bash
# Log in to your Supabase account
supabase login

# Link this directory to your remote Supabase project
supabase link --project-ref <your-project-ref>

# Push all pending SQL migrations to your remote Supabase project
supabase db push

# Pull schema changes from remote database (sync local)
supabase db pull
```

---

## 🧪 Local Supabase Testing (with Docker)

You can run the entire Supabase backend stack locally using Docker.

```bash
# Start the local Supabase instance (DB, Studio, Auth, Storage)
supabase start

# Reset local database and re-run all migrations from scratch
supabase db reset

# Check status and view local service URLs
supabase status

# Stop local Supabase instance
supabase stop
```

When `supabase start` finishes, the following services are available:
- **Supabase Studio (Web UI):** `http://localhost:54323`
- **API Gateway:** `http://localhost:54321`
- **PostgreSQL DB:** `postgresql://postgres:postgres@localhost:54322/postgres`

---

## 🧪 Running Test Scripts

See [`tests/README.md`](./tests/README.md) for full instructions. Quick reference:

```bash
# Verify all database tables exist
npm run verify-tables

# Test database connections (Supabase + PostgreSQL)
npm run test-db

# Smoke-test all API endpoints (requires backend running)
npm run test-api
```

---

## 🔒 Security & Row Level Security (RLS)

All tables have **Row Level Security** enabled:

| Table | anon | authenticated (admin) |
|---|---|---|
| `contact_messages` | INSERT only | SELECT, UPDATE, DELETE |
| `projects` | SELECT (visible only) | Full CRUD |
| `experiences` | SELECT (visible only) | Full CRUD |
| `skills` | SELECT (visible only) | Full CRUD |
| `certifications` | SELECT (visible only) | Full CRUD |
| `spoken_languages` | SELECT (visible only) | Full CRUD |
| `personal_info` | SELECT (visible only) | Full CRUD |
| `site_settings` | SELECT | Full CRUD |
| `resume_files` | SELECT (active only) | Full CRUD |

Secrets and service role keys are **never** exposed on the client side.

---

## 📄 License

MIT License — See root LICENSE for details.
