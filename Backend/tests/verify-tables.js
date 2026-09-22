#!/usr/bin/env node

/**
 * Verify Portfolio Database Tables
 * ==================================
 * Connects to the Supabase PostgreSQL database and checks that all
 * expected portfolio content tables exist.
 *
 * Usage:
 *   node tests/verify-tables.js
 *
 * Prerequisites:
 *   - .env file configured with DATABASE_URL
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Pool } = require('pg');

const EXPECTED_TABLES = [
  'projects',
  'experiences',
  'skills',
  'certifications',
  'spoken_languages',
  'personal_info',
  'github_cache',
  'tools',
  'contact_messages',
  'site_settings',
  'resume_files',
];

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  console.log('\n🔍 Verifying Portfolio Database Tables...\n');

  try {
    const placeholders = EXPECTED_TABLES.map((_, i) => `$${i + 1}`).join(', ');
    const { rows } = await pool.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = 'public'
       AND table_name IN (${placeholders})
       ORDER BY table_name`,
      EXPECTED_TABLES
    );

    const found = rows.map((r) => r.table_name);
    const missing = EXPECTED_TABLES.filter((t) => !found.includes(t));

    console.log('✅ Tables found:\n');
    found.forEach((t) => console.log(`   ✓ ${t}`));

    if (missing.length > 0) {
      console.log('\n❌ Missing tables:\n');
      missing.forEach((t) => console.log(`   ✗ ${t}`));
    }

    console.log(`\n📊 Result: ${found.length}/${EXPECTED_TABLES.length} tables present\n`);

    if (missing.length > 0) {
      console.log('💡 Run migrations to create missing tables:');
      console.log('   cd Backend && supabase db push\n');
    }
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    console.log('\n💡 Ensure DATABASE_URL is set in your .env file\n');
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
