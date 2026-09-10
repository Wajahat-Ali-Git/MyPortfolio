#!/usr/bin/env node
// =============================================================================
// Database Seed Script
// =============================================================================
// Populates database with portfolio data from frontend constants
// =============================================================================

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

console.log('🌱 Seeding Portfolio Database\n');
console.log('=====================================\n');

// =============================================================================
// Seed Data
// =============================================================================

const seedData = {
  // Personal Info
  personal_info: {
    full_name: 'Wajahat Ali',
    role: 'Software Engineer & Developer',
    role_en: 'Software Engineer & Developer',
    role_ur: 'سافٹ ویئر انجینئر اور ڈویلپر',
    role_hi: 'सॉफ्टवेयर इंजीनियर और डेवलपर',
    bio: 'I specialize in building scalable web and mobile applications. Always eager to learn new technologies and solve complex problems with elegant solutions.',
    bio_en: 'I specialize in building scalable web and mobile applications. Always eager to learn new technologies and solve complex problems with elegant solutions.',
    bio_ur: 'میں اسکیل ایبل ویب اور موبائل ایپلی کیشنز بنانے میں مہارت رکھتا ہوں۔ ہمیشہ نئی ٹیکنالوجیز سیکھنے اور خوبصورت حل کے ساتھ پیچیدہ مسائل حل کرنے کا خواہشمند رہتا ہوں۔',
    bio_hi: 'मैं स्केलेबल वेब और मोबाइल एप्लिकेशन बनाने में विशेषज्ञता रखता हूँ। हमेशा नई तकनीकों को सीखने और जटिल समस्याओं को सुरुचिपूर्ण समाधानों के साथ हल करने के लिए उत्सुक रहता हूँ।',
    availability_status: 'Available for opportunities',
    status_en: 'Available for opportunities',
    status_ur: 'مواقع کے لیے دستیاب ہے',
    status_hi: 'काम के लिए उपलब्ध',
    email: 'wajahat@example.com',
    github_url: 'https://github.com/Wajahat-Ali-Git',
    linkedin_url: 'https://www.linkedin.com/in/wajahat-ali-b098b4243',
    is_active: true
  },

  // Projects
  projects: [
    {
      title: 'CARSAGE',
      slug: 'carsage',
      description: 'A React Native car recommendation mobile app built with Expo. Features Firebase auth, React Navigation, and AI/ML car features using TensorFlow and Flask services.',
      description_en: 'A React Native car recommendation mobile app built with Expo. Features Firebase auth, React Navigation, and AI/ML car features using TensorFlow and Flask services.',
      description_ur: 'ایکسپو کے ساتھ بنایا گیا ایک ری ایکٹ نیٹو کاروں کی سفارش والا موبائل ایپ۔ فائر بیس لاگ ان، ملٹی اسکرین فلو، اور مشین لرننگ فیچرز سے لیس۔',
      description_hi: 'एक्सपो के साथ निर्मित एक रिएक्ट नेटिव कार अनुशंसा मोबाइल ऐप। इसमें फायरबेस प्रमाणीकरण, रिएक्ट नेविगेशन और एआई/एमएल कार विशेषताएं शामिल हैं।',
      github_url: 'https://github.com/Wajahat-Ali-Git/CARSAGE',
      tech_stack: JSON.stringify(['React Native', 'Expo', 'Firebase', 'TensorFlow', 'Flask']),
      featured: true,
      color: 'purple',
      status: 'completed',
      display_order: 1
    },
    {
      title: 'BlogDRFProject',
      slug: 'blogdrf',
      description: 'A robust backend API for a blogging platform built with Django Rest Framework, featuring CRUD operations, authentication, and RESTful endpoints.',
      description_en: 'A robust backend API for a blogging platform built with Django Rest Framework, featuring CRUD operations, authentication, and RESTful endpoints.',
      description_ur: 'ڈینگ ریسٹ فریم ورک کے ساتھ بنایا گیا بلاگنگ پلیٹ فارم کا بیک اینڈ اے پی آئی، جس میں کروڈ آپریشنز اور تصدیق کے فیچرز شامل ہیں۔',
      description_hi: 'जंगो रेस्ट फ्रेमवर्क के साथ बनाया गया ब्लॉगिंग प्लेटफॉर्म के लिए एपीआई, जिसमें क्रूड ऑपरेशन और प्रमाणीकरण शामिल हैं।',
      github_url: 'https://github.com/Wajahat-Ali-Git/BlogDRFProject',
      tech_stack: JSON.stringify(['Django', 'DRF', 'Python', 'PostgreSQL']),
      featured: false,
      color: 'blue',
      status: 'completed',
      display_order: 2
    },
    {
      title: 'OpenSea-Project',
      slug: 'opensea',
      description: 'A web3 NFT marketplace clone exploring blockchain integration, smart contract interaction, and decentralized asset management.',
      description_en: 'A web3 NFT marketplace clone exploring blockchain integration, smart contract interaction, and decentralized asset management.',
      description_ur: 'بلاک چین اور سمارٹ کنٹریکٹ کے ساتھ بنایا گیا ایک ویب 3 این ایف ٹی مارکیٹ پلیس۔',
      description_hi: 'ब्लॉकचेन एकीकरण, स्मार्ट अनुबंधों और विकेंद्रीकृत संपत्ति प्रबंधन के साथ वेब3 एनएफटी मार्केटप्लेस क्लोन।',
      github_url: 'https://github.com/Wajahat-Ali-Git/OpenSea-Project',
      tech_stack: JSON.stringify(['Web3', 'Blockchain', 'Solidity']),
      featured: false,
      color: 'teal',
      status: 'completed',
      display_order: 3
    },
    {
      title: 'chat-app',
      slug: 'chat-app',
      description: 'A real-time chat application with WebSocket communication, instant messaging, and a sleek conversational UI.',
      description_en: 'A real-time chat application with WebSocket communication, instant messaging, and a sleek conversational UI.',
      description_ur: 'ویب ساکٹ کمیونیکیشن اور فوری پیغام رسانی کے ساتھ ایک لائیو چیٹ ایپلی کیشن۔',
      description_hi: 'वेबसॉकेट संचार और त्वरित संदेश सेवा के साथ एक वास्तविक समय चैट एप्लिकेशन।',
      github_url: 'https://github.com/Wajahat-Ali-Git/chat-app',
      tech_stack: JSON.stringify(['React', 'WebSockets', 'Node.js']),
      featured: false,
      color: 'orange',
      status: 'completed',
      display_order: 4
    }
  ],

  // Experiences
  experiences: [
    {
      company_name: 'CMIT Internship Program, Lahore',
      company_slug: 'cmit',
      role: 'Full Stack Development Intern',
      role_en: 'Full Stack Development Intern',
      role_ur: 'فل اسٹیک ڈویلپمنٹ انٹرن',
      role_hi: 'फुल स्टैक डेवलपमेंट इंटर्न',
      location: 'Lahore, Pakistan',
      start_date: '2026-07-01',
      end_date: null,
      is_current: true,
      description: 'Architected a full-stack blog platform (React + Vite + Supabase PostgreSQL) with RBAC, JWT-based sessions, MFA/AAL2 step-up auth, complete CRUD with role-based post scheduling, and PostgreSQL cron jobs (pg_cron) for automated announcements and subscription lifecycle management.',
      description_en: 'Architected a full-stack blog platform (React + Vite + Supabase PostgreSQL) with RBAC, JWT-based sessions, MFA/AAL2 step-up auth, complete CRUD with role-based post scheduling, and PostgreSQL cron jobs (pg_cron) for automated announcements and subscription lifecycle management.',
      description_ur: 'ری ایکٹ، ویٹ اور سوپا بیس پوسٹگری ایس کیو ایل کے ساتھ ایک فل اسٹیک بلاگ پلیٹ فارم بنایا جس میں رول بیسڈ رسائی، جے ڈبلیو ٹی سیشن، ایم ایف اے اور خودکار اعلانات کے لیے پی جی کرون جابز شامل ہیں۔',
      description_hi: 'React, Vite और Supabase PostgreSQL के साथ एक फुल-स्टैक ब्लॉग प्लेटफॉर्म बनाया, जिसमें RBAC, JWT सत्र, MFA और pg_cron से स्वचालित घोषणाएं शामिल हैं।',
      achievements: JSON.stringify([
        'Built complete blog platform with authentication',
        'Implemented role-based access control',
        'Created automated cron jobs for announcements'
      ]),
      tech_stack: JSON.stringify(['React', 'Vite', 'Supabase', 'PostgreSQL', 'JWT']),
      display_order: 1
    },
    {
      company_name: 'DevFlovv, Lahore',
      company_slug: 'devflovv',
      role: 'Associate Software Engineer',
      role_en: 'Associate Software Engineer',
      role_ur: 'ایسوسی ایٹ سافٹ ویئر انجینئر',
      role_hi: 'एसोसिएट सॉफ्टवेयर इंजीनियर',
      location: 'Lahore, Pakistan',
      start_date: '2025-06-01',
      end_date: '2026-06-30',
      is_current: false,
      description: 'Building scalable web applications and contributing to full-stack development projects.',
      description_en: 'Building scalable web applications and contributing to full-stack development projects.',
      description_ur: 'اسکیل ایبل ویب ایپلی کیشنز بنانا اور فل اسٹیک ڈویلپمنٹ پروجیکٹس میں حصہ لینا۔',
      description_hi: 'स्केलेबल वेब एप्लिकेशन बनाना और फुल-स्टैक डेवलपमेंट प्रोजेक्ट्स में योगदान देना।',
      achievements: JSON.stringify([
        'Developed scalable web applications',
        'Collaborated with cross-functional teams'
      ]),
      tech_stack: JSON.stringify(['React', 'Node.js', 'MongoDB']),
      display_order: 2
    }
  ],

  // Skills
  skills: [
    { name: 'JavaScript', category: 'language', proficiency: 90, display_order: 1 },
    { name: 'React', category: 'framework', proficiency: 85, display_order: 2 },
    { name: 'Django / Python', category: 'framework', proficiency: 80, display_order: 3 },
    { name: 'HTML / CSS', category: 'language', proficiency: 92, display_order: 4 },
    { name: 'SQL / PostgreSQL', category: 'database', proficiency: 75, display_order: 5 },
    { name: 'Git / GitHub', category: 'tool', proficiency: 88, display_order: 6 }
  ],

  // Certifications
  certifications: [
    {
      title: 'Introduction to JavaScript',
      title_en: 'Introduction to JavaScript',
      title_ur: 'جاوا اسکرپٹ کا تعارف',
      title_hi: 'जावास्क्रिप्ट का परिचय',
      provider: 'Great Learning',
      certificate_type: 'online',
      display_order: 1
    },
    {
      title: 'Drive Advertising Revenue with Google Ad Manager',
      title_en: 'Drive Advertising Revenue with Google Ad Manager',
      title_ur: 'گوگل ایڈ مینیجر کے ساتھ اشتہارات کی آمدنی بڑھانا',
      title_hi: 'गूगल एड मैनेजर के साथ विज्ञापन राजस्व बढ़ाएं',
      provider: 'Google',
      certificate_type: 'online',
      display_order: 2
    },
    {
      title: 'PITMAN ENGLISH',
      title_en: 'PITMAN ENGLISH',
      title_ur: 'پٹ مین انگلش',
      title_hi: 'पिटमैन इंग्लिश',
      provider: 'Pitman Training',
      certificate_type: 'online',
      display_order: 3
    },
    {
      title: 'Build a Full Website using WordPress',
      title_en: 'Build a Full Website using WordPress',
      title_ur: 'ورڈپریس کا استعمال کرتے ہوئے ایک مکمل ویب سائٹ بنائیں',
      title_hi: 'वर्डप्रेस का उपयोग करके एक पूर्ण वेबसाइट बनाएं',
      provider: 'Coursera',
      certificate_type: 'online',
      display_order: 4
    },
    {
      title: 'Inter Services Public Relations Internship',
      title_en: 'Inter Services Public Relations Internship',
      title_ur: 'انٹر سروسز پبلک ریلیشنز انٹرنشپ',
      title_hi: 'इंटर सर्विसेज पब्लिक रिलेशंस इंटर्नशिप',
      provider: 'ISPR',
      certificate_type: 'internship',
      display_order: 5
    }
  ],

  // Spoken Languages
  spoken_languages: [
    {
      language_code: 'en',
      language_name: 'English',
      name_en: 'English',
      name_ur: 'انگریزی',
      name_hi: 'अंग्रेज़ी',
      proficiency: 'intermediate',
      proficiency_en: 'Intermediate',
      proficiency_ur: 'درمیانی حد تک',
      proficiency_hi: 'मध्यम स्तर',
      flag_emoji: '🇬🇧',
      display_order: 1
    },
    {
      language_code: 'ur',
      language_name: 'Urdu',
      name_en: 'Urdu',
      name_ur: 'اردو',
      name_hi: 'उर्दू',
      proficiency: 'native',
      proficiency_en: 'Native',
      proficiency_ur: 'مادری زبان',
      proficiency_hi: 'मातृभाषा',
      flag_emoji: '🇵🇰',
      display_order: 2
    },
    {
      language_code: 'hi',
      language_name: 'Hindi / Punjabi',
      name_en: 'Hindi / Punjabi',
      name_ur: 'ہندی / پنجابی',
      name_hi: 'हिंदी / पंजाबी',
      proficiency: 'understand',
      proficiency_en: 'Can understand spoken',
      proficiency_ur: 'بول چال سمجھ سکتے ہیں',
      proficiency_hi: 'बोली जाने वाली भाषा समझ सकते हैं',
      flag_emoji: '🇮🇳',
      display_order: 3
    }
  ],

  // Tools
  tools: [
    { name: 'VS Code', category: 'editor', display_order: 1 },
    { name: 'DBeaver', category: 'database', display_order: 2 },
    { name: 'Postman', category: 'api', display_order: 3 },
    { name: 'Zapier', category: 'automation', display_order: 4 },
    { name: 'Docker', category: 'other', display_order: 5 },
    { name: 'Bruno', category: 'api', display_order: 6 },
    { name: 'Antigravity', category: 'other', display_order: 7 },
    { name: 'ChatGPT', category: 'other', display_order: 8 }
  ]
};

