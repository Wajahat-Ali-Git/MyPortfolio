#!/usr/bin/env node
// =============================================================================
// Database Migration Script
// =============================================================================
// Runs SQL migration files against PostgreSQL or Supabase
// Usage: node database/migrate.js [migration-file.sql]
// =============================================================================

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// =============================================================================
// Configuration
// =============================================================================

const args = process.argv.slice(2);
const migrationFile = args[0] || 'schema-portfolio-content.sql';
const migrationPath = path.join(__dirname, migrationFile);

console.log('🔄 Portfolio Database Migration Tool\n');
console.log('=====================================');

// =============================================================================
// Check Database Configuration
// =============================================================================

let useSupabase = false;
let usePostgres = false;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  useSupabase = true;
  console.log('📦 Using Supabase');
} else if (process.env.DATABASE_URL) {
  usePostgres = true;
  console.log('🐘 Using PostgreSQL');
} else {
  console.error('❌ ERROR: No database configured!');
  console.error('   Set either SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY');
  console.error('   or DATABASE_URL in your .env file\n');
  process.exit(1);
}

// =============================================================================
// Check Migration File
// =============================================================================

if (!fs.existsSync(migrationPath)) {
  console.error(`❌ ERROR: Migration file not found: ${migrationPath}\n`);
  process.exit(1);
}

console.log(`📄 Migration file: ${migrationFile}`);
console.log('=====================================\n');

// =============================================================================
// Run Migration with PostgreSQL
// =============================================================================

async function runPostgresMigration() {
  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  console.log('🔌 Connecting to PostgreSQL...');

  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL\n');

    // Read migration file
    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log('📖 Reading migration file...');
    console.log(`   File size: ${(sql.length / 1024).toFixed(2)} KB\n`);

    // Execute migration
    console.log('⚙️  Running migration...\n');
    await pool.query(sql);

    console.log('✅ Migration completed successfully!\n');

    // Verify tables
    console.log('🔍 Verifying tables...');
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log(`\n📊 Tables created (${result.rows.length}):`);
    result.rows.forEach(row => {
      console.log(`   ✓ ${row.table_name}`);
    });

    await pool.end();
    console.log('\n🎉 Migration complete!\n');

  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error('   ', error.message);
    
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    
    if (process.env.DEBUG === 'true') {
      console.error('\n📋 Full error:');
      console.error(error);
    }
    
    await pool.end();
    process.exit(1);
  }
}

// =============================================================================
// Run Migration with Supabase
// =============================================================================

async function runSupabaseMigration() {
  console.log('🔌 Connecting to Supabase...');

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1);

    // Connection is valid even if table doesn't exist
    console.log('✅ Connected to Supabase\n');

    // Read migration file
    const sql = fs.readFileSync(migrationPath, 'utf8');
    console.log('📖 Reading migration file...');
    console.log(`   File size: ${(sql.length / 1024).toFixed(2)} KB\n`);

    console.log('⚠️  NOTE: Supabase migrations should be run through the Supabase Dashboard');
    console.log('   or using the Supabase CLI for best results.\n');

    console.log('📋 Migration SQL Preview (first 500 chars):');
    console.log('─────────────────────────────────────────');
    console.log(sql.substring(0, 500) + '...\n');

    console.log('📚 To run this migration in Supabase:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/_/sql');
    console.log(`   2. Copy the contents of: ${migrationFile}`);
    console.log('   3. Paste into the SQL Editor');
    console.log('   4. Click "Run"\n');

    console.log('💡 Or use Supabase CLI:');
    console.log(`   supabase db push --file ${migrationPath}\n`);

  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error('   ', error.message);
    process.exit(1);
  }
}

// =============================================================================
// Main Execution
// =============================================================================

(async () => {
  try {
    if (usePostgres) {
      await runPostgresMigration();
    } else if (useSupabase) {
      await runSupabaseMigration();
    }
  } catch (error) {
    console.error('\n❌ Unexpected error:');
    console.error('   ', error.message);
    process.exit(1);
  }
})();
