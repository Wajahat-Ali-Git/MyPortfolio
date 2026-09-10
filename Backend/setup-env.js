#!/usr/bin/env node
// =============================================================================
// Environment Setup Helper
// =============================================================================
// Interactive script to configure database connection
// =============================================================================

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🚀 Portfolio Backend - Database Setup\n');
console.log('=====================================\n');

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('Choose your database setup:\n');
  console.log('1. Docker PostgreSQL (Local - Recommended for development)');
  console.log('2. Supabase (Cloud - Free tier available)');
  console.log('3. Custom PostgreSQL (Your own server)\n');

  const choice = await question('Enter choice (1-3): ');

  let envContent = '';

  if (choice === '1') {
    // Docker PostgreSQL
    console.log('\n📦 Setting up Docker PostgreSQL...\n');
    
    const dbName = await question('Database name (default: portfolio): ') || 'portfolio';
    const dbUser = await question('Database user (default: portfolio_user): ') || 'portfolio_user';
    const dbPass = await question('Database password (default: portfolio_password): ') || 'portfolio_password';
    const port = await question('Port (default: 5000): ') || '5000';
    const apiKey = await question('API Key (for admin endpoints): ') || 'change_me_' + Math.random().toString(36).substring(7);

    envContent = `# =============================================================================
# PORTFOLIO BACKEND - DOCKER POSTGRESQL SETUP
# =============================================================================

NODE_ENV=development
PORT=${port}

# PostgreSQL Database (Docker)
DATABASE_URL=postgresql://${dbUser}:${dbPass}@localhost:5432/${dbName}

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Admin API Key
API_KEY=${apiKey}

# Debug
DEBUG=true
`;

    console.log('\n✅ Configuration created!\n');
    console.log('📋 Next steps:');
    console.log('   1. Start Docker: docker-compose up -d');
    console.log('   2. Run migrations: npm run migrate:portfolio');
    console.log('   3. Start backend: npm run dev\n');

  } else if (choice === '2') {
    // Supabase
    console.log('\n☁️  Setting up Supabase...\n');
    console.log('📚 First, create a project at: https://supabase.com\n');
    
    const supabaseUrl = await question('Supabase URL (e.g., https://xxx.supabase.co): ');
    const supabaseAnonKey = await question('Supabase Anon Key: ');
    const supabaseServiceKey = await question('Supabase Service Role Key: ');
    const port = await question('Port (default: 5000): ') || '5000';
    const apiKey = await question('API Key (for admin endpoints): ') || 'change_me_' + Math.random().toString(36).substring(7);

    envContent = `# =============================================================================
# PORTFOLIO BACKEND - SUPABASE SETUP
# =============================================================================

NODE_ENV=development
PORT=${port}

# Supabase
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Admin API Key
API_KEY=${apiKey}

# Debug
DEBUG=true
`;

    console.log('\n✅ Configuration created!\n');
    console.log('📋 Next steps:');
    console.log('   1. Go to Supabase Dashboard > SQL Editor');
    console.log('   2. Copy contents of database/schema-portfolio-content.sql');
    console.log('   3. Paste and run in SQL Editor');
    console.log('   4. Start backend: npm run dev\n');

  } else if (choice === '3') {
    // Custom PostgreSQL
    console.log('\n🐘 Setting up Custom PostgreSQL...\n');
    
    const dbUrl = await question('PostgreSQL connection string: ');
    const port = await question('Port (default: 5000): ') || '5000';
    const apiKey = await question('API Key (for admin endpoints): ') || 'change_me_' + Math.random().toString(36).substring(7);

    envContent = `# =============================================================================
# PORTFOLIO BACKEND - CUSTOM POSTGRESQL SETUP
# =============================================================================

NODE_ENV=development
PORT=${port}

# PostgreSQL Database
DATABASE_URL=${dbUrl}

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Admin API Key
API_KEY=${apiKey}

# Debug
DEBUG=true
`;

    console.log('\n✅ Configuration created!\n');
    console.log('📋 Next steps:');
    console.log('   1. Run migrations: npm run migrate:portfolio');
    console.log('   2. Start backend: npm run dev\n');

  } else {
    console.log('\n❌ Invalid choice. Exiting.\n');
    rl.close();
    return;
  }

  // Write .env file
  const envPath = path.join(__dirname, '.env');
  fs.writeFileSync(envPath, envContent);
  
  console.log(`💾 Created: ${envPath}\n`);
  console.log('⚠️  Remember to add .env to .gitignore!\n');

  rl.close();
}

main().catch(error => {
  console.error('\n❌ Setup failed:', error.message);
  rl.close();
  process.exit(1);
});