// =============================================================================
// Seed Functions
// =============================================================================

async function seedPersonalInfo() {
  console.log('👤 Seeding personal_info...');
  
  const { personal_info } = seedData;
  const columns = Object.keys(personal_info).join(', ');
  const values = Object.values(personal_info);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
  
  await pool.query(
    `INSERT INTO personal_info (${columns}) VALUES (${placeholders})
     ON CONFLICT DO NOTHING`,
    values
  );
  
  console.log('   ✓ Personal info seeded\n');
}

async function seedProjects() {
  console.log('📁 Seeding projects...');
  
  for (const project of seedData.projects) {
    const columns = Object.keys(project).join(', ');
    const values = Object.values(project);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    await pool.query(
      `INSERT INTO projects (${columns}) VALUES (${placeholders})
       ON CONFLICT (slug) DO NOTHING`,
      values
    );
  }
  
  console.log(`   ✓ ${seedData.projects.length} projects seeded\n`);
}

async function seedExperiences() {
  console.log('💼 Seeding experiences...');
  
  for (const exp of seedData.experiences) {
    const columns = Object.keys(exp).join(', ');
    const values = Object.values(exp);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    await pool.query(
      `INSERT INTO experiences (${columns}) VALUES (${placeholders})
       ON CONFLICT (company_slug) DO NOTHING`,
      values
    );
  }
  
  console.log(`   ✓ ${seedData.experiences.length} experiences seeded\n`);
}

