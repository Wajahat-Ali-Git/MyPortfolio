// =============================================================================
// API Endpoints Test Script
// =============================================================================
// Tests all portfolio API endpoints
// =============================================================================

const BASE_URL = 'http://localhost:5000';

console.log('🧪 Testing Portfolio API Endpoints\n');
console.log('=====================================\n');

// =============================================================================
// Test Functions
// =============================================================================

async function testEndpoint(name, url, options = {}) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data count: ${data.data ? (Array.isArray(data.data) ? data.data.length : 'single record') : 'N/A'}`);
      return true;
    } else {
      console.log(`❌ ${name}`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${data.error}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// =============================================================================
// Run Tests
// =============================================================================

(async () => {
  let passed = 0;
  let failed = 0;

  console.log('📍 Testing Core Endpoints\n');
  
  // Health check
  if (await testEndpoint('GET /health', `${BASE_URL}/health`)) passed++; else failed++;
  console.log();
  
  // Root
  if (await testEndpoint('GET /', `${BASE_URL}/`)) passed++; else failed++;
  console.log();

  console.log('📁 Testing Projects Endpoints\n');
  
  // Projects
  if (await testEndpoint('GET /api/projects', `${BASE_URL}/api/projects`)) passed++; else failed++;
  console.log();
  
  if (await testEndpoint('GET /api/projects (Urdu)', `${BASE_URL}/api/projects?lang=ur`)) passed++; else failed++;
  console.log();
  
  if (await testEndpoint('GET /api/projects/featured', `${BASE_URL}/api/projects/featured`)) passed++; else failed++;
  console.log();
  
  if (await testEndpoint('GET /api/projects/:slug', `${BASE_URL}/api/projects/carsage`)) passed++; else failed++;
  console.log();

  console.log('💼 Testing Experiences Endpoints\n');
  
  // Experiences
  if (await testEndpoint('GET /api/experiences', `${BASE_URL}/api/experiences`)) passed++; else failed++;
  console.log();
  
  if (await testEndpoint('GET /api/experiences/current', `${BASE_URL}/api/experiences/current`)) passed++; else failed++;
  console.log();
  
  if (await testEndpoint('GET /api/experiences/:slug', `${BASE_URL}/api/experiences/cmit`)) passed++; else failed++;
  console.log();

  console.log('⚡ Testing Skills Endpoints\n');
  
  // Skills
  if (await testEndpoint('GET /api/skills', `${BASE_URL}/api/skills`)) passed++; else failed++;
  console.log();
  
  if (await testEndpoint('GET /api/skills/category/:cat', `${BASE_URL}/api/skills/category/language`)) passed++; else failed++;
  console.log();

  console.log('🎓 Testing Certifications Endpoints\n');
  
  // Certifications
  if (await testEndpoint('GET /api/certifications', `${BASE_URL}/api/certifications`)) passed++; else failed++;
  console.log();
  
  if (await testEndpoint('GET /api/certifications (Hindi)', `${BASE_URL}/api/certifications?lang=hi`)) passed++; else failed++;
  console.log();

  console.log('👤 Testing Profile Endpoint\n');
  
  // Profile
  if (await testEndpoint('GET /api/profile', `${BASE_URL}/api/profile`)) passed++; else failed++;
  console.log();
  
  if (await testEndpoint('GET /api/profile (Arabic)', `${BASE_URL}/api/profile?lang=ar`)) passed++; else failed++;
  console.log();

  console.log('🛠️  Testing Tools Endpoints\n');
  
  // Tools
  if (await testEndpoint('GET /api/tools', `${BASE_URL}/api/tools`)) passed++; else failed++;
  console.log();
  
  if (await testEndpoint('GET /api/tools/category/:cat', `${BASE_URL}/api/tools/category/editor`)) passed++; else failed++;
  console.log();

  console.log('🐙 Testing GitHub Endpoints\n');
  
  // GitHub
  if (await testEndpoint('GET /api/github/repos', `${BASE_URL}/api/github/repos`)) passed++; else failed++;
  console.log();
  
  if (await testEndpoint('GET /api/github/stats', `${BASE_URL}/api/github/stats`)) passed++; else failed++;
  console.log();

  console.log('=====================================');
  console.log('📊 Test Results\n');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('=====================================\n');

  if (failed === 0) {
    console.log('🎉 All tests passed!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check the output above.\n');
    process.exit(1);
  }
})();
