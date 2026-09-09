#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests both Supabase and PostgreSQL connections
 */

require('dotenv').config();

async function testSupabase() {
  console.log('\n🔍 Testing Supabase Connection...\n');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('❌ Supabase credentials not configured');
    return false;
  }

  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Try to select from contact_messages
    const { data, error } = await supabase
      .from('contact_messages')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Supabase connection failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful!');
    console.log(`   URL: ${process.env.SUPABASE_URL}`);
    return true;
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

async function testPostgreSQL() {
  console.log('\n🔍 Testing PostgreSQL Connection...\n');
  
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL not configured');
    return false;
  }

  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Test connection
    const client = await pool.connect();
    console.log('✅ PostgreSQL connection successful!');

    // Try to query the table
    const result = await client.query('SELECT COUNT(*) FROM contact_messages');
    console.log(`   Messages in database: ${result.rows[0].count}`);
    
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.log('❌ PostgreSQL connection failed:', error.message);
    return false;
  }
}

async function testBackendAPI() {
  console.log('\n🔍 Testing Backend API...\n');
  
  try {
    const http = require('http');
    const port = process.env.PORT || 5000;

    const options = {
      hostname: 'localhost',
      port: port,
      path: '/health',
      method: 'GET',
    };

    return new Promise((resolve) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            console.log('✅ Backend API is running!');
            console.log(`   Status: ${response.status}`);
            console.log(`   Environment: ${response.environment}`);
            console.log(`   Database: ${response.supabase || 'N/A'}`);
            resolve(true);
          } catch (e) {
            console.log('❌ Invalid API response');
            resolve(false);
          }
        });
      });

      req.on('error', (error) => {
        console.log('❌ Backend API not running on port', port);
        console.log('   Start it with: npm run dev');
        resolve(false);
      });

      req.end();
    });
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('\n================================================');
  console.log('  Database Connection Test');
  console.log('================================================\n');

  // Test backend API first
  const apiRunning = await testBackendAPI();

  // Test database connections
  const supabaseOk = await testSupabase();
  const postgresOk = await testPostgreSQL();

  // Summary
  console.log('\n================================================');
  console.log('  Summary');
  console.log('================================================\n');
  
  console.log('Backend API:    ', apiRunning ? '✅ Running' : '❌ Not Running');
  console.log('Supabase:       ', supabaseOk ? '✅ Connected' : '⚠️  Not Configured');
  console.log('PostgreSQL:     ', postgresOk ? '✅ Connected' : '⚠️  Not Configured');

  console.log('\n');

  if (!apiRunning) {
    console.log('💡 Tip: Start backend with: npm run dev');
  }

  if (!supabaseOk && !postgresOk) {
    console.log('⚠️  Warning: No database configured!');
    console.log('   Configure either:');
    console.log('   - Supabase (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)');
    console.log('   - PostgreSQL (DATABASE_URL)');
  }

  console.log('\n');
  process.exit(apiRunning && (supabaseOk || postgresOk) ? 0 : 1);
}

main();
