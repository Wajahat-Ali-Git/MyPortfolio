"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Mail, ExternalLink, Code2, Briefcase, Award, Code, Globe2, Wrench, ChevronDown, ArrowUpRight, Terminal } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

/* ─── Data ─── */

type Language = "en" | "ur" | "hi" | "ar" | "fr" | "de";

const PROJECTS = [
  {
    title: "CARSAGE",
    descKey: "carsage_desc" as const,
    tech: ["React Native", "Expo", "Firebase", "TensorFlow", "Flask"],
    link: "https://github.com/Wajahat-Ali-Git/CARSAGE",
    featured: true,
    color: "purple",
  },
  {
    title: "BlogDRFProject",
    descKey: "blogdrf_desc" as const,
    tech: ["Django", "DRF", "Python", "PostgreSQL"],
    link: "https://github.com/Wajahat-Ali-Git/BlogDRFProject",
    color: "blue",
  },
  {
    title: "OpenSea-Project",
    descKey: "opensea_desc" as const,
    tech: ["Web3", "Blockchain", "Solidity"],
    link: "https://github.com/Wajahat-Ali-Git/OpenSea-Project",
    color: "teal",
  },
  {
    title: "chat-app",
    descKey: "chatapp_desc" as const,
    tech: ["React", "WebSockets", "Node.js"],
    link: "https://github.com/Wajahat-Ali-Git/chat-app",
    color: "orange",
  },
];

const WORK_HISTORY = [
  {
    companyKey: "devflovv_company" as const,
    roleKey: "devflovv_role" as const,
    durationKey: "devflovv_duration" as const,
    descKey: "devflovv_desc" as const,
  },
];

const CERTIFICATIONS = [
  { titleKey: "cert1" as const, provider: "Great Learning", typeKey: "online" as const },
  { titleKey: "cert2" as const, provider: "Google", typeKey: "online" as const },
  { titleKey: "cert3" as const, provider: "Pitman Training", typeKey: "online" as const },
  { titleKey: "cert4" as const, provider: "Coursera", typeKey: "online" as const },
  { titleKey: "cert5" as const, provider: "ISPR", typeKey: "internship" as const },
];

const SKILLS = [
  { name: "JavaScript", level: 90 },
  { name: "React", level: 85 },
  { name: "Django / Python", level: 80 },
  { name: "HTML / CSS", level: 92 },
  { name: "SQL / PostgreSQL", level: 75 },
  { name: "Git / GitHub", level: 88 },
];

const TOOLS = ["VS Code", "DBeaver", "Postman", "Zapier", "Docker", "Bruno", "Antigravity", "ChatGPT"];

const LANGUAGES = [
  { nameKey: "english" as const, proficiencyKey: "intermediate" as const, flag: "🇬🇧" },
  { nameKey: "urdu" as const, proficiencyKey: "intermediate" as const, flag: "🇵🇰" },
  { nameKey: "hindi_punjabi" as const, proficiencyKey: "understand" as const, flag: "🇮🇳" },
];

const NAV_LINKS = [
  { labelKey: "home" as const, href: "#home" },
  { labelKey: "projects" as const, href: "#projects" },
  { labelKey: "experience" as const, href: "#experience" },
  { labelKey: "skills" as const, href: "#skills" },
  { labelKey: "certifications" as const, href: "#certifications" },
];

const LANG_OPTIONS = [
  { code: "en" as const, label: "English", flag: "🇬🇧" },
  { code: "ur" as const, label: "اردو", flag: "🇵🇰" },
  { code: "hi" as const, label: "हिंदी", flag: "🇮🇳" },
  { code: "ar" as const, label: "العربية", flag: "🇸🇦" },
  { code: "fr" as const, label: "Français", flag: "🇫🇷" },
  { code: "de" as const, label: "Deutsch", flag: "🇩🇪" },
];

