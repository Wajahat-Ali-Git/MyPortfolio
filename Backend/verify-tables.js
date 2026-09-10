// Quick script to verify portfolio tables exist
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

(async () => {
  const { rows } = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('projects', 'experiences', 'skills', 'certifications', 'spoken_languages', 'personal_info', 'github_cache', 'tools')
    ORDER BY table_name
  `);

  console.log('\n✅ Portfolio Content Tables Created:\n');
  rows.forEach(t => console.log(`   ✓ ${t.table_name}`));
  console.log(`\n📊 Total: ${rows.length}/8 tables\n`);
  
  await pool.end();
})();
