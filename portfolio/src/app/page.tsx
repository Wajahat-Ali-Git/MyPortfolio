"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { Mail, ExternalLink, Code2, Briefcase, Award, Code, Globe2, Wrench, ChevronDown, ArrowUpRight, Terminal, FileDown } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";
import WorkflowAnimation from "./components/WorkflowAnimation";
import GitHubRepos from "./components/GitHubRepos";
import { TRANSLATIONS, dotColorStyles, colorStyles, scaleUp, slideInLeft, slideInRight, itemVariants, containerVariants, LANG_OPTIONS, NAV_LINKS } from "../constants/contants";
import { fetchAllPortfolioData, type DynamicProject, type DynamicExperience, type DynamicSkill, type DynamicCertification, type DynamicLanguage, type DynamicPersonalInfo, type SectionVisibility } from "../lib/portfolioData";
import type { Language } from "../types/types";



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
        <span className="text-sm font-semibold text-[var(--foreground)]">{name}</span>
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

/* Simple custom language dropdown to replace native select for improved UI */
function LanguageDropdown({
  selectedLang,
  onChange,
  ariaLabel,
}: {
  selectedLang: Language;
  onChange: (lang: Language) => void;
  ariaLabel?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = LANG_OPTIONS.find(opt => opt.code === selectedLang) || LANG_OPTIONS[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={ariaLabel}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 text-sm font-medium px-4 py-2 glass hover:bg-white/10 transition-all duration-300"
      >
        <span>{selectedOption.flag}</span>
        <span className="hidden sm:inline">{selectedOption.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-40 rounded-xl glass border border-white/10 shadow-2xl overflow-hidden z-50 flex flex-col"
            style={{ backgroundColor: 'var(--background)' }}
          >
            {LANG_OPTIONS.map((option) => (
              <button
                key={option.code}
                onClick={() => {
                  onChange(option.code as Language);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors hover:bg-white/10 ${selectedLang === option.code ? "bg-white/5 text-indigo-400 font-semibold" : "text-[var(--foreground)]"
                  }`}
              >
                <span>{option.flag}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Mobile Bottom Navigation Component ─── */

type NavIconType = React.ElementType;

const MOBILE_NAV_ICONS: Record<string, NavIconType> = {
  home: Terminal,
  projects: Code2,
  experience: Briefcase,
  skills: Wrench,
  certifications: Award,
};

function MobileBottomNav({ t, isRTL, sectionVisibility }: { t: typeof TRANSLATIONS["en"]; isRTL: boolean; sectionVisibility?: SectionVisibility }) {
  const [activeSection, setActiveSection] = useState<string>("home");

  const visibleNavLinks = NAV_LINKS.filter((link) => {
    if (link.labelKey === "home") return true;
    if (sectionVisibility && link.labelKey in sectionVisibility) {
      return sectionVisibility[link.labelKey as keyof SectionVisibility] !== false;
    }
    return true;
  });

  useEffect(() => {
    // Use IntersectionObserver for accurate section detection
    const sectionIds = visibleNavLinks.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];
    const visibilityMap: Record<string, number> = {};

    const updateActive = () => {
      // Pick the section with the highest intersection ratio
      let best = "home";
      let bestRatio = -1;
      for (const id of sectionIds) {
        if ((visibilityMap[id] ?? 0) > bestRatio) {
          bestRatio = visibilityMap[id] ?? 0;
          best = visibleNavLinks.find((l) => l.href.slice(1) === id)?.labelKey ?? best;
        }
      }
      setActiveSection(best);
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          visibilityMap[id] = entry.intersectionRatio;
          updateActive();
        },
        { threshold: Array.from({ length: 11 }, (_, i) => i / 10), rootMargin: "0px 0px -30% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [visibleNavLinks]);

  return (
    <motion.nav
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      aria-label="Mobile navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      className="md:hidden fixed bottom-2.5 left-1/2 -translate-x-1/2 z-50 max-w-full px-2"
    >
      {/* Nav pill container — full-width minus gutter on each side, capped at 420px */}
      <div
        className="relative flex items-center justify-around glass rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl"
        style={{
          width: "min(calc(100vw - 1rem), 420px)",
          padding: "5px 3px",
        }}
      >
        {visibleNavLinks.map((link) => {
          const Icon = MOBILE_NAV_ICONS[link.labelKey] || Code2;
          const isActive = activeSection === link.labelKey;
          const label = t.nav[link.labelKey as keyof typeof t.nav];

          return (
            <motion.a
              key={link.href}
              href={link.href}
              whileTap={{ scale: 0.88 }}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-col items-center justify-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60"
              style={{
                flex: isActive ? "0 0 auto" : "1 1 0",
                minWidth: 0,
                padding: "6px 4px 4px",
              }}
            >
              {/* Sliding active background */}
              {isActive && (
                <motion.div
                  layoutId="mobileNavBg"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.12))", border: "1px solid rgba(99,102,241,0.25)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}

              {/* Glowing dot above icon (active only) */}
              <motion.div
                animate={isActive ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-[0_0_6px_rgba(99,102,241,0.7)]"
                style={{ transformOrigin: "center" }}
              />

              {/* Icon */}
              <motion.div
                animate={isActive ? { scale: 1.1, y: -1 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className={`flex items-center justify-center transition-colors ${
                  isActive
                    ? "text-indigo-400 drop-shadow-[0_0_6px_rgba(99,102,241,0.55)]"
                    : "text-[var(--muted-foreground)]"
                }`}
              >
                <Icon className="w-[18px] h-[18px] xs:w-5 xs:h-5" />
              </motion.div>

              {/* Label — always visible but dimmed when inactive; truncates on tiny screens */}
              <motion.span
                animate={isActive ? { opacity: 1, color: "rgb(129,140,248)" } : { opacity: 0.45, color: "var(--muted-foreground)" }}
                transition={{ duration: 0.2 }}
                className="block mt-[3px] font-semibold leading-none"
                style={{ fontSize: "clamp(8px, 2.4vw, 11px)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}
              >
                {label}
              </motion.span>
            </motion.a>
          );
        })}
      </div>
    </motion.nav>
  );
}

/* ─── Main Page ─── */

export default function Home() {
  // Always initialize with SSR-safe defaults — the useEffect below reads
  // localStorage after hydration so the server and client initial renders match.
  const [isDark, setIsDark] = useState<boolean>(false);

  const [selectedLang, setSelectedLang] = useState<Language>("en");

  const [mounted, setMounted] = useState(false);
  const [projectFilter, setProjectFilter] = useState<string>("All");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState<{
    projects: DynamicProject[];
    experiences: DynamicExperience[];
    skills: DynamicSkill[];
    tools: string[];
    certifications: DynamicCertification[];
    languages: DynamicLanguage[];
    personalInfo: DynamicPersonalInfo | null;
    sectionVisibility: SectionVisibility;
    resumeUrl: string | null;
  }>({
    projects: [],
    experiences: [],
    skills: [],
    tools: [],
    certifications: [],
    languages: [],
    personalInfo: null,
    sectionVisibility: {
      projects: true,
      github: true,
      experience: true,
      skills: true,
      certifications: true,
      languages: true,
    },
    resumeUrl: null,
  });

  // Load (or re-load) all portfolio data from Supabase
  const loadPortfolioData = () => {
    setIsDataLoading(true);
    fetchAllPortfolioData()
      .then((data) => {
        if (data) setPortfolioData(data);
      })
      .catch(() => { /* silently fall through to finally — UI already handles empty state */ })
      .finally(() => setIsDataLoading(false));
  };

  useEffect(() => {
    // Initial load
    loadPortfolioData();

    // Re-fetch whenever the user returns to this tab (e.g. after making admin edits)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadPortfolioData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  const personalInfo = portfolioData.personalInfo;
  const heroNameParts = (personalInfo?.fullName || "").trim().split(/\s+/).filter(Boolean);
  const heroTitle1 = heroNameParts[0] || t.hero.title1;
  const heroTitle2 = heroNameParts.slice(1).join(" ") || (heroNameParts.length ? "" : t.hero.title2);
  const heroRole = personalInfo?.role || t.hero.role;
  const heroBio = personalInfo?.bio || t.hero.bio;
  const heroStatus = personalInfo?.availabilityStatus || t.hero.status;
  const githubUrl = personalInfo?.githubUrl || "https://github.com/Wajahat-Ali-Git";
  const linkedinUrl = personalInfo?.linkedinUrl || "https://www.linkedin.com/in/wajahat-ali-b098b4243";
  const emailHref = personalInfo?.email ? `mailto:${personalInfo.email}` : "mailto:your-email@example.com";
  const profileImage = personalInfo?.profileImageUrl || "https://github.com/Wajahat-Ali-Git.png";

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

  // Header scroll opacity
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden bg-[var(--background)] pt-16">

      {/* ─── Navigation ─── */}
      <motion.header
        animate={{
          backgroundColor: scrolled ? "rgba(12, 12, 18, 0.82)" : "rgba(12, 12, 18, 0)",
          backdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "blur(0px)",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(1.4)" : "blur(0px)",
          borderBottomColor: scrolled ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0)",
          boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.28)" : "none",
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-50"
        style={{ borderBottom: "1px solid transparent" }}
      >
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
          <a href="#home" className="group flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              W
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-gradient truncate">Wajahat</span>
          </a>
          <nav className="hidden md:flex md:items-center md:justify-center md:gap-2 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 glass shadow-lg">
            {NAV_LINKS.filter((link) => {
              if (link.labelKey === "home") return true;
              if (portfolioData.sectionVisibility && link.labelKey in portfolioData.sectionVisibility) {
                return portfolioData.sectionVisibility[link.labelKey as keyof SectionVisibility] !== false;
              }
              return true;
            }).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link text-sm font-medium text-[var(--muted-foreground)] hover:text-indigo-400 hover:bg-white/5 rounded-full transition-all px-4 py-2"
              >
                {t.nav[link.labelKey]}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageDropdown
              selectedLang={selectedLang}
              onChange={(lang) => setSelectedLang(lang)}
              ariaLabel={t.ui.languageSelect}
            />
            {mounted && (
              <button
                onClick={() => setIsDark(!isDark)}
                aria-label={t.ui.themeToggle}
                className="p-2 rounded-full glass hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 shrink-0"
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
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium hover:bg-white/10 transition-all"
            >
              <FaGithub className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Mobile bottom navbar with icons and active states */}
      <MobileBottomNav t={t} isRTL={isRTL} sectionVisibility={portfolioData.sectionVisibility} />

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
        <section id="home" aria-label="Hero Profile" ref={heroRef} className="min-h-[85vh] sm:min-h-screen flex items-center">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
            className="container mx-auto px-4 sm:px-6 py-12 sm:py-20"
          >
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10 sm:gap-16">

              {/* Left: Text Content */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 flex flex-col gap-6 sm:gap-8 text-center lg:text-left w-full"
              >
                <motion.div variants={itemVariants} className={`space-y-4 sm:space-y-5 ${isRTL ? "text-right lg:text-right" : "text-center lg:text-left"}`}>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full glass text-xs sm:text-sm text-[var(--muted-foreground)] w-fit mx-auto lg:mx-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {heroStatus}
                  </div>
                  <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] sm:leading-[0.95]">
                    <span className="text-gradient">{heroTitle1}</span>
                    {heroTitle2 ? (
                      <>
                        <br />
                        <span className="text-[var(--foreground)]">{heroTitle2}</span>
                      </>
                    ) : null}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-[var(--muted-foreground)] font-medium flex items-center gap-2.5 sm:gap-3 justify-center lg:justify-start">
                    <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 shrink-0" />
                    <span>{heroRole}</span>
                  </p>
                </motion.div>

                <motion.p variants={itemVariants} className="text-sm sm:text-base md:text-lg text-[var(--muted-foreground)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {heroBio}
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start pt-2 w-full">
                  <a
                    href="#projects"
                    className="w-full sm:w-auto justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
                  >
                    {t.hero.cta}
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                  {portfolioData.resumeUrl && (
                    <a
                      href={portfolioData.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download="Resume.pdf"
                      className="w-full sm:w-auto justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-full glass hover:bg-white/10 text-foreground font-semibold border border-white/10 hover:border-indigo-500/40 hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] transition-all duration-300 flex items-center gap-2 text-sm sm:text-base"
                    >
                      <FileDown className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span>Download CV</span>
                    </a>
                  )}
                  <div className="flex items-center gap-3 pt-2 sm:pt-0">
                    {[
                      { href: githubUrl, icon: FaGithub, label: "GitHub" },
                      { href: linkedinUrl, icon: FaLinkedin, label: "LinkedIn" },
                      { href: emailHref, icon: Mail, label: "Email" },
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
                  <div className="absolute inset-[-18px] sm:inset-[-30px] animate-spin-slow pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-400/60 shadow-[0_0_15px_rgba(96,165,250,0.6)]" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400/60 shadow-[0_0_15px_rgba(192,132,252,0.6)]" />
                  </div>

                  <div className="relative w-48 h-48 xs:w-64 xs:h-64 md:w-80 md:h-80 lg:w-[360px] lg:h-[360px]">
                    {/* Glow */}
                    <div className="absolute inset-[-15px] sm:inset-[-20px] rounded-full bg-gradient-to-tr from-blue-500/30 via-indigo-500/20 to-purple-500/30 animate-glow-pulse blur-xl sm:blur-2xl" />

                    {/* Decorative ring */}
                    <div className="absolute inset-[-4px] rounded-full border border-dashed border-white/10 animate-spin-slow" />

                    {/* Image container */}
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                      <Image
                        src={profileImage}
                        alt={personalInfo?.fullName || "Wajahat Ali"}
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

        {/* Workflow animation (client-side) */}
        <section className="container mx-auto px-6 py-12">
          <WorkflowAnimation />
        </section>

        {/* ═══════════════════════════════════════════
            PROJECTS SECTION
        ═══════════════════════════════════════════ */}
        {portfolioData.sectionVisibility.projects && (() => {
          // Derive unique filter tags from loaded project tech arrays
          const allTechTags = ["All", ...Array.from(
            new Set(portfolioData.projects.flatMap((p) => p.tech))
          ).sort()];

          const filteredProjects = projectFilter === "All"
            ? portfolioData.projects
            : portfolioData.projects.filter((p) => p.tech.includes(projectFilter));

          return (
            <section id="projects" aria-label={t.projects.title} className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
              <SectionHeading icon={Code2} title={t.projects.title} color="purple" isRTL={isRTL} />

              {/* ── Filter Bar ── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-wrap gap-2 sm:gap-2.5 mb-8 sm:mb-10 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1"
                role="toolbar"
                aria-label="Filter projects by technology"
              >
                {allTechTags.map((tag) => {
                  const isActive = projectFilter === tag;
                  return (
                    <motion.button
                      key={tag}
                      onClick={() => setProjectFilter(tag)}
                      whileTap={{ scale: 0.93 }}
                      aria-pressed={isActive}
                      className={`relative px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-mono font-semibold transition-all duration-200 border focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 whitespace-nowrap ${
                        isActive
                          ? "border-purple-500/60 text-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.25)]"
                          : "border-white/10 text-[var(--muted-foreground)] hover:border-purple-500/40 hover:text-purple-300 bg-white/5 hover:bg-purple-500/10"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="projectFilterBg"
                          className="absolute inset-0 rounded-full bg-purple-500/20"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{tag}</span>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* ── Projects Grid ── */}
              <motion.div
                layout
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProjects.length === 0 ? (
                    <motion.div
                      key="no-results"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="col-span-1 md:col-span-2 flex flex-col items-center justify-center py-16 sm:py-20 gap-3 text-[var(--muted-foreground)] text-center"
                    >
                      <Code2 className="w-10 h-10 opacity-30" />
                      <p className="text-sm font-medium opacity-60">No projects match <span className="text-purple-400 font-mono">{projectFilter}</span></p>
                    </motion.div>
                  ) : (
                    filteredProjects.map((project) => {
                      const translatedDesc = project.descKey
                        ? t.projects[project.descKey as keyof typeof t.projects]
                        : undefined;
                      const desc = project.description || translatedDesc || "";

                      return (
                        <motion.a
                          layout
                          key={project.id || project.title}
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          variants={itemVariants}
                          initial={{ opacity: 0, scale: 0.96, y: 12 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.94, y: -8 }}
                          whileHover={{ y: -6 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className={`glass-card card-glow shimmer-effect p-5 sm:p-8 flex flex-col h-full group cursor-pointer ${
                            project.featured && projectFilter === "All" ? "md:col-span-2 border-purple-500/30 bg-purple-500/10 dark:bg-purple-900/20" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4 sm:mb-5 gap-3">
                            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap min-w-0">
                              <div className={`w-3 h-3 rounded-full shrink-0 ${dotColorStyles[project.color] || "bg-purple-400/80"}`} />
                              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)] dark:text-white truncate">{project.title}</h3>
                              {project.featured && (
                                <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold border border-purple-500/30 shrink-0">
                                  {t.projects.fyp}
                                </span>
                              )}
                            </div>
                            <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                          </div>

                          <p className="text-sm sm:text-base text-[var(--foreground)]/80 dark:text-gray-300 flex-grow mb-5 sm:mb-6 leading-relaxed">
                            {desc}
                          </p>

                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto">
                            {project.tech.map((tech) => (
                              <span
                                key={tech}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setProjectFilter(tech); }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setProjectFilter(tech); } }}
                                aria-label={`Filter by ${tech}`}
                                className={`px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-mono font-medium rounded-full border transition-all duration-150 cursor-pointer ${
                                  projectFilter === tech
                                    ? "bg-purple-500/25 border-purple-400/60 text-purple-300"
                                    : "bg-white/10 dark:bg-white/10 border-black/10 dark:border-white/10 text-[var(--foreground)] dark:text-gray-200 hover:border-purple-400/40 hover:text-purple-300"
                                }`}
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </motion.a>
                      );
                    })
                  )}
                </AnimatePresence>
              </motion.div>

            </section>
          );
        })()}

        {/* ═══════════════════════════════════════════
            RECENT CODE ACTIVITY SECTION
        ═══════════════════════════════════════════ */}
        {portfolioData.sectionVisibility.github && <GitHubRepos selectedLang={selectedLang} t={t} isRTL={isRTL} />}

        <SectionDivider />

        {/* ═══════════════════════════════════════════
            EXPERIENCE SECTION
        ═══════════════════════════════════════════ */}
        {portfolioData.sectionVisibility.experience && <section id="experience" aria-label={t.experience.title} className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <SectionHeading icon={Briefcase} title={t.experience.title} color="blue" isRTL={isRTL} />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="relative"
          >
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-blue-500/20 to-transparent hidden md:block" />

            {portfolioData.experiences.map((work, idx) => {
              const roleText = work.role
                || (work.roleKey ? t.experience[work.roleKey as keyof typeof t.experience] : "")
                || "";
              const companyText = work.companyName
                || (work.companyKey ? t.experience[work.companyKey as keyof typeof t.experience] : "")
                || "";
              const durationText = work.duration
                || (work.durationKey ? t.experience[work.durationKey as keyof typeof t.experience] : "")
                || "";
              const descText = work.description
                || (work.descKey ? t.experience[work.descKey as keyof typeof t.experience] : "")
                || "";

              return (
                <motion.div
                  key={work.id || idx}
                  variants={slideInLeft}
                  className="relative md:pl-20 mb-6 sm:mb-8"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[10px] sm:left-[26px] top-8 w-5 h-5 rounded-full border-2 border-blue-500 bg-[var(--background)] hidden md:flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                  </div>

                  <div className="glass-card card-glow p-5 sm:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4 mb-3">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold">{roleText}</h3>
                        <p className="text-[var(--muted-foreground)] text-base sm:text-lg">{companyText}</p>
                      </div>
                      {durationText && (
                        <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs sm:text-sm font-medium whitespace-nowrap">
                          {durationText}
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">{descText}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>}

        <SectionDivider />

        {/* ═══════════════════════════════════════════
            SKILLS & TOOLS SECTION
        ═══════════════════════════════════════════ */}
        {portfolioData.sectionVisibility.skills && <section id="skills" aria-label={t.skills.title} className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
            {/* Skills */}
            <div>
              <SectionHeading icon={Code} title={t.skills.title} color="green" isRTL={isRTL} />
              <div className="space-y-4 sm:space-y-5">
                {portfolioData.skills.map((skill, idx) => (
                  <SkillBar key={skill.id || skill.name} name={skill.name} level={skill.level} delay={idx * 0.1} />
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
                className="grid grid-cols-2 gap-2.5 sm:gap-3"
              >
                {portfolioData.tools.map((tool) => (
                  <motion.div
                    key={tool}
                    variants={itemVariants}
                    whileHover={{ scale: 1.04, y: -2 }}
                    className="glass p-3.5 sm:p-4 rounded-xl flex items-center gap-3 cursor-default group hover:bg-white/8 transition-all min-w-0"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs group-hover:bg-orange-500/20 transition-colors shrink-0">
                      {tool.charAt(0)}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[var(--foreground)] truncate">{tool}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>}

        <SectionDivider />

        {/* ═══════════════════════════════════════════
            CERTIFICATIONS SECTION
        ═══════════════════════════════════════════ */}
        {portfolioData.sectionVisibility.certifications && <section id="certifications" className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <SectionHeading icon={Award} title={t.certifications.title} color="yellow" isRTL={isRTL} />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
          >
            {portfolioData.certifications.map((cert, idx) => {
              const translatedTitle = cert.titleKey
                ? t.certifications[cert.titleKey as keyof typeof t.certifications]
                : undefined;
              const titleText = cert.title || translatedTitle || "";
              const typeText = (cert.typeKey && t.certifications[cert.typeKey as keyof typeof t.certifications])
                ? t.certifications[cert.typeKey as keyof typeof t.certifications]
                : (cert.typeKey || "Online");

              return (
                <motion.div
                  key={cert.id || idx}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card card-glow p-5 sm:p-6 flex items-start gap-3.5 sm:gap-4"
                >
                  <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex-shrink-0 mt-0.5">
                    <Award className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-[var(--foreground)] mb-1 leading-snug">{titleText}</h3>
                    <p className="text-xs sm:text-sm text-[var(--muted-foreground)] flex items-center gap-1.5 flex-wrap">
                      <span>{t.certifications.by} {cert.provider}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] sm:text-xs">{typeText}</span>
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>}

        <SectionDivider />

        {/* ═══════════════════════════════════════════
            LANGUAGES SECTION
        ═══════════════════════════════════════════ */}
        {portfolioData.sectionVisibility.languages && <section id="languages" className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <SectionHeading icon={Globe2} title={t.languages.title} color="teal" isRTL={isRTL} />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"
          >
            {portfolioData.languages.map((lang, idx) => (
              <motion.div
                key={lang.id || lang.code || idx}
                variants={scaleUp}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass-card card-glow p-6 sm:p-8 text-center"
              >
                <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 block">{lang.flag || '🌐'}</span>
                <h3 className="text-lg sm:text-xl font-bold mb-1">
                  {lang.name || (t.languages as Record<string, string>)[lang.code]}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] capitalize">
                  {(t.languages as Record<string, string>)[lang.proficiency] || lang.proficiency}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>}


        {/* ─── Footer ─── */}
        <footer className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 mt-8 sm:mt-10">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6 sm:mb-8" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              © {new Date().getFullYear()} Wajahat Ali. {t.footer.crafted}
            </p>
            <div className="flex items-center gap-4">
              {[
                { href: githubUrl, icon: FaGithub },
                { href: linkedinUrl, icon: FaLinkedin },
                { href: emailHref, icon: Mail },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1"
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