const TRANSLATIONS = {
  en: {
    dir: "ltr",
    nav: {
      home: "Home",
      projects: "Projects",
      experience: "Experience",
      skills: "Skills",
      certifications: "Certifications",
    },
    hero: {
      status: "Available for opportunities",
      title1: "Wajahat",
      title2: "Ali",
      role: "Software Engineer & Developer",
      bio: "I specialize in building scalable web and mobile applications. Always eager to learn new technologies and solve complex problems with elegant solutions.",
      cta: "View My Work",
    },
    projects: {
      title: "Featured Projects",
      fyp: "FYP",
      carsage_desc: "A React Native car recommendation mobile app built with Expo. Features Firebase auth, React Navigation, and AI/ML car features using TensorFlow and Flask services.",
      blogdrf_desc: "A robust backend API for a blogging platform built with Django Rest Framework, featuring CRUD operations, authentication, and RESTful endpoints.",
      opensea_desc: "A web3 NFT marketplace clone exploring blockchain integration, smart contract interaction, and decentralized asset management.",
      chatapp_desc: "A real-time chat application with WebSocket communication, instant messaging, and a sleek conversational UI.",
    },
    experience: {
      title: "Experience",
      devflovv_role: "Associate Software Engineer",
      devflovv_company: "DevFlovv, Lahore",
      devflovv_duration: "June 2025 – June 2026",
      devflovv_desc: "Building scalable web applications and contributing to full-stack development projects.",
    },
    skills: {
      title: "Skills",
      tools: "Tools",
    },
    certifications: {
      title: "Certifications",
      by: "by",
      online: "Online",
      internship: "Internship",
      cert1: "Introduction to JavaScript",
      cert2: "Drive Advertising Revenue with Google Ad Manager",
      cert3: "PITMAN ENGLISH",
      cert4: "Build a Full Website using WordPress",
      cert5: "Inter Services Public Relations Internship",
    },
    languages: {
      title: "Languages",
      english: "English",
      urdu: "Urdu",
      hindi_punjabi: "Hindi / Punjabi",
      intermediate: "Intermediate",
      understand: "Can understand spoken",
    },
    ui: {
      scroll: "Scroll",
      languageSelect: "Select website language",
      themeToggle: "Toggle dark mode",
    },
    footer: {
      crafted: "Crafted with precision.",
    },
  },
  ur: {
    dir: "rtl",
    nav: {
      home: "ہوم",
      projects: "پروجیکٹس",
      experience: "تجربہ",
      skills: "مہارتیں",
      certifications: "سرٹیفیکیشنز",
    },
    hero: {
      status: "مواقع کے لیے دستیاب ہے",
      title1: "وجاہت",
      title2: "علی",
      role: "سافٹ ویئر انجینئر اور ڈویلپر",
      bio: "میں اسکیل ایبل ویب اور موبائل ایپلی کیشنز بنانے میں مہارت رکھتا ہوں۔ ہمیشہ نئی ٹیکنالوجیز سیکھنے اور خوبصورت حل کے ساتھ پیچیدہ مسائل حل کرنے کا خواہشمند رہتا ہوں۔",
      cta: "میرا کام دیکھیں",
    },
    projects: {
      title: "نمایاں پروجیکٹس",
      fyp: "ایف وائی پی",
      carsage_desc: "ایکسپو کے ساتھ بنایا گیا ایک ری ایکٹ نیٹو کاروں کی سفارش والا موبائل ایپ۔ فائر بیس لاگ ان، ملٹی اسکرین فلو، اور مشین لرننگ فیچرز سے لیس۔",
      blogdrf_desc: "ڈینگ ریسٹ فریم ورک کے ساتھ بنایا گیا بلاگنگ پلیٹ فارم کا بیک اینڈ اے پی آئی، جس میں کروڈ آپریشنز اور تصدیق کے فیچرز شامل ہیں۔",
      opensea_desc: "بلاک چین اور سمارٹ کنٹریکٹ کے ساتھ بنایا گیا ایک ویب 3 این ایف ٹی مارکیٹ پلیس۔",
      chatapp_desc: "ویب ساکٹ کمیونیکیشن اور فوری پیغام رسانی کے ساتھ ایک لائیو چیٹ ایپلی کیشن۔",
    },
    experience: {
      title: "تجربہ",
      devflovv_role: "ایسوسی ایٹ سافٹ ویئر انجینئر",
      devflovv_company: "ڈیو فلوو، لاہور",
      devflovv_duration: "جون 2025 – جون 2026",
      devflovv_desc: "اسکیل ایبل ویب ایپلی کیشنز بنانا اور فل اسٹیک ڈویلپمنٹ پروجیکٹس میں حصہ لینا۔",
    },
    skills: {
      title: "مہارتیں",
      tools: "ٹولز",
    },
    certifications: {
      title: "سرٹیفیکیشنز",
      by: "منجانب",
      online: "آن لائن",
      internship: "انٹرنشپ",
      cert1: "جاوا اسکرپٹ کا تعارف",
      cert2: "گوگل ایڈ مینیجر کے ساتھ اشتہارات کی آمدنی بڑھانا",
      cert3: "پٹ مین انگلش",
      cert4: "ورڈپریس کا استعمال کرتے ہوئے ایک مکمل ویب سائٹ بنائیں",
      cert5: "انٹر سروسز پبلک ریلیشنز انٹرنشپ",
    },
    languages: {
      title: "زبانیں",
      english: "انگریزی",
      urdu: "اردو",
      hindi_punjabi: "ہندی / پنجابی",
      intermediate: "درمیانی حد تک",
      understand: "بول چال سمجھ سکتے ہیں",
    },
    ui: {
      scroll: "اسکرول",
      languageSelect: "زبان منتخب کریں",
      themeToggle: "ڈارک موڈ تبدیل کریں",
    },
    footer: {
      crafted: "انتہائی مہارت کے ساتھ تیار کیا گیا۔",
    },
  },
  hi: {
    dir: "ltr",
    nav: {
      home: "होम",
      projects: "परियोजनाएं",
      experience: "अनुभव",
      skills: "कौशल",
      certifications: "प्रमाणपत्र",
    },
    hero: {
      status: "काम के लिए उपलब्ध",
      title1: "वजाहत",
      title2: "अली",
      role: "सॉफ्टवेयर इंजीनियर और डेवलपर",
      bio: "मैं स्केलेबल वेब और मोबाइल एप्लिकेशन बनाने में विशेषज्ञता रखता हूँ। हमेशा नई तकनीकों को सीखने और जटिल समस्याओं को सुरुचिपूर्ण समाधानों के साथ हल करने के लिए उत्सुक रहता हूँ।",
      cta: "मेरा काम देखें",
    },
    projects: {
      title: "प्रमुख परियोजनाएं",
      fyp: "एफवाईपी",
      carsage_desc: "एक्सपो के साथ निर्मित एक रिएक्ट नेटिव कार अनुशंसा मोबाइल ऐप। इसमें फायरबेस प्रमाणीकरण, रिएक्ट नेविगेशन और एआई/एमएल कार विशेषताएं शामिल हैं।",
      blogdrf_desc: "जंगो रेस्ट फ्रेमवर्क के साथ बनाया गया ब्लॉगिंग प्लेटफॉर्म के लिए एपीआई, जिसमें क्रूड ऑपरेशन और प्रमाणीकरण शामिल हैं।",
      opensea_desc: "ब्लॉकचेन एकीकरण, स्मार्ट अनुबंधों और विकेंद्रीकृत संपत्ति प्रबंधन के साथ वेब3 एनएफटी मार्केटप्लेस क्लोन।",
      chatapp_desc: "वेबसॉकेट संचार और त्वरित संदेश सेवा के साथ एक वास्तविक समय चैट एप्लिकेशन।",
    },
    experience: {
      title: "अनुभव",
      devflovv_role: "एसोसिएट सॉफ्टवेयर इंजीनियर",
      devflovv_company: "देवफ्लोव (DevFlovv), लाहौर",
      devflovv_duration: "जून 2025 - जून 2026",
      devflovv_desc: "स्केलेबल वेब एप्लिकेशन बनाना और फुल-स्टैक डेवलपमेंट प्रोजेक्ट्स में योगदान देना।",
    },
    skills: {
      title: "कौशल",
      tools: "टूल्स",
    },
    certifications: {
      title: "प्रमाणपत्र",
      by: "द्वारा",
      online: "ऑनलाइन",
      internship: "इंटर्नशिप",
      cert1: "जावास्क्रिप्ट का परिचय",
      cert2: "गूगल एड मैनेजर के साथ विज्ञापन राजस्व बढ़ाएं",
      cert3: "पिटमैन इंग्लिश",
      cert4: "वर्डप्रेस का उपयोग करके एक पूर्ण वेबसाइट बनाएं",
      cert5: "इंटर सर्विसेज पब्लिक रिलेशंस इंटर्नशिप",
    },
    languages: {
      title: "भाषाएँ",
      english: "अंग्रेज़ी",
      urdu: "उर्दू",
      hindi_punjabi: "हिंदी / पंजाबी",
      intermediate: "मध्यम स्तर",
      understand: "बोली जाने वाली भाषा समझ सकते हैं",
    },
    ui: {
      scroll: "स्क्रॉल",
      languageSelect: "वेबसाइट भाषा चुनें",
      themeToggle: "डार्क मोड टॉगल करें",
    },
    footer: {
      crafted: "परिशुद्धता के साथ बनाया गया।",
    },
  },
  ar: {
    dir: "rtl",
    nav: {
      home: "الرئيسية",
      projects: "المشاريع",
      experience: "الخبرة",
      skills: "المهارات",
      certifications: "الشهادات",
    },
    hero: {
      status: "متاح لفرص العمل",
      title1: "وجاهت",
      title2: "علي",
      role: "مهندس برمجيات ومطور",
      bio: "أنا متخصص في بناء تطبيقات الويب والهاتف المحمول القابلة للتوسع. أتطلع دائماً لتعلم تقنيات جديدة وحل المشكلات المعقدة بحلول أنيقة.",
      cta: "عرض أعمالي",
    },
    projects: {
      title: "المشاريع المميزة",
      fyp: "مشروع التخرج",
      carsage_desc: "تطبيق هاتف محمول لتوصية السيارات مبني بـ React Native و Expo. يتميز بالمصادقة عبر Firebase وميزات الذكاء الاصطناعي.",
      blogdrf_desc: "واجهة برمجة تطبيقات قوية لمنصة تدوين مبنية بـ Django Rest Framework، تتميز بعمليات CRUD والمصادقة.",
      opensea_desc: "نسخة مطابقة لسوق NFT على الويب 3 تستكشف تكامل البلوكشين والعقود الذكية.",
      chatapp_desc: "تطبيق محادثة في الوقت الفعلي مع اتصال WebSocket ورسائل فورية وواجهة مستخدم أنيقة.",
    },
    experience: {
      title: "الخبرة",
      devflovv_role: "مهندس برمجيات مشارك",
      devflovv_company: "DevFlovv، لاهور",
      devflovv_duration: "يونيو 2025 - يونيو 2026",
      devflovv_desc: "بناء تطبيقات الويب القابلة للتوسع والمساهمة في مشاريع التطوير الكاملة (Full-Stack).",
    },
    skills: {
      title: "المهارات",
      tools: "الأدوات",
    },
    certifications: {
      title: "الشهادات",
      by: "من قبل",
      online: "عبر الإنترنت",
      internship: "تدريب عملي",
      cert1: "مقدمة في جافا سكريبت",
      cert2: "زيادة عائدات الإعلانات باستخدام مدير إعلانات Google",
      cert3: "اللغة الإنجليزية من بيتمان",
      cert4: "بناء موقع كامل باستخدام ووردبريس",
      cert5: "تدريب عملي في العلاقات العامة بين الأجهزة الأمنية",
    },
    languages: {
      title: "اللغات",
      english: "الإنجليزية",
      urdu: "الأردية",
      hindi_punjabi: "الهندية / البنجابية",
      intermediate: "متوسط",
      understand: "يمكن فهمها منطوقة",
    },
    ui: {
      scroll: "مرر",
      languageSelect: "اختر لغة الموقع",
      themeToggle: "تبديل الوضع الداكن",
    },
    footer: {
      crafted: "تم صياغته بدقة.",
    },
  },
  fr: {
    dir: "ltr",
    nav: {
      home: "Accueil",
      projects: "Projets",
      experience: "Expérience",
      skills: "Compétences",
      certifications: "Certifications",
    },
    hero: {
      status: "Disponible pour des opportunités",
      title1: "Wajahat",
      title2: "Ali",
      role: "Ingénieur Logiciel & Développeur",
      bio: "Je me spécialise dans la création d'applications web et mobiles évolutives. Toujours désireux d'apprendre de nouvelles technologies et de résoudre des problèmes complexes avec des solutions élégantes.",
      cta: "Voir mes projets",
    },
    projects: {
      title: "Projets à la Une",
      fyp: "PFE",
      carsage_desc: "Une application mobile de recommandation de voitures en React Native construite avec Expo. Comprend l'authentification Firebase, la navigation et des fonctionnalités d'IA/ML.",
      blogdrf_desc: "Une API robuste pour une plateforme de blogs construite avec Django Rest Framework, comprenant les opérations CRUD et l'authentification.",
      opensea_desc: "Un clone de place de marché NFT web3 explorant l'intégration de la blockchain, l'interaction avec les contrats intelligents et la gestion d'actifs décentralisée.",
      chatapp_desc: "Une application de chat en temps réel avec communication WebSocket, messagerie instantanée et une interface utilisateur fluide.",
    },
    experience: {
      title: "Expérience",
      devflovv_role: "Ingénieur Logiciel Associé",
      devflovv_company: "DevFlovv, Lahore",
      devflovv_duration: "Juin 2025 – Juin 2026",
      devflovv_desc: "Création d'applications web évolutives et contribution à des projets de développement full-stack.",
    },
    skills: {
      title: "Compétences",
      tools: "Outils",
    },
    certifications: {
      title: "Certifications",
      by: "par",
      online: "En ligne",
      internship: "Stage",
      cert1: "Introduction au JavaScript",
      cert2: "Maximiser les revenus publicitaires avec Google Ad Manager",
      cert3: "Anglais PITMAN",
      cert4: "Créer un site Web complet avec WordPress",
      cert5: "Stage auprès des relations publiques interarmées (ISPR)",
    },
    languages: {
      title: "Langues",
      english: "Anglais",
      urdu: "Urdu",
      hindi_punjabi: "Hindi / Pendjabi",
      intermediate: "Intermédiaire",
      understand: "Peut comprendre le parlé",
    },
    ui: {
      scroll: "Faites défiler",
      languageSelect: "Sélectionner la langue du site",
      themeToggle: "Basculer le mode sombre",
    },
    footer: {
      crafted: "Conçu avec précision.",
    },
  },
  de: {
    dir: "ltr",
    nav: {
      home: "Startseite",
      projects: "Projekte",
      experience: "Erfahrung",
      skills: "Fähigkeiten",
      certifications: "Zertifikate",
    },
    hero: {
      status: "Verfügbar für neue Aufgaben",
      title1: "Wajahat",
      title2: "Ali",
      role: "Softwareentwickler",
      bio: "Ich spezialisiere mich auf den Aufbau skalierbarer Web- und Mobilanwendungen. Ich bin immer bestrebt, neue Technologien zu erlernen und komplexe Probleme mit eleganten Lösungen zu lösen.",
      cta: "Meine Arbeiten ansehen",
    },
    projects: {
      title: "Ausgewählte Projekte",
      fyp: "Abschlussprojekt",
      carsage_desc: "Eine auf React Native basierende Auto-Empfehlungs-App, entwickelt mit Expo. Bietet Firebase-Authentifizierung, React Navigation und KI/ML-gestützte Funktionen.",
      blogdrf_desc: "Eine robuste Backend-API für eine Blogging-Plattform, entwickelt mit Django Rest Framework, mit CRUD-Operationen und Authentifizierung.",
      opensea_desc: "Ein Web3-NFT-Marktplatz-Klon zur Erkundung von Blockchain-Integration, Smart Contracts und dezentraler Vermögensverwaltung.",
      chatapp_desc: "Eine Echtzeit-Chat-Anwendung mit WebSocket-Kommunikation, Instant Messaging und einer eleganten Benutzeroberfläche.",
    },
    experience: {
      title: "Erfahrung",
      devflovv_role: "Junior-Softwareentwickler",
      devflovv_company: "DevFlovv, Lahore",
      devflovv_duration: "Juni 2025 – Juni 2026",
      devflovv_desc: "Entwicklung skalierbarer Webanwendungen und Mitwirkung an Full-Stack-Entwicklungsprojekten.",
    },
    skills: {
      title: "Fähigkeiten",
      tools: "Werkzeuge",
    },
    certifications: {
      title: "Zertifikate",
      by: "von",
      online: "Online",
      internship: "Praktikum",
      cert1: "Einführung in JavaScript",
      cert2: "Anzeigenumsatz mit Google Ad Manager steigern",
      cert3: "PITMAN ENGLISCH",
      cert4: "Erstellen Sie eine vollständige Website mit WordPress",
      cert5: "Inter Services Public Relations Praktikum (ISPR)",
    },
    languages: {
      title: "Sprachen",
      english: "Englisch",
      urdu: "Urdu",
      hindi_punjabi: "Hindi / Punjabi",
      intermediate: "Fortgeschritten",
      understand: "Versteht gesprochene Sprache",
    },
    ui: {
      scroll: "Scrollen",
      languageSelect: "Websitesprache wählen",
      themeToggle: "Dunkelmodus umschalten",
    },
    footer: {
      crafted: "Mit Präzision gefertigt.",
    },
  },
};

