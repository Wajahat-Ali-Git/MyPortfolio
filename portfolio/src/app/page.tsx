"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Mail, ExternalLink, Code2, Briefcase, Award, Code, Globe2, Wrench, ChevronDown, ArrowUpRight, Terminal } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

/* ─── Data ─── */

const PROJECTS = [
  {
    title: "CARSAGE",
    description:
      "A React Native car recommendation mobile app built with Expo. Features Firebase auth, React Navigation, and AI/ML car features using TensorFlow and Flask services.",
    tech: ["React Native", "Expo", "Firebase", "TensorFlow", "Flask"],
    link: "https://github.com/Wajahat-Ali-Git/CARSAGE",
    featured: true,
    color: "purple",
  },
  {
    title: "BlogDRFProject",
    description:
      "A robust backend API for a blogging platform built with Django Rest Framework, featuring CRUD operations, authentication, and RESTful endpoints.",
    tech: ["Django", "DRF", "Python", "PostgreSQL"],
    link: "https://github.com/Wajahat-Ali-Git/BlogDRFProject",
    color: "blue",
  },
  {
    title: "OpenSea-Project",
    description:
      "A web3 NFT marketplace clone exploring blockchain integration, smart contract interaction, and decentralized asset management.",
    tech: ["Web3", "Blockchain", "Solidity"],
    link: "https://github.com/Wajahat-Ali-Git/OpenSea-Project",
    color: "teal",
  },
  {
    title: "chat-app",
    description:
      "A real-time chat application with WebSocket communication, instant messaging, and a sleek conversational UI.",
    tech: ["React", "WebSockets", "Node.js"],
    link: "https://github.com/Wajahat-Ali-Git/chat-app",
    color: "orange",
  },
];

const WORK_HISTORY = [
  {
    company: "DevFlovv, Lahore",
    role: "Associate Software Engineer",
    duration: "June 2025 – June 2026",
    description: "Building scalable web applications and contributing to full-stack development projects.",
  },
];

const CERTIFICATIONS = [
  { title: "Introduction to JavaScript", provider: "Great Learning", type: "Online" },
  { title: "Drive Advertising Revenue with Google Ad Manager", provider: "Google", type: "Online" },
  { title: "PITMAN ENGLISH", provider: "Pitman Training", type: "Online" },
  { title: "Build a Full Website using WordPress", provider: "Coursera", type: "Online" },
  { title: "Inter Services Public Relations Internship", provider: "ISPR", type: "Internship" },
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
  { name: "English", proficiency: "Intermediate", flag: "🇬🇧" },
  { name: "Urdu", proficiency: "Intermediate", flag: "🇵🇰" },
  { name: "Hindi / Punjabi", proficiency: "Can understand spoken", flag: "🇮🇳" },
];

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Certifications", href: "#certifications" },
];

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

function SectionHeading({ icon: Icon, title, color }: { icon: React.ElementType; title: string; color: string }) {
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
      <div className="flex-1 h-px bg-gradient-to-r from-black/10 dark:from-white/20 to-transparent ml-4" />
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has dark mode preference
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDark, mounted]);

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
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {mounted && (
              <button
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle dark mode"
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
                <motion.div variants={itemVariants} className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-[var(--muted-foreground)] w-fit mx-auto lg:mx-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Available for opportunities
                  </div>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
                    <span className="text-gradient">Wajahat</span>
                    <br />
                    <span className="text-[var(--foreground)]">Ali</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-[var(--muted-foreground)] font-medium flex items-center gap-3 justify-center lg:justify-start">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    Software Engineer & Developer
                  </p>
                </motion.div>

                <motion.p variants={itemVariants} className="text-lg text-[var(--muted-foreground)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  I specialize in building scalable web and mobile applications.
                  Always eager to learn new technologies and solve complex problems with elegant solutions.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
                  <a
                    href="#projects"
                    className="group px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all duration-300 flex items-center gap-2"
                  >
                    View My Work
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
                <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
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
          <SectionHeading icon={Code2} title="Featured Projects" color="purple" />

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
                        FYP
                      </span>
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <p className="text-[var(--muted-foreground)] flex-grow mb-6 leading-relaxed">
                  {project.description}
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
          <SectionHeading icon={Briefcase} title="Experience" color="blue" />

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
                      <h3 className="text-2xl font-bold">{work.role}</h3>
                      <p className="text-[var(--muted-foreground)] text-lg">{work.company}</p>
                    </div>
                    <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium whitespace-nowrap">
                      {work.duration}
                    </span>
                  </div>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">{work.description}</p>
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
              <SectionHeading icon={Code} title="Skills" color="green" />
              <div className="space-y-5">
                {SKILLS.map((skill, idx) => (
                  <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={idx * 0.1} />
                ))}
              </div>
            </div>

            {/* Tools */}
            <div>
              <SectionHeading icon={Wrench} title="Tools" color="orange" />
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
          <SectionHeading icon={Award} title="Certifications" color="yellow" />

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
                  <h3 className="font-semibold text-[var(--foreground)] mb-1">{cert.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    by {cert.provider}
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-white/5 text-xs">{cert.type}</span>
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
          <SectionHeading icon={Globe2} title="Languages" color="teal" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {LANGUAGES.map((lang) => (
              <motion.div
                key={lang.name}
                variants={scaleUp}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass-card card-glow p-8 text-center"
              >
                <span className="text-4xl mb-4 block">{lang.flag}</span>
                <h3 className="text-xl font-bold mb-1">{lang.name}</h3>
                <p className="text-sm text-[var(--muted-foreground)] capitalize">{lang.proficiency}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="container mx-auto px-6 py-12 mt-10">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--muted-foreground)]">
              © {new Date().getFullYear()} Wajahat Ali. Crafted with precision.
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
