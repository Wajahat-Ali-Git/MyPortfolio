-- =============================================================================
-- SEED DATA FOR SUPABASE
-- =============================================================================
-- Run this in Supabase SQL Editor to populate with initial data
-- =============================================================================

-- Personal Info
INSERT INTO personal_info (
  full_name, role, role_en, role_ur, role_hi,
  bio, bio_en, bio_ur, bio_hi,
  availability_status, status_en, status_ur, status_hi,
  email, github_url, linkedin_url, is_active
) VALUES (
  'Wajahat Ali',
  'Software Engineer & Developer',
  'Software Engineer & Developer',
  'سافٹ ویئر انجینئر اور ڈویلپر',
  'सॉफ्टवेयर इंजीनियर और डेवलपर',
  'I specialize in building scalable web and mobile applications. Always eager to learn new technologies and solve complex problems with elegant solutions.',
  'I specialize in building scalable web and mobile applications. Always eager to learn new technologies and solve complex problems with elegant solutions.',
  'میں اسکیل ایبل ویب اور موبائل ایپلی کیشنز بنانے میں مہارت رکھتا ہوں۔ ہمیشہ نئی ٹیکنالوجیز سیکھنے اور خوبصورت حل کے ساتھ پیچیدہ مسائل حل کرنے کا خواہشمند رہتا ہوں۔',
  'मैं स्केलेबल वेब और मोबाइल एप्लिकेशन बनाने में विशेषज्ञता रखता हूँ। हमेशा नई तकनीकों को सीखने और जटिल समस्याओं को सुरुचिपूर्ण समाधानों के साथ हल करने के लिए उत्सुक रहता हूँ।',
  'Available for opportunities',
  'Available for opportunities',
  'مواقع کے لیے دستیاب ہے',
  'काम के लिए उपलब्ध',
  'wajahat@example.com',
  'https://github.com/Wajahat-Ali-Git',
  'https://www.linkedin.com/in/wajahat-ali-b098b4243',
  true
) ON CONFLICT DO NOTHING;

-- Projects
INSERT INTO projects (title, slug, description, description_en, description_ur, description_hi, github_url, tech_stack, featured, color, status, display_order) VALUES
('CARSAGE', 'carsage', 
 'A React Native car recommendation mobile app built with Expo. Features Firebase auth, React Navigation, and AI/ML car features using TensorFlow and Flask services.',
 'A React Native car recommendation mobile app built with Expo. Features Firebase auth, React Navigation, and AI/ML car features using TensorFlow and Flask services.',
 'ایکسپو کے ساتھ بنایا گیا ایک ری ایکٹ نیٹو کاروں کی سفارش والا موبائل ایپ۔ فائر بیس لاگ ان، ملٹی اسکرین فلو، اور مشین لرننگ فیچرز سے لیس۔',
 'एक्सपो के साथ निर्मित एक रिएक्ट नेटिव कार अनुशंसा मोबाइल ऐप। इसमें फायरबेस प्रमाणीकरण, रिएक्ट नेविगेशन और एआई/एमएल कार विशेषताएं शामिल हैं।',
 'https://github.com/Wajahat-Ali-Git/CARSAGE',
 '["React Native", "Expo", "Firebase", "TensorFlow", "Flask"]'::jsonb,
 true, 'purple', 'completed', 1),

('BlogDRFProject', 'blogdrf',
 'A robust backend API for a blogging platform built with Django Rest Framework, featuring CRUD operations, authentication, and RESTful endpoints.',
 'A robust backend API for a blogging platform built with Django Rest Framework, featuring CRUD operations, authentication, and RESTful endpoints.',
 'ڈینگ ریسٹ فریم ورک کے ساتھ بنایا گیا بلاگنگ پلیٹ فارم کا بیک اینڈ اے پی آئی، جس میں کروڈ آپریشنز اور تصدیق کے فیچرز شامل ہیں۔',
 'जंगो रेस्ट फ्रेमवर्क के साथ बनाया गया ब्लॉगिंग प्लेटफॉर्म के लिए एपीआई, जिसमें क्रूड ऑपरेशन और प्रमाणीकरण शामिल हैं।',
 'https://github.com/Wajahat-Ali-Git/BlogDRFProject',
 '["Django", "DRF", "Python", "PostgreSQL"]'::jsonb,
 false, 'blue', 'completed', 2),