/* ─── Animation Variants ─── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Section Divider Component ─── */

function SectionDivider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <div ref={ref} className="section-divider my-4">
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={isInView ? { scaleY: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-px h-full bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent origin-top"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="absolute w-3 h-3 rounded-full bg-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
      />
    </div>
  );
}

const colorStyles: Record<string, { bg: string; border: string; text: string }> = {
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-400",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-400",
  },
  teal: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    text: "text-teal-400",
  },
};

const dotColorStyles: Record<string, string> = {
  purple: "bg-purple-400/80",
  blue: "bg-blue-400/80",
  teal: "bg-teal-400/80",
  orange: "bg-orange-400/80",
};

/* ─── Section Heading Component ─── */

function SectionHeading({ icon: Icon, title, color, isRTL }: { icon: React.ElementType; title: string; color: string; isRTL?: boolean }) {
  const styles = colorStyles[color] || colorStyles.purple;
  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="flex items-center gap-4 mb-14"
    >
      <div className={`p-3 rounded-xl ${styles.bg} border ${styles.border}`}>
        <Icon className={`w-6 h-6 ${styles.text}`} />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground dark:text-white/95">{title}</h2>
      <div className={`flex-1 h-px bg-gradient-to-${isRTL ? "l" : "r"} from-black/10 dark:from-white/20 to-transparent ${isRTL ? "mr-4" : "ml-4"}`} />
    </motion.div>
  );
}

