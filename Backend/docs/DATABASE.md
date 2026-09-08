# Database Documentation

Complete guide to the Portfolio Backend database structure and management.

---

## 📊 Database Overview

**Database Type:** PostgreSQL (via Supabase)  
**Tables:** 1 (contact_messages)  
**Security:** Row Level Security (RLS) enabled

---

## 🗂️ Table Structure

### `contact_messages`

Stores all contact form submissions from the portfolio website.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Unique identifier |
| `name` | TEXT | NO | - | Sender's name (1-100 chars) |
| `email` | TEXT | NO | - | Sender's email (5-255 chars) |
| `message` | TEXT | NO | - | Message content (10-5000 chars) |
| `ip_address` | TEXT | YES | - | Sender's IP address |
| `user_agent` | TEXT | YES | - | Browser user agent |
| `created_at` | TIMESTAMPTZ | NO | `NOW()` | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NO | `NOW()` | Last update timestamp |

---

## 🔒 Security Features

### Row Level Security (RLS)

RLS is **enabled** to ensure only authorized access to data.

**Policies:**
- ✅ Service role can INSERT messages
- ✅ Service role can SELECT messages
- ❌ Anonymous users (anon key) cannot read/write

This means:
- Only your backend API can access the data
- Direct access from frontend is blocked
- Prevents unauthorized data exposure

---

## 🔍 Indexes

Performance optimized with these indexes:

1. **`idx_contact_messages_created_at`**
   - Column: `created_at DESC`
   - Purpose: Fast sorting by date (newest first)

2. **`idx_contact_messages_email`**
   - Column: `email`
   - Purpose: Quick email lookups

---

## 📝 Constraints

### Check Constraints

- `name`: 1-100 characters
- `email`: 5-255 characters
- `message`: 10-5000 characters

### Data Validation

Handled at multiple levels:
1. **Database level:** CHECK constraints
2. **API level:** Express validation in `src/index.js`
3. **Frontend level:** Form validation (to be implemented)

---

## 🚀 Setup Instructions

### 1. Run the Schema

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
2. Copy the contents of `schema.sql`
3. Paste and click **"Run"**
4. Verify success: "Success. No rows returned"

### 2. Verify Table Creation

```sql
-- Check if table exists
SELECT * FROM contact_messages LIMIT 1;

-- View table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'contact_messages';
```

### 3. Test Insert

```sql
-- Insert a test message
INSERT INTO contact_messages (name, email, message)
VALUES ('Test User', 'test@example.com', 'This is a test message');

-- Verify it was inserted
SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5;
```

---

## 🔧 Common Operations

### View Recent Messages

```sql
SELECT id, name, email, LEFT(message, 50) as preview, created_at
FROM contact_messages
ORDER BY created_at DESC
LIMIT 10;
```

### Search by Email

```sql
SELECT * FROM contact_messages
WHERE email ILIKE '%example.com%'
ORDER BY created_at DESC;
```

### Count Messages by Date

```sql
SELECT DATE(created_at) as date, COUNT(*) as message_count
FROM contact_messages
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Delete Test Messages

```sql
-- BE CAREFUL! This deletes data
DELETE FROM contact_messages
WHERE email = 'test@example.com';
```

---

## 🔄 Migrations

### Adding a New Column (Example)

```sql
-- Add a 'status' column
ALTER TABLE contact_messages
ADD COLUMN status TEXT DEFAULT 'unread'
CHECK (status IN ('unread', 'read', 'archived'));

-- Create index for status
CREATE INDEX idx_contact_messages_status ON contact_messages (status);
```

### Modifying Constraints (Example)

```sql
-- Allow longer messages (up to 10,000 chars)
ALTER TABLE contact_messages
DROP CONSTRAINT contact_messages_message_check;

ALTER TABLE contact_messages
ADD CONSTRAINT contact_messages_message_check
CHECK (char_length(message) >= 10 AND char_length(message) <= 10000);
```

---

## 🐛 Troubleshooting

### Issue: "Permission denied for table contact_messages"

**Solution:** Check RLS policies are correctly configured:
```sql
SELECT * FROM pg_policies WHERE tablename = 'contact_messages';
```

### Issue: "Check constraint violation"

**Solution:** Ensure data meets the constraints:
- Name: 1-100 characters
- Email: 5-255 characters, valid format
- Message: 10-5000 characters

### Issue: "Table already exists"

**Solution:** Drop and recreate:
```sql
DROP TABLE IF EXISTS contact_messages CASCADE;
-- Then run schema.sql again
```

---

## 📈 Monitoring

### Check Table Size

```sql
SELECT
    pg_size_pretty(pg_total_relation_size('contact_messages')) as total_size,
    pg_size_pretty(pg_relation_size('contact_messages')) as table_size,
    pg_size_pretty(pg_indexes_size('contact_messages')) as indexes_size;
```

### View Active Connections

In Supabase Dashboard → Database → Connections

---

## 🔐 Backup & Recovery

### Export Data (JSON)

In Supabase Dashboard:
1. Go to **Table Editor**
2. Select `contact_messages`
3. Click **"..."** → **"Download as CSV"**

### Export via SQL

```sql
COPY (SELECT * FROM contact_messages)
TO '/tmp/contact_messages_backup.csv'
WITH CSV HEADER;
```

---

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Database Guide](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Questions?** Check the main [Backend README](../README.md) or Supabase logs.