('OpenSea-Project', 'opensea',
 'A web3 NFT marketplace clone exploring blockchain integration, smart contract interaction, and decentralized asset management.',
 'A web3 NFT marketplace clone exploring blockchain integration, smart contract interaction, and decentralized asset management.',
 'بلاک چین اور سمارٹ کنٹریکٹ کے ساتھ بنایا گیا ایک ویب 3 این ایف ٹی مارکیٹ پلیس۔',
 'ब्लॉकचेन एकीकरण, स्मार्ट अनुबंधों और विकेंद्रीकृत संपत्ति प्रबंधन के साथ वेब3 एनएफटी मार्केटप्लेस क्लोन।',
 'https://github.com/Wajahat-Ali-Git/OpenSea-Project',
 '["Web3", "Blockchain", "Solidity"]'::jsonb,
 false, 'teal', 'completed', 3),

('chat-app', 'chat-app',
 'A real-time chat application with WebSocket communication, instant messaging, and a sleek conversational UI.',
 'A real-time chat application with WebSocket communication, instant messaging, and a sleek conversational UI.',
 'ویب ساکٹ کمیونیکیشن اور فوری پیغام رسانی کے ساتھ ایک لائیو چیٹ ایپلی کیشن۔',
 'वेबसॉकेट संचार और त्वरित संदेश सेवा के साथ एक वास्तविक समय चैट एप्लिकेशन।',
 'https://github.com/Wajahat-Ali-Git/chat-app',
 '["React", "WebSockets", "Node.js"]'::jsonb,
 false, 'orange', 'completed', 4)
ON CONFLICT (slug) DO NOTHING;

-- Experiences
INSERT INTO experiences (company_name, company_slug, role, role_en, role_ur, role_hi, location, start_date, is_current, description, description_en, description_ur, description_hi, achievements, tech_stack, display_order) VALUES
('CMIT Internship Program, Lahore', 'cmit',
 'Full Stack Development Intern',
 'Full Stack Development Intern',
 'فل اسٹیک ڈویلپمنٹ انٹرن',
 'फुल स्टैक डेवलपमेंट इंटर्न',
 'Lahore, Pakistan',
 '2026-07-01',
 true,
 'Architected a full-stack blog platform (React + Vite + Supabase PostgreSQL) with RBAC, JWT-based sessions, MFA/AAL2 step-up auth, complete CRUD with role-based post scheduling, and PostgreSQL cron jobs (pg_cron) for automated announcements and subscription lifecycle management.',
 'Architected a full-stack blog platform (React + Vite + Supabase PostgreSQL) with RBAC, JWT-based sessions, MFA/AAL2 step-up auth, complete CRUD with role-based post scheduling, and PostgreSQL cron jobs (pg_cron) for automated announcements and subscription lifecycle management.',
 'ری ایکٹ، ویٹ اور سوپا بیس پوسٹگری ایس کیو ایل کے ساتھ ایک فل اسٹیک بلاگ پلیٹ فارم بنایا جس میں رول بیسڈ رسائی، جے ڈبلیو ٹی سیشن، ایم ایف اے اور خودکار اعلانات کے لیے پی جی کرون جابز شامل ہیں۔',
 'React, Vite और Supabase PostgreSQL के साथ एक फुल-स्टैक ब्लॉग प्लेटफॉर्म बनाया, जिसमें RBAC, JWT सत्र, MFA और pg_cron से स्वचालित घोषणाएं शामिल हैं।',
 '["Built complete blog platform with authentication", "Implemented role-based access control", "Created automated cron jobs for announcements"]'::jsonb,
 '["React", "Vite", "Supabase", "PostgreSQL", "JWT"]'::jsonb,
 1),

('DevFlovv, Lahore', 'devflovv',
 'Associate Software Engineer',
 'Associate Software Engineer',
 'ایسوسی ایٹ سافٹ ویئر انجینئر',
 'एसोसिएट सॉफ्टवेयर इंजीनियर',
 'Lahore, Pakistan',
 '2025-06-01',
 false,
 'Building scalable web applications and contributing to full-stack development projects.',
 'Building scalable web applications and contributing to full-stack development projects.',
 'اسکیل ایبل ویب ایپلی کیشنز بنانا اور فل اسٹیک ڈویلپمنٹ پروجیکٹس میں حصہ لینا۔',
 'स्केलेबल वेब एप्लिकेशन बनाना और फुल-स्टैक डेवलपमेंट प्रोजेक्ट्स में योगदान देना।',
 '["Developed scalable web applications", "Collaborated with cross-functional teams"]'::jsonb,
 '["React", "Node.js", "MongoDB"]'::jsonb,
 2)
