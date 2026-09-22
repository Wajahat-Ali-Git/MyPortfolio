# Backend Test Scripts

This folder contains manual test scripts for verifying the backend database and API integrations.

> **Note:** These are lightweight manual smoke-test scripts (not a formal test framework like Jest). Run them during development to verify connectivity and correctness.

---

## 📋 Scripts

| Script | Purpose | How to Run |
|---|---|---|
| `test-db-connection.js` | Tests Supabase + PostgreSQL connections and the backend API health endpoint | `npm run test-db` |
| `test-api-endpoints.js` | Smoke-tests all REST API endpoints against a running backend server | `npm run test-api` |
| `verify-tables.js` | Verifies that all expected database tables exist in the connected database | `npm run verify-tables` |

---

## 🚀 Running the Tests

### Prerequisites
1. Ensure your `.env` file is configured at `Backend/.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   DATABASE_URL=postgresql://...   # optional — for direct pg tests
   PORT=5000                        # optional — defaults to 5000
   ```

2. For API endpoint tests, the backend server must be running:
   ```bash
   npm run dev
   ```

### Run All Tests

```bash
# From the Backend/ directory:

# 1. Verify database tables exist
npm run verify-tables

# 2. Test database connections
npm run test-db

# 3. Test all API endpoints (requires npm run dev in another terminal)
npm run test-api
```

---

## 🔧 Environment Variables Used

| Variable | Required by | Purpose |
|---|---|---|
| `SUPABASE_URL` | `test-db-connection.js` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `test-db-connection.js` | Admin key for Supabase queries |
| `DATABASE_URL` | `test-db-connection.js`, `verify-tables.js` | Direct PostgreSQL connection string |
| `PORT` | `test-db-connection.js` | Backend server port (default: 5000) |
| `API_BASE_URL` | `test-api-endpoints.js` | Override API base URL (default: http://localhost:5000) |

---

## ⚠️ Security Note

These scripts use `SUPABASE_SERVICE_ROLE_KEY` which grants full database access. **Never expose this key** in client-side code or commit it to version control.
