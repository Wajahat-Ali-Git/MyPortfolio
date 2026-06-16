"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, ExternalLink, Code2, Briefcase, Award, Code, Globe2, Wrench } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const PROJECTS = [
  {
    title: "CARSAGE",
    description: "A React Native car recommendation mobile app built with Expo. Features Firebase auth, React Navigation, and AI/ML car features using TensorFlow and Flask.",
    tech: ["React Native", "Expo", "Firebase", "TensorFlow", "Flask"],
    link: "https://github.com/Wajahat-Ali-Git/CARSAGE",
    featured: true,
  },
  {
    title: "BlogDRFProject",
    description: "A robust backend API for a blogging platform built with Django Rest Framework.",
    tech: ["Django", "DRF", "Python"],
    link: "https://github.com/Wajahat-Ali-Git/BlogDRFProject",
  },
  {
    title: "OpenSea-Project",
    description: "A web3 NFT marketplace clone project exploring blockchain integration.",
    tech: ["Web3", "Blockchain"],
    link: "https://github.com/Wajahat-Ali-Git/OpenSea-Project",
  },
  {
    title: "chat-app",
    description: "A real-time chat application demonstrating WebSocket communication.",
    tech: ["React", "WebSockets"],
    link: "https://github.com/Wajahat-Ali-Git/chat-app",
  },
];

const WORK_HISTORY = [
  {
    company: "DevFlovv, Lahore",
    role: "Associate Software Engineer",
    duration: "June 2025 – June 2026",
  }
];

const CERTIFICATIONS = [
  "Introduction to JavaScript (online) By great learning",
  "Drive Advertising Revenue with Google Ad Manager (online) By google",
  "PITMAN ENGLISH (online) by pitman training",
  "Build a Full Website using WordPress (online) by Coursera",
  "Inter Services Public Relations Internship by ISPR",
];

const SKILLS = [
  "JAVASCRIPT", "REACT", "Django / Python", "HTML / CSS", "SQL / PSQL", "Git / GitHub"
];

const TOOLS = [
  "VS Code", "DBeaver", "Postman", "Zapier", "Docker", "Bruno", "Antigravity", "ChatGPT"
];

const LANGUAGES = [
  { name: "English", proficiency: "Intermediate" },
  { name: "Urdu", proficiency: "Intermediate" },
  { name: "Hindi / Punjabi", proficiency: "Can understand spoken" },
];

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#work-history" },
  { label: "Skills", href: "#skills" },
  { label: "Certifications", href: "#certifications" },
];

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background pt-16">
      <header className="fixed top-0 left-0 w-full z-50 glass border-b-0 border-white/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#home" className="text-xl font-bold tracking-tighter">
            <span className="text-gradient">Wajahat</span>
          </a>
          <nav className="hidden md:flex gap-8">
            {NAV_LINKS.map(link => (
              <a 
                key={link.href} 
                href={link.href} 
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10">
        {/* HERO SECTION */}
        <section id="home" className="flex flex-col-reverse lg:flex-row items-center justify-between gap-16 min-h-[70vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col gap-8 text-center lg:text-left"
          >
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-medium text-muted-foreground tracking-wide">
                Hello, I'm
              </h2>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="text-gradient">Wajahat Ali</span>
              </h1>
              <p className="text-2xl md:text-3xl text-foreground/80 font-medium">
                Software Engineer & Developer
              </p>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              I specialize in building scalable web and mobile applications. 
              Always eager to learn new technologies and solve complex problems with elegant solutions.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <a 
                href="#projects" 
                className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:scale-105 transition-transform duration-300"
              >
                View My Work
              </a>
              <div className="flex items-center gap-4 px-4">
                <a href="https://github.com/Wajahat-Ali-Git" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass hover:bg-white/10 transition-colors">
                  <FaGithub className="w-6 h-6" />
                </a>
                <a href="https://www.linkedin.com/in/wajahat-ali-b098b4243" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full glass hover:bg-white/10 transition-colors">
                  <FaLinkedin className="w-6 h-6" />
                </a>
                <a href="mailto:your-email@example.com" className="p-3 rounded-full glass hover:bg-white/10 transition-colors">
                  <Mail className="w-6 h-6" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              {/* Glowing ring behind image */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 animate-pulse blur-2xl opacity-40" />
              <div className="relative w-full h-full rounded-full border-4 border-white/10 overflow-hidden glass p-2">
                <div className="w-full h-full rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
                  {/* Using GitHub Avatar as Placeholder */}
                  <Image 
                    src="https://github.com/Wajahat-Ali-Git.png" 
                    alt="Wajahat Ali"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-16"
          >
            <Code2 className="w-8 h-8 text-purple-500" />
            <h2 className="text-4xl font-bold">Featured Projects</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PROJECTS.map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`glass-card p-8 flex flex-col h-full ${project.featured ? 'md:col-span-2 border-purple-500/30 bg-purple-500/5' : ''}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold">{project.title}</h3>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
                
                <p className="text-muted-foreground flex-grow mb-8 text-lg">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map(tech => (
                    <span 
                      key={tech} 
                      className="px-3 py-1 text-sm font-medium rounded-full bg-white/10 text-foreground/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WORK HISTORY SECTION */}
        <section id="work-history" className="py-20 border-t border-white/10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <Briefcase className="w-8 h-8 text-blue-500" />
            <h2 className="text-4xl font-bold">Work History</h2>
          </motion.div>
          
          <div className="space-y-8">
            {WORK_HISTORY.map((work, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-8"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{work.role}</h3>
                    <p className="text-lg text-muted-foreground">{work.company}</p>
                  </div>
                  <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 font-medium whitespace-nowrap">
                    {work.duration}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CERTIFICATIONS SECTION */}
        <section id="certifications" className="py-20 border-t border-white/10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <Award className="w-8 h-8 text-yellow-500" />
            <h2 className="text-4xl font-bold">Certifications</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CERTIFICATIONS.map((cert, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass p-6 rounded-2xl flex items-start gap-4"
              >
                <Award className="w-6 h-6 text-yellow-500/50 flex-shrink-0 mt-1" />
                <p className="text-lg text-foreground/80">{cert}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SKILLS & TOOLS SECTION */}
        <section id="skills" className="py-20 border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-8"
              >
                <Code className="w-8 h-8 text-green-500" />
                <h2 className="text-3xl font-bold">Skills</h2>
              </motion.div>
              <div className="flex flex-wrap gap-3">
                {SKILLS.map((skill, idx) => (
                  <motion.span 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="px-4 py-2 rounded-full glass text-foreground/90 font-medium"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 mb-8"
              >
                <Wrench className="w-8 h-8 text-orange-500" />
                <h2 className="text-3xl font-bold">Tools</h2>
              </motion.div>
              <div className="flex flex-wrap gap-3">
                {TOOLS.map((tool, idx) => (
                  <motion.span 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="px-4 py-2 rounded-full glass text-foreground/90 font-medium"
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LANGUAGES SECTION */}
        <section id="languages" className="py-20 border-t border-white/10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-12"
          >
            <Globe2 className="w-8 h-8 text-teal-500" />
            <h2 className="text-4xl font-bold">Languages</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LANGUAGES.map((lang, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <h3 className="text-2xl font-bold mb-2 text-foreground">{lang.name}</h3>
                <p className="text-muted-foreground capitalize">{lang.proficiency}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