async function seedSkills() {
  console.log('⚡ Seeding skills...');
  
  for (const skill of seedData.skills) {
    const columns = Object.keys(skill).join(', ');
    const values = Object.values(skill);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    await pool.query(
      `INSERT INTO skills (${columns}) VALUES (${placeholders})
       ON CONFLICT (name) DO NOTHING`,
      values
    );
  }
  
  console.log(`   ✓ ${seedData.skills.length} skills seeded\n`);
}

async function seedCertifications() {
  console.log('🎓 Seeding certifications...');
  
  for (const cert of seedData.certifications) {
    const columns = Object.keys(cert).join(', ');
    const values = Object.values(cert);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    await pool.query(
      `INSERT INTO certifications (${columns}) VALUES (${placeholders})`,
      values
    );
  }
  
  console.log(`   ✓ ${seedData.certifications.length} certifications seeded\n`);
}

async function seedLanguages() {
  console.log('🌍 Seeding spoken_languages...');
  
  for (const lang of seedData.spoken_languages) {
    const columns = Object.keys(lang).join(', ');
    const values = Object.values(lang);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    await pool.query(
      `INSERT INTO spoken_languages (${columns}) VALUES (${placeholders})
       ON CONFLICT (language_code) DO NOTHING`,
      values
    );
  }
  
  console.log(`   ✓ ${seedData.spoken_languages.length} languages seeded\n`);
}

