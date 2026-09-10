# Supabase RPC Functions Guide

## 🎯 Overview

This guide covers the Supabase-specific optimizations including RPC (Remote Procedure Call) functions, Row Level Security (RLS) policies, and performance enhancements.

---

## 📋 Table of Contents

- [Why Use RPC Functions?](#why-use-rpc-functions)
- [Setup Instructions](#setup-instructions)
- [RPC Functions Reference](#rpc-functions-reference)
- [Row Level Security](#row-level-security)
- [Performance Optimizations](#performance-optimizations)
- [Usage Examples](#usage-examples)
- [Migration Guide](#migration-guide)

---

## 🤔 Why Use RPC Functions?

### Benefits

1. **Performance** 
   - Single database round-trip instead of multiple queries
   - Server-side processing reduces data transfer
   - Optimized query plans

2. **Security**
   - Centralized business logic
   - RLS policies enforce access control
   - SQL injection prevention

3. **Maintainability**
   - Database logic in one place
   - Easy to update without deploying backend
   - Version control for database functions

4. **Multi-language Support**
   - Language selection handled server-side
   - Reduced client-side complexity
   - Consistent fallback logic

### Performance Comparison

**Without RPC (Multiple Queries):**
```javascript
// 3 separate queries
const projects = await supabase.from('projects').select('*');
const featured = projects.filter(p => p.featured);
const localized = featured.map(p => localize(p, 'ur'));
```

**With RPC (Single Query):**
```javascript
// 1 optimized query
const { data } = await supabase.rpc('get_projects', { 
  p_lang: 'ur', 
  p_featured_only: true 
});
```

---

## 🚀 Setup Instructions

### Step 1: Run Base Schema

First, ensure the base schema is created:

```bash
# If using local PostgreSQL
npm run migrate:portfolio

# If using Supabase Cloud
# Go to SQL Editor and run: Backend/database/schema-portfolio-content.sql
```

### Step 2: Run RPC Schema

#### Option A: Supabase Dashboard

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Copy contents of `Backend/database/schema-supabase-rpc.sql`
4. Paste and click **Run**
5. Verify success (should see "Success" message)

#### Option B: Supabase CLI

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migration
supabase db push --file Backend/database/schema-supabase-rpc.sql
```

#### Option C: Migration Script

```bash
# Add your Supabase credentials to .env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx

# Run migration (PostgreSQL only for now)
npm run migrate:portfolio
```

### Step 3: Verify Installation

Run this query in Supabase SQL Editor:

```sql
-- List all RPC functions
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND (routine_name LIKE 'get_%' OR routine_name = 'search_portfolio')
ORDER BY routine_name;
```

Expected output: 12 functions

---

## 📚 RPC Functions Reference

### 1. get_projects

Get all visible projects with language support and optional filtering.

**Parameters:**
- `p_lang` (VARCHAR, default: 'en') - Language code
- `p_featured_only` (BOOLEAN, default: false) - Filter featured only
- `p_limit` (INTEGER, default: 100) - Maximum results

**Example:**
```javascript
// Get all projects in English
const { data } = await supabase.rpc('get_projects', {
  p_lang: 'en',
  p_featured_only: false,
  p_limit: 100
});

// Get featured projects in Urdu
const { data } = await supabase.rpc('get_projects', {
  p_lang: 'ur',
  p_featured_only: true
});
```

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "CARSAGE",
    "slug": "carsage",
    "description": "...",
    "github_url": "...",
    "tech_stack": ["React Native", "Expo"],
    "featured": true,
    "color": "purple"
  }
]
```

---

### 2. get_project_by_slug

Get a single project by its slug.

**Parameters:**
- `p_slug` (VARCHAR) - Project slug
- `p_lang` (VARCHAR, default: 'en') - Language code

**Example:**
```javascript
const { data } = await supabase.rpc('get_project_by_slug', {
  p_slug: 'carsage',
  p_lang: 'hi'
});

// Returns single object (not array)
```

---

### 3. get_experiences

Get work experiences with language support.

**Parameters:**
- `p_lang` (VARCHAR, default: 'en') - Language code
- `p_current_only` (BOOLEAN, default: false) - Only current position

**Example:**
```javascript
// Get all experiences
const { data } = await supabase.rpc('get_experiences', {
  p_lang: 'en'
});

// Get only current position
const { data } = await supabase.rpc('get_experiences', {
  p_lang: 'ur',
  p_current_only: true
});
```

---

### 4. get_skills

Get skills with optional category filter.

**Parameters:**
- `p_category` (VARCHAR, nullable) - Category filter (language, framework, tool, database, other)

**Example:**
```javascript
// Get all skills
const { data } = await supabase.rpc('get_skills', {
  p_category: null
});

// Get only programming languages
const { data } = await supabase.rpc('get_skills', {
  p_category: 'language'
});
```

---

### 5. get_certifications

Get certifications with language support.

**Parameters:**
- `p_lang` (VARCHAR, default: 'en') - Language code
- `p_certificate_type` (VARCHAR, nullable) - Type filter (online, internship, degree, other)

**Example:**
```javascript
// Get all certifications
const { data } = await supabase.rpc('get_certifications', {
  p_lang: 'en',
  p_certificate_type: null
});

// Get only online courses
const { data } = await supabase.rpc('get_certifications', {
  p_lang: 'ar',
  p_certificate_type: 'online'
});
```

---

### 6. get_profile

Get active profile information with language support.

**Parameters:**
- `p_lang` (VARCHAR, default: 'en') - Language code

**Example:**
```javascript
const { data } = await supabase.rpc('get_profile', {
  p_lang: 'fr'
});

// Returns single object with localized bio, role, status
```

---

### 7. get_tools

Get development tools with optional category filter.

**Parameters:**
- `p_category` (VARCHAR, nullable) - Category filter (editor, database, api, automation, design, other)

**Example:**
```javascript
// Get all tools
const { data } = await supabase.rpc('get_tools', {
  p_category: null
});

// Get only editors
const { data } = await supabase.rpc('get_tools', {
  p_category: 'editor'
});
```

---

### 8. get_github_repos

Get cached GitHub repositories.

**Parameters:**
- `p_limit` (INTEGER, default: 10) - Maximum results

**Example:**
```javascript
const { data } = await supabase.rpc('get_github_repos', {
  p_limit: 20
});
```

---

### 9. get_github_stats

Get GitHub statistics summary.

**Parameters:** None

**Example:**
```javascript
const { data } = await supabase.rpc('get_github_stats');

// Returns JSON object with stats
```

**Response:**
```json
{
  "total_repos": 25,
  "total_stars": 150,
  "total_forks": 30,
  "total_watchers": 45,
  "languages": ["JavaScript", "Python", "TypeScript"],
  "last_updated": "2026-09-09T..."
}
```

---

### 10. get_spoken_languages

Get spoken languages with proficiency.

**Parameters:**
- `p_lang` (VARCHAR, default: 'en') - Language code for translations

**Example:**
```javascript
const { data } = await supabase.rpc('get_spoken_languages', {
  p_lang: 'ur'
});
```

---

### 11. search_portfolio

Full-text search across portfolio content.

**Parameters:**
- `p_query` (TEXT) - Search query
- `p_lang` (VARCHAR, default: 'en') - Language code

**Example:**
```javascript
const { data } = await supabase.rpc('search_portfolio', {
  p_query: 'react',
  p_lang: 'en'
});
```

**Response:**
```json
{
  "projects": [
    { "id": "...", "title": "CARSAGE", "slug": "carsage", "type": "project" }
  ],
  "experiences": [
    { "id": "...", "company_name": "DevFlovv", "role": "...", "type": "experience" }
  ],
  "skills": [
    { "id": "...", "name": "React", "category": "framework", "type": "skill" }
  ]
}
```

---

### 12. get_portfolio_summary

Get portfolio statistics summary.

**Parameters:** None

**Example:**
```javascript
const { data } = await supabase.rpc('get_portfolio_summary');
```

**Response:**
```json
{
  "total_projects": 4,
  "featured_projects": 1,
  "total_experiences": 2,
  "current_position": "CMIT Internship Program, Lahore",
  "total_skills": 6,
  "total_certifications": 5,
  "github_repos": 25,
  "github_stars": 150,
  "last_updated": "2026-09-09T..."
}
```

---

## 🔒 Row Level Security

### What is RLS?

Row Level Security (RLS) restricts which rows users can access based on policies. This provides database-level security.

### Policies Implemented

#### Public Read Access

All tables allow public read access for visible content:

```sql
-- Example: Projects
CREATE POLICY "Public can view visible projects"
  ON projects FOR SELECT
  USING (is_visible = true);
```

#### Authenticated Write Access

Only authenticated users can create, update, or delete:

```sql
-- Example: Projects
CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');
```

### Disabling RLS (Development Only)

```sql
-- ⚠️ Use only in development!
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
```

### Testing RLS Policies

```javascript
// As anonymous user (public)
const { data } = await supabase.from('projects').select('*');
// ✅ Returns only visible projects

// As authenticated user
const { data } = await supabase
  .auth.signIn({ email, password })
  .from('projects').insert({ ... });
// ✅ Allowed

// As anonymous user
const { error } = await supabase.from('projects').insert({ ... });
// ❌ Error: new row violates row-level security policy
```

---

## ⚡ Performance Optimizations

### 1. Indexes Created

```sql
-- Text search indexes
CREATE INDEX idx_projects_description_search 
  ON projects USING gin(to_tsvector('english', description));

-- Composite indexes
CREATE INDEX idx_projects_featured_visible 
  ON projects(featured, is_visible, display_order);
```

### 2. Query Optimization

**Before (N+1 queries):**
```javascript
const projects = await supabase.from('projects').select('*');
for (const project of projects) {
  const localized = await localizeDescription(project, lang);
}
```

**After (1 query):**
```javascript
const { data } = await supabase.rpc('get_projects', { p_lang: lang });
```

### 3. Caching Strategy

```javascript
// Frontend caching with React Query
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery({
  queryKey: ['projects', lang],
  queryFn: () => supabase.rpc('get_projects', { p_lang: lang }),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

---

## 💡 Usage Examples

### Frontend Integration (Next.js)

```typescript
// lib/supabase-rpc.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getProjects(lang: string, featuredOnly = false) {
  const { data, error } = await supabase.rpc('get_projects', {
    p_lang: lang,
    p_featured_only: featuredOnly
  });
  
  if (error) throw error;
  return data;
}

export async function getProfile(lang: string) {
  const { data, error } = await supabase.rpc('get_profile', {
    p_lang: lang
  });
  
  if (error) throw error;
  return data[0]; // Returns array, get first item
}
```

```typescript
// app/page.tsx
import { getProjects, getProfile } from '@/lib/supabase-rpc';

export default async function HomePage({ 
  params: { lang } 
}: { 
  params: { lang: string } 
}) {
  const [projects, profile] = await Promise.all([
    getProjects(lang, true), // Featured projects
    getProfile(lang)
  ]);
  
  return (
    <div>
      <h1>{profile.full_name}</h1>
      <p>{profile.bio}</p>
      
      <div>
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

### Backend API Integration

```javascript
// routes/supabase-rpc.js (already created)
const { getProjects } = require('../services/supabase-rpc');

router.get('/api/v2/projects', async (req, res) => {
  const { lang = 'en', featured = 'false' } = req.query;
  
  const { data, error } = await getProjects({
    lang,
    featuredOnly: featured === 'true'
  });
  
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.json({ success: true, data });
});
```

---

## 🔄 Migration Guide

### Switching from Regular Queries to RPC

#### Before:
```javascript
// Multiple steps
const { data: allProjects } = await supabase
  .from('projects')
  .select('*')
  .eq('is_visible', true);

const featured = allProjects.filter(p => p.featured);

const localized = featured.map(p => ({
  ...p,
  description: p[`description_${lang}`] || p.description
}));
```

#### After:
```javascript
// Single optimized call
const { data } = await supabase.rpc('get_projects', {
  p_lang: lang,
  p_featured_only: true
});
```

### Adding New RPC Functions

1. **Create SQL Function:**
```sql
CREATE OR REPLACE FUNCTION get_my_data(p_param VARCHAR)
RETURNS TABLE (...) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ... FROM my_table WHERE ...;
END;
$$;
```

2. **Add to Service:**
```javascript
// services/supabase-rpc.js
async function getMyData(param) {
  const client = getSupabaseClient();
  const { data, error } = await client.rpc('get_my_data', {
    p_param: param
  });
  return { data, error };
}
```

3. **Create Route:**
```javascript
// routes/supabase-optimized.js
router.get('/my-data', async (req, res) => {
  const { data, error } = await getMyData(req.query.param);
  if (error) return sendError(res, 500, error.message);
  return sendSuccess(res, data);
});
```

---

## 🧪 Testing RPC Functions

### SQL Editor Testing

```sql
-- Test get_projects
SELECT * FROM get_projects('en', false, 10);

-- Test search
SELECT * FROM search_portfolio('react', 'en');

-- Test summary
SELECT * FROM get_portfolio_summary();
```

### JavaScript Testing

```javascript
// test-supabase-rpc.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testRPC() {
  // Test projects
  const { data: projects, error: projectsError } = await supabase.rpc('get_projects', {
    p_lang: 'en',
    p_featured_only: false
  });
  console.log('Projects:', projects?.length, projectsError);
  
  // Test search
  const { data: searchResults, error: searchError } = await supabase.rpc('search_portfolio', {
    p_query: 'react',
    p_lang: 'en'
  });
  console.log('Search:', searchResults, searchError);
  
  // Test summary
  const { data: summary, error: summaryError } = await supabase.rpc('get_portfolio_summary');
  console.log('Summary:', summary, summaryError);
}

testRPC();
```

---

## 📝 Best Practices

1. **Use RPC for Complex Queries**
   - Multi-table joins
   - Conditional logic
   - Language-specific data

2. **Use Direct Queries for Simple Operations**
   - Single table selects
   - Basic CRUD without business logic

3. **Cache RPC Results**
   - Use React Query or SWR
   - Set appropriate stale times
   - Invalidate on mutations

4. **Monitor Performance**
   - Check query execution times in Supabase dashboard
   - Use EXPLAIN ANALYZE for optimization
   - Add indexes as needed

5. **Security**
   - Always use RLS policies
   - Test with different auth states
   - Never expose service role key client-side

---

## 🆘 Troubleshooting

### RPC Function Not Found

**Error:** `function get_projects does not exist`

**Solution:**
1. Verify function exists: Run schema-supabase-rpc.sql
2. Check function name spelling
3. Ensure you're connected to correct database

### Permission Denied

**Error:** `permission denied for function get_projects`

**Solution:**
```sql
-- Grant permissions
GRANT EXECUTE ON FUNCTION get_projects TO anon, authenticated;
```

### RLS Blocking Queries

**Error:** `new row violates row-level security policy`

**Solution:**
1. Check RLS policies match your use case
2. Verify user authentication
3. For development, temporarily disable RLS

### Performance Issues

**Slow queries?**

1. Check indexes exist
2. Analyze query plan
3. Consider adding more indexes
4. Use connection pooling

---

## 📚 Additional Resources

- [Supabase RPC Documentation](https://supabase.com/docs/guides/database/functions)
- [PostgreSQL Functions Guide](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Last Updated:** 2026-09-09  
**Version:** 1.0.0  
**Maintainer:** Wajahat Ali (@Wajahat-Ali-Git)