/* ─── Skill Bar Component ─── */

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-[var(--foreground)]">{ name}</span>
        <span className="text-xs font-mono text-muted-foreground">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const storedTheme = localStorage.getItem("theme");
    const storedLang = localStorage.getItem("language") as Language | null;

    const isDarkMode = storedTheme === "dark" || document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    if (storedLang && TRANSLATIONS[storedLang]) {
      setSelectedLang(storedLang);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [isDark, mounted]);

  const t = TRANSLATIONS[selectedLang];
  const isRTL = t.dir === "rtl";

  useEffect(() => {
    if (mounted) {
      document.documentElement.dir = t.dir;
      document.documentElement.lang = selectedLang;
      localStorage.setItem("language", selectedLang);
    }
  }, [selectedLang, mounted, t.dir]);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main className="min-h-screen relative overflow-hidden bg-[var(--background)] pt-16">

      {/* ─── Navigation ─── */}
      <header className="fixed top-0 left-0 w-full z-50 glass" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#home" className="group flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              W
            </div>
            <span className="text-lg font-bold tracking-tight text-gradient">Wajahat</span>
          </a>
          <nav className="hidden md:flex gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-4 py-2"
              >
                {t.nav[link.labelKey]}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <select
              value={selectedLang}
              onChange={(event) => setSelectedLang(event.target.value as Language)}
              className="themed-select rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-[var(--foreground)] px-4 py-2 glass focus:outline-none shadow-lg transition-all duration-300"
              aria-label={t.ui.languageSelect}
            >
              {LANG_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {`${option.flag} ${option.label}`}
                </option>
              ))}
            </select>
            {mounted && (
              <button
                onClick={() => setIsDark(!isDark)}
                aria-label={t.ui.themeToggle}
                className="p-2 rounded-full glass hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
              >
                {isDark ? (
                  <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l-1.414-1.414a1 1 0 00-1.414 1.414l1.414 1.414a1 1 0 001.414-1.414zM2.05 6.464l1.414 1.414a1 1 0 001.414-1.414L3.464 5.05A1 1 0 102.05 6.464zM17.5 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zM1 11a1 1 0 100-2 1 1 0 000 2zm16 0a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            )}
            <a
              href="https://github.com/Wajahat-Ali-Git"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium hover:bg-white/10 transition-all"
            >
              <FaGithub className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* ─── Ambient Background ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-15%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[150px] animate-float-reverse" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-indigo-600/5 blur-[120px] animate-float" />
      </div>

      <div className="relative z-10">

        {/* ═══════════════════════════════════════════
            HERO SECTION
        ═══════════════════════════════════════════ */}
        <section id="home" ref={heroRef} className="min-h-screen flex items-center">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
            className="container mx-auto px-6 py-20"
          >
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16">

              {/* Left: Text Content */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 flex flex-col gap-8 text-center lg:text-left"
              >
                <motion.div variants={itemVariants} className={`space-y-5 ${isRTL ? "text-right lg:text-right" : "text-center lg:text-left"}`}>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-[var(--muted-foreground)] w-fit mx-auto lg:mx-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {t.hero.status}
                  </div>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
                    <span className="text-gradient">{t.hero.title1}</span>
                    <br />
                    <span className="text-[var(--foreground)]">{t.hero.title2}</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-[var(--muted-foreground)] font-medium flex items-center gap-3 justify-center lg:justify-start">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    {t.hero.role}
                  </p>
                </motion.div>

                <motion.p variants={itemVariants} className="text-lg text-[var(--muted-foreground)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {t.hero.bio}
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
                  <a
                    href="#projects"
                    className="group px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all duration-300 flex items-center gap-2"
                  >
                    {t.hero.cta}
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                  <div className="flex items-center gap-3">
                    {[
                      { href: "https://github.com/Wajahat-Ali-Git", icon: FaGithub, label: "GitHub" },
                      { href: "https://www.linkedin.com/in/wajahat-ali-b098b4243", icon: FaLinkedin, label: "LinkedIn" },
                      { href: "mailto:your-email@example.com", icon: Mail, label: "Email" },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target={social.label !== "Email" ? "_blank" : undefined}
                        rel={social.label !== "Email" ? "noopener noreferrer" : undefined}
                        className="group/icon p-3 rounded-full glass hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>

              {/* Right: Profile Image */}
              <motion.div
                variants={scaleUp}
                initial="hidden"
                animate="visible"
                className="flex-1 flex justify-center lg:justify-end"
              >
                <div className="relative">
                  {/* Orbiting ring */}
                  <div className="absolute inset-[-30px] animate-spin-slow pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-400/60 shadow-[0_0_15px_rgba(96,165,250,0.6)]" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400/60 shadow-[0_0_15px_rgba(192,132,252,0.6)]" />
                  </div>

                  <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[360px] lg:h-[360px]">
                    {/* Glow */}
                    <div className="absolute inset-[-20px] rounded-full bg-gradient-to-tr from-blue-500/30 via-indigo-500/20 to-purple-500/30 animate-glow-pulse blur-2xl" />

                    {/* Decorative ring */}
                    <div className="absolute inset-[-4px] rounded-full border border-dashed border-white/10 animate-spin-slow" />

                    {/* Image container */}
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                      <Image
                        src="https://github.com/Wajahat-Ali-Git.png"
                        alt="Wajahat Ali"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/30 to-transparent" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="flex justify-center pt-16"
            >
              <motion.a
                href="#projects"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <span className="text-xs font-medium tracking-widest uppercase">{t.ui.scroll}</span>
                <ChevronDown className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </motion.div>
        </section>

        <SectionDivider />

        {/* ═══════════════════════════════════════════
            PROJECTS SECTION
        ═══════════════════════════════════════════ */}
        <section id="projects" className="container mx-auto px-6 py-20">
          <SectionHeading icon={Code2} title={t.projects.title} color="purple" isRTL={isRTL} />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {PROJECTS.map((project) => (
              <motion.a
                key={project.title}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className={`glass-card card-glow shimmer-effect p-8 flex flex-col h-full group cursor-pointer ${
                  project.featured ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${dotColorStyles[project.color] || "bg-purple-400/80"}`} />
                    <h3 className="text-xl font-bold tracking-tight">{project.title}</h3>
                    {project.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                        {t.projects.fyp}
                      </span>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <p className="text-[var(--muted-foreground)] flex-grow mb-6 leading-relaxed">
                  {t.projects[project.descKey]}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-xs font-mono font-medium rounded-full bg-white/10 border border-white/10 text-[var(--muted-foreground)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </motion.div>
        </section>

        <SectionDivider />

        {/* ═══════════════════════════════════════════
            EXPERIENCE SECTION
        ═══════════════════════════════════════════ */}
        <section id="experience" className="container mx-auto px-6 py-20">
          <SectionHeading icon={Briefcase} title={t.experience.title} color="blue" isRTL={isRTL} />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative"
          >
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent hidden md:block" />

            {WORK_HISTORY.map((work, idx) => (
              <motion.div
                key={idx}
                variants={slideInLeft}
                className="relative md:pl-20 mb-8"
              >
                {/* Timeline dot */}
                <div className="absolute left-[26px] top-8 w-5 h-5 rounded-full border-2 border-blue-500 bg-[var(--background)] hidden md:flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>

                <div className="glass-card card-glow p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-3">
                    <div>
                      <h3 className="text-2xl font-bold">{t.experience[work.roleKey]}</h3>
                      <p className="text-[var(--muted-foreground)] text-lg">{t.experience[work.companyKey]}</p>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium whitespace-nowrap">
                      {t.experience[work.durationKey]}
                    </span>
                  </div>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">{t.experience[work.descKey]}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <SectionDivider />

        {/* ═══════════════════════════════════════════
            SKILLS & TOOLS SECTION
        ═══════════════════════════════════════════ */}
        <section id="skills" className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Skills */}
            <div>
              <SectionHeading icon={Code} title={t.skills.title} color="green" isRTL={isRTL} />
              <div className="space-y-5">
                {SKILLS.map((skill, idx) => (
                  <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={idx * 0.1} />
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <SectionHeading icon={Wrench} title={t.skills.tools} color="orange" isRTL={isRTL} />
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-2 gap-3"
              >
                {TOOLS.map((tool) => (
                  <motion.div
                    key={tool}
                    variants={itemVariants}
                    whileHover={{ scale: 1.04, y: -2 }}
                    className="glass p-4 rounded-xl flex items-center gap-3 cursor-default group hover:bg-white/8 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs group-hover:bg-orange-500/20 transition-colors">
                      {tool.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-[var(--foreground)]">{tool}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* ═══════════════════════════════════════════
            CERTIFICATIONS SECTION
        ═══════════════════════════════════════════ */}
        <section id="certifications" className="container mx-auto px-6 py-20">
          <SectionHeading icon={Award} title={t.certifications.title} color="yellow" isRTL={isRTL} />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {CERTIFICATIONS.map((cert, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="glass-card card-glow p-6 flex items-start gap-4"
              >
                <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex-shrink-0 mt-0.5">
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">{t.certifications[cert.titleKey]}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {t.certifications.by} {cert.provider}
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-white/5 text-xs">{t.certifications[cert.typeKey]}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <SectionDivider />

        {/* ═══════════════════════════════════════════
            LANGUAGES SECTION
        ═══════════════════════════════════════════ */}
        <section id="languages" className="container mx-auto px-6 py-20">
          <SectionHeading icon={Globe2} title={t.languages.title} color="teal" isRTL={isRTL} />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {LANGUAGES.map((lang) => (
              <motion.div
                key={lang.nameKey}
                variants={scaleUp}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass-card card-glow p-8 text-center"
              >
                <span className="text-4xl mb-4 block">{lang.flag}</span>
                <h3 className="text-xl font-bold mb-1">{t.languages[lang.nameKey]}</h3>
                <p className="text-sm text-[var(--muted-foreground)] capitalize">{t.languages[lang.proficiencyKey]}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="container mx-auto px-6 py-12 mt-10">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--muted-foreground)]">
              © {new Date().getFullYear()} Wajahat Ali. {t.footer.crafted}
            </p>
            <div className="flex items-center gap-4">
              {[
                { href: "https://github.com/Wajahat-Ali-Git", icon: FaGithub },
                { href: "https://www.linkedin.com/in/wajahat-ali-b098b4243", icon: FaLinkedin },
                { href: "mailto:your-email@example.com", icon: Mail },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