async function seedTools() {
  console.log('🛠️  Seeding tools...');
  
  for (const tool of seedData.tools) {
    const columns = Object.keys(tool).join(', ');
    const values = Object.values(tool);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    await pool.query(
      `INSERT INTO tools (${columns}) VALUES (${placeholders})
       ON CONFLICT (name) DO NOTHING`,
      values
    );
  }
  
  console.log(`   ✓ ${seedData.tools.length} tools seeded\n`);
}

// =============================================================================
// Main Execution
// =============================================================================

(async () => {
  try {
    console.log('🔌 Connecting to database...\n');
    await pool.query('SELECT NOW()');
    console.log('✅ Connected!\n');
    
    await seedPersonalInfo();
    await seedProjects();
    await seedExperiences();
    await seedSkills();
    await seedCertifications();
    await seedLanguages();
    await seedTools();
    
    console.log('=====================================');
    console.log('🎉 Seeding complete!\n');
    console.log('📊 Summary:');
    console.log(`   • 1 personal info record`);
    console.log(`   • ${seedData.projects.length} projects`);
    console.log(`   • ${seedData.experiences.length} experiences`);
    console.log(`   • ${seedData.skills.length} skills`);
    console.log(`   • ${seedData.certifications.length} certifications`);
    console.log(`   • ${seedData.spoken_languages.length} spoken languages`);
    console.log(`   • ${seedData.tools.length} tools`);
    console.log('=====================================\n');
    
    await pool.end();
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error);
    await pool.end();
    process.exit(1);
  }
})();
