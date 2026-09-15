# Supabase Database & Backend Configuration

This folder manages the **Supabase PostgreSQL database schema, migrations, and configuration** for the portfolio website.

The portfolio frontend communicates directly with Supabase via `@supabase/supabase-js` and Next.js Server Actions, eliminating the need for a separate custom Express server.

---

## 📁 Folder Structure

```
Backend/
├── supabase/
│   ├── config.toml           # Supabase CLI project configuration
│   └── migrations/           # SQL migration files
│       ├── 20260909000001_initial_schema.sql
│       ├── 20260909000002_rpc_functions.sql
│       └── 20260910000001_contact_messages.sql
└── README.md                 # Supabase database & CLI guide
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

# Push pending SQL migrations to your remote Supabase project
supabase db push

# Pull schema changes from remote database
supabase db pull
```

---

## 🧪 Local Supabase Testing (with Docker)

You can run the entire Supabase backend stack locally on your machine using Docker.

```bash
# Start the local Supabase instance
supabase start

# Reset local database and run all migrations from scratch
supabase db reset

# Check status and view local URLs (Studio, API, Database)
supabase status

# Stop local Supabase instance
supabase stop
```

When `supabase start` finishes, you can access:
- **Local Supabase Studio (Web UI):** `http://localhost:54323`
- **Local API Gateway:** `http://localhost:54321`
- **Local PostgreSQL DB:** `postgresql://postgres:postgres@localhost:54322/postgres`

---

## 🔒 Security & Row Level Security (RLS)

All tables have Row Level Security enabled.
- **`contact_messages`**: Anonymous (`anon`) and authenticated users can `INSERT`. Only authenticated admin users can `SELECT`, `UPDATE`, or `DELETE`.
- Secrets and service role keys are never exposed on the client side.

---

## 📄 License

MIT License - See root LICENSE for details.