ON CONFLICT (company_slug) DO NOTHING;

-- Update end date for DevFlovv
UPDATE experiences SET end_date = '2026-06-30' WHERE company_slug = 'devflovv';

-- Skills
INSERT INTO skills (name, category, proficiency, display_order) VALUES
('JavaScript', 'language', 90, 1),
('React', 'framework', 85, 2),
('Django / Python', 'framework', 80, 3),
('HTML / CSS', 'language', 92, 4),
('SQL / PostgreSQL', 'database', 75, 5),
('Git / GitHub', 'tool', 88, 6)
ON CONFLICT (name) DO NOTHING;

-- Certifications
INSERT INTO certifications (title, title_en, title_ur, title_hi, provider, certificate_type, display_order) VALUES
('Introduction to JavaScript', 'Introduction to JavaScript', 'جاوا اسکرپٹ کا تعارف', 'जावास्क्रिप्ट का परिचय', 'Great Learning', 'online', 1),
('Drive Advertising Revenue with Google Ad Manager', 'Drive Advertising Revenue with Google Ad Manager', 'گوگل ایڈ مینیجر کے ساتھ اشتہارات کی آمدنی بڑھانا', 'गूगल एड मैनेजर के साथ विज्ञापन राजस्व बढ़ाएं', 'Google', 'online', 2),
('PITMAN ENGLISH', 'PITMAN ENGLISH', 'پٹ مین انگلش', 'पिटमैन इंग्लिश', 'Pitman Training', 'online', 3),
('Build a Full Website using WordPress', 'Build a Full Website using WordPress', 'ورڈپریس کا استعمال کرتے ہوئے ایک مکمل ویب سائٹ بنائیں', 'वर्डप्रेस का उपयोग करके एक पूर्ण वेबसाइट बनाएं', 'Coursera', 'online', 4),
('Inter Services Public Relations Internship', 'Inter Services Public Relations Internship', 'انٹر سروسز پبلک ریلیشنز انٹرنشپ', 'इंटर सर्विसेज पब्लिक रिलेशंस इंटर्नशिप', 'ISPR', 'internship', 5)
ON CONFLICT DO NOTHING;

-- Spoken Languages
INSERT INTO spoken_languages (language_code, language_name, name_en, name_ur, name_hi, proficiency, proficiency_en, proficiency_ur, proficiency_hi, flag_emoji, display_order) VALUES
('en', 'English', 'English', 'انگریزی', 'अंग्रेज़ी', 'intermediate', 'Intermediate', 'درمیانی حد تک', 'मध्यम स्तर', '🇬🇧', 1),
('ur', 'Urdu', 'Urdu', 'اردو', 'उर्दू', 'native', 'Native', 'مادری زبان', 'मातृभाषा', '🇵🇰', 2),
('hi', 'Hindi / Punjabi', 'Hindi / Punjabi', 'ہندی / پنجابی', 'हिंदी / पंजाबी', 'understand', 'Can understand spoken', 'بول چال سمجھ سکتے ہیں', 'बोली जाने वाली भाषा समझ सकते हैं', '🇮🇳', 3)
ON CONFLICT (language_code) DO NOTHING;

-- Tools
INSERT INTO tools (name, category, display_order) VALUES
('VS Code', 'editor', 1),
('DBeaver', 'database', 2),
('Postman', 'api', 3),
('Zapier', 'automation', 4),
('Docker', 'other', 5),
('Bruno', 'api', 6),
('Antigravity', 'other', 7),
('ChatGPT', 'other', 8)
ON CONFLICT (name) DO NOTHING;

-- Verification Query
SELECT 
  'personal_info' as table_name, COUNT(*) as records FROM personal_info
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
UNION ALL
SELECT 'experiences', COUNT(*) FROM experiences
UNION ALL
SELECT 'skills', COUNT(*) FROM skills
UNION ALL
SELECT 'certifications', COUNT(*) FROM certifications
UNION ALL
SELECT 'spoken_languages', COUNT(*) FROM spoken_languages
UNION ALL
SELECT 'tools', COUNT(*) FROM tools;
