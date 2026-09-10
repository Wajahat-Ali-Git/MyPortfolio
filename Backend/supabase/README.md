# Supabase Migrations

This folder contains Supabase-ready migration files.

## 📁 Files

- `migrations/20260909000001_initial_schema.sql` - Base database schema (8 tables)
- `migrations/20260909000002_rpc_functions.sql` - RPC functions and RLS policies
- `seed.sql` - Initial data population

## 🚀 Quick Apply to Supabase Cloud

### Method 1: Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard → Your Project → SQL Editor
2. Run each file in order:
   - `migrations/20260909000001_initial_schema.sql`
   - `migrations/20260909000002_rpc_functions.sql`
   - `seed.sql`

### Method 2: Supabase CLI

```bash
# Install CLI
npm install -g supabase

# Login and link
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Apply migrations
supabase db push

# Or apply specific files
supabase db push --file migrations/20260909000001_initial_schema.sql
supabase db push --file migrations/20260909000002_rpc_functions.sql
```

## 📋 What Gets Created

### Tables (8)
- `projects` - Portfolio projects
- `experiences` - Work history
- `skills` - Technical skills
- `certifications` - Professional certifications
- `spoken_languages` - Language proficiency
- `personal_info` - Personal/profile data
- `github_cache` - GitHub repo cache
- `tools` - Development tools

### RPC Functions (12)
- `get_projects(lang, featured_only, limit)`
- `get_project_by_slug(slug, lang)`
- `get_experiences(lang, current_only)`
- `get_skills(category)`
- `get_certifications(lang, certificate_type)`
- `get_profile(lang)`
- `get_tools(category)`
- `get_github_repos(limit)`
- `get_github_stats()`
- `get_spoken_languages(lang)`
- `search_portfolio(query, lang)`
- `get_portfolio_summary()`

### Security
- Row Level Security (RLS) enabled
- Public read access for visible content
- Authenticated write access required

## ✅ Verification

After running migrations, verify in SQL Editor:

```sql
-- Check tables
\dt

-- Check RPC functions
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE 'get_%';

-- Check data
SELECT * FROM get_portfolio_summary();
```

## 📚 Full Documentation

See: `Backend/APPLY_TO_SUPABASE.md` for complete instructions.
