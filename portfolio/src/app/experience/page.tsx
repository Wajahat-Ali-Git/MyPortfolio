"use client";

import { motion } from "framer-motion";
import { Briefcase, ArrowLeft, Terminal } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "../components/SectionHeading";
import { SkillBar } from "../components/SkillBar";
import { containerVariants, itemVariants } from "../components/shared";

const EXPERIENCES = [
  {
    id: "rhi",
    title: "RHI (Ryan Homes Integration)",
    bullets: [
      "Designed and built a data-consolidation web app that aggregates opportunity data from multiple client APIs and databases, normalizes records, and presents consolidated opportunities for review.",
      "Implemented filtering and transformation rules to generate clean, sync-ready opportunities and a preview workflow to selectively push records to Salesforce.",
      "Automated opportunity creation and update logic in Salesforce to prevent duplicates and ensure data consistency across systems, significantly reducing manual reconciliation.",
      "Developed frontend components in React and backend services using Firebase Functions; owned deployment and maintenance across release cycles.",
    ],
    stack: ["React", "Node.js", "Firebase Functions", "Salesforce"],
    languages: [
      { name: "React / JavaScript", level: 60 },
      { name: "Node.js", level: 25 },
      { name: "Firebase", level: 15 },
    ],
  },
  {
    id: "fdc",
    title: "FDC (Fence & Deck Connection)",
    bullets: [
      "Rebuilt a legacy HTML system into a modern Angular + Firebase web application with a dynamic 5-step form that adapts based on customer-selected quotes from Salesforce.",
      "Integrated digital signature capture, validation workflows, and secure payment processing (ACH, Stripe, Square) for full and installment payments, improving contract completion rates and payment reliability.",
      "Migrated modern frontend stack to Next.js / React with MongoDB and Firebase integration.",
    ],
    stack: ["Next.js", "React", "Angular", "Firebase Functions", "MongoDB", "Salesforce"],
    languages: [
      { name: "Next.js / React", level: 45 },
      { name: "Angular", level: 30 },
      { name: "Firebase", level: 15 },
      { name: "MongoDB", level: 10 },
    ],
  },
  {
    id: "marketsmart",
    title: "Market-Smart",
    bullets: [
      "Designed and implemented a comprehensive user onboarding flow to capture acquisition preferences, including profit targets, revenue expectations, business age, and investment criteria, supported by interactive data visualizations for informed decision-making.",
      "Enhanced the application's overall UI/UX with a focus on mobile responsiveness, usability, and modern design, improving the user experience across devices.",
    ],
    stack: ["React", "UI/UX Design", "Data Visualization", "Responsive Design"],
    languages: [
      { name: "React", level: 70 },
      { name: "CSS / UI", level: 30 },
    ],
  },
  {
    id: "angi",
    title: "Angi's List Salesforce Integration",
    bullets: [
      "Implemented an automated lead integration using Angi's List API, Zapier webhooks, and Salesforce, transforming incoming leads into properly mapped Salesforce records.",
      "Configured Zapier for integration of webhooks getting leads from Angie to Salesforce for both production and staging accounts.",
    ],
    stack: ["Zapier", "Webhooks", "Angi's List API", "Salesforce"],
    languages: [
      { name: "Zapier / Webhooks", level: 60 },
      { name: "Salesforce Integrations", level: 40 },
    ],
  },
];

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-20 px-6 sm:px-12 md:px-24">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-indigo-400 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <SectionHeading icon={Briefcase} title="Detailed Experience" color="purple" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {EXPERIENCES.map((exp) => (
            <motion.div
              key={exp.id}
              variants={itemVariants}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl relative overflow-hidden group"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-12">
                <div className="flex-1 space-y-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {exp.title}
                  </h3>
                  
                  <ul className="space-y-4">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-3 text-white/80 leading-relaxed text-sm md:text-base">
                        <span className="text-indigo-400 mt-1">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 space-y-3">
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-4 h-4" /> Tools & Tech
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs font-medium bg-white/10 text-white/90 rounded-full border border-white/10 shadow-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:w-80 space-y-6 shrink-0 bg-black/20 p-6 rounded-xl border border-white/5">
                  <h4 className="text-sm font-semibold text-white/90 uppercase tracking-wider">
                    Language & Stack Usage
                  </h4>
                  <div className="space-y-6">
                    {exp.languages.map((lang, i) => (
                      <SkillBar
                        key={lang.name}
                        name={lang.name}
                        level={lang.level}
                        delay={0.2 + i * 0.1}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
