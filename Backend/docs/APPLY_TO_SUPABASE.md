# 🚀 How to Apply Migrations to Remote Supabase

## Quick Start (5 Minutes)

### Step 1: Access Your Supabase Project

1. Go to https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Click **SQL Editor** in the left sidebar

### Step 2: Run Base Schema

1. Click **New Query** button
2. Copy **ALL** contents from: `Backend/database/schema-portfolio-content.sql`
3. Paste into the SQL Editor
4. Click **RUN** (or press Ctrl+Enter)
5. Wait for success message (should take 5-10 seconds)

✅ **Expected Output:** "Success. No rows returned"

### Step 3: Run RPC Functions

1. Click **New Query** again
2. Copy **ALL** contents from: `Backend/database/schema-supabase-rpc.sql`
3. Paste into the SQL Editor
4. Click **RUN**
5. Wait for success message

✅ **Expected Output:** "Success. No rows returned"

### Step 4: Verify Installation

Run this verification query:

```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'projects', 'experiences', 'skills', 
    'certifications', 'spoken_languages', 
    'personal_info', 'github_cache', 'tools'
  )
ORDER BY table_name;

-- Check RPC functions
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (routine_name LIKE 'get_%' OR routine_name = 'search_portfolio')
ORDER BY routine_name;
```

✅ **Expected:** 8 tables and 12 functions

### Step 5: Populate with Data

1. Click **New Query**
2. Copy **ALL** contents from: `Backend/supabase/seed.sql`
3. Paste and click **RUN**

✅ **Expected:** See record counts at the end

---

## 🔧 Update Your Backend .env

After successful migration, update your `.env` file:

```env
# Comment out local PostgreSQL
# DATABASE_URL=postgresql://postgres:postgres@localhost:55322/postgres

# Add your Supabase credentials
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Keep these
NODE_ENV=development
PORT=5000
API_KEY=your_api_key
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

**Get your keys:**
1. Go to **Project Settings** → **API**
2. Copy:
   - `URL` → SUPABASE_URL
   - `anon public` key → SUPABASE_ANON_KEY
   - `service_role` key → SUPABASE_SERVICE_ROLE_KEY (⚠️ Keep secret!)

---

## ✅ Testing Your Remote Setup

### Test 1: Direct Supabase Connection

```javascript
// test-remote-supabase.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://YOUR_PROJECT_REF.supabase.co',
  'YOUR_ANON_KEY'
);

(async () => {
  // Test regular query
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*');
  
  console.log('Projects:', projects?.length, error);
  
  // Test RPC function
  const { data: rpcProjects, error: rpcError } = await supabase
    .rpc('get_projects', { p_lang: 'en', p_featured_only: false });
  
  console.log('RPC Projects:', rpcProjects?.length, rpcError);
})();
```

Run: `node test-remote-supabase.js`

### Test 2: Backend API

```bash
# Start your backend
npm run dev

# Test endpoint
curl http://localhost:5000/api/projects
curl http://localhost:5000/api/profile
```

---

## 🔄 Alternative: Using Supabase CLI

### Install CLI

```bash
npm install -g supabase
```

### Login and Link

```bash
# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF
```

### Apply Migrations

```bash
# Option 1: Push specific files
supabase db push --file Backend/database/schema-portfolio-content.sql
supabase db push --file Backend/database/schema-supabase-rpc.sql

# Option 2: Use migration folder
# Copy files to supabase/migrations/ (already done)
supabase db push
```

---

## 📋 Migration Checklist

- [ ] Logged into Supabase Dashboard
- [ ] Opened SQL Editor
- [ ] Ran `schema-portfolio-content.sql`
- [ ] Verified 8 tables created
- [ ] Ran `schema-supabase-rpc.sql`
- [ ] Verified 12 RPC functions created
- [ ] Ran `seed.sql` to populate data
- [ ] Updated `.env` with Supabase credentials
- [ ] Tested direct Supabase connection
- [ ] Tested backend API endpoints
- [ ] Verified RPC functions work

---

## ❌ Troubleshooting

### Error: "relation already exists"

**Cause:** Tables already exist from previous run

**Solution:**
```sql
-- Drop and recreate (⚠️ Deletes data!)
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
-- ... drop all tables

-- Then run schema again
```

### Error: "function already exists"

**Cause:** RPC functions already exist

**Solution:**
```sql
-- Drop functions
DROP FUNCTION IF EXISTS get_projects CASCADE;
DROP FUNCTION IF EXISTS get_experiences CASCADE;
-- ... drop all functions

-- Then run RPC schema again
```

### Error: "permission denied"

**Cause:** RLS policies blocking access

**Solution:**
```sql
-- Temporary: Disable RLS for testing
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Or: Use service_role key in your code (has RLS bypass)
```

### Can't connect to Supabase

**Check:**
1. Project is not paused (free tier pauses after 7 days inactivity)
2. Correct URL and keys in `.env`
3. Network/firewall not blocking requests
4. Supabase status: https://status.supabase.com

---

## 🎯 What's Next?

After successful migration:

1. **Test RPC Functions:**
   ```javascript
   const { data } = await supabase.rpc('get_projects', { p_lang: 'ur' });
   ```

2. **Set up Authentication** (optional):
   - Enable Email/Password auth in Supabase Dashboard
   - Protect admin endpoints

3. **Configure RLS Policies:**
   - Already created by migration
   - Test with authenticated vs anonymous users

4. **Connect Frontend:**
   - Update `portfolio/.env.local` with Supabase credentials
   - Replace API calls with direct Supabase calls (optional)

5. **Set up GitHub Sync:**
   - Add GitHub token to `.env`
   - Run: `POST http://localhost:5000/api/github/sync`

---

## 📚 Resources

- **Supabase Dashboard:** https://supabase.com/dashboard
- **SQL Editor:** Dashboard → SQL Editor
- **API Keys:** Dashboard → Project Settings → API
- **Table Editor:** Dashboard → Table Editor
- **Logs:** Dashboard → Logs

---

## 🆘 Need Help?

1. Check Supabase logs: Dashboard → Logs
2. Review this guide: `Backend/SUPABASE_RPC_GUIDE.md`
3. Test with SQL Editor first before using API
4. Use service_role key for admin operations

---

**Last Updated:** 2026-09-09  
**Estimated Time:** 5-10 minutes
