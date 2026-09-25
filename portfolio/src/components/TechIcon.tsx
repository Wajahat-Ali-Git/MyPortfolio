'use client';

import React from 'react';
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiDjango,
  SiPostgresql,
  SiSupabase,
  SiDocker,
  SiGit,
  SiGithub,
  SiHtml5,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiRedis,
  SiFlask,
  SiTensorflow,
  SiFirebase,
  SiExpo,
  SiVercel,
  SiSolidity,
  SiDbeaver,
  SiPostman,
  SiZapier,
  SiWordpress,
  SiCoursera,
  SiGoogle,
  SiOpenai,
  SiFramer,
  SiCplusplus,
  SiRust,
  SiGo,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiDart,
  SiGraphql,
  SiVite,
  SiJsonwebtokens,
} from 'react-icons/si';
import { TbBrandVscode, TbBrandCss3 } from 'react-icons/tb';
import { Code2, Terminal, Wrench, Shield, Database, Cpu, Globe } from 'lucide-react';

interface TechMeta {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

const TECH_MAP: Record<string, TechMeta> = {
  // Frontend
  react: { icon: SiReact, color: '#61DAFB', bgColor: 'rgba(97, 218, 251, 0.12)', borderColor: 'rgba(97, 218, 251, 0.3)' },
  'react native': { icon: SiReact, color: '#61DAFB', bgColor: 'rgba(97, 218, 251, 0.12)', borderColor: 'rgba(97, 218, 251, 0.3)' },
  'next.js': { icon: SiNextdotjs, color: '#FFFFFF', bgColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' },
  nextjs: { icon: SiNextdotjs, color: '#FFFFFF', bgColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' },
  typescript: { icon: SiTypescript, color: '#3178C6', bgColor: 'rgba(49, 120, 198, 0.15)', borderColor: 'rgba(49, 120, 198, 0.35)' },
  javascript: { icon: SiJavascript, color: '#F7DF1E', bgColor: 'rgba(247, 223, 30, 0.15)', borderColor: 'rgba(247, 223, 30, 0.35)' },
  js: { icon: SiJavascript, color: '#F7DF1E', bgColor: 'rgba(247, 223, 30, 0.15)', borderColor: 'rgba(247, 223, 30, 0.35)' },
  ts: { icon: SiTypescript, color: '#3178C6', bgColor: 'rgba(49, 120, 198, 0.15)', borderColor: 'rgba(49, 120, 198, 0.35)' },
  html: { icon: SiHtml5, color: '#E34F26', bgColor: 'rgba(227, 79, 38, 0.15)', borderColor: 'rgba(227, 79, 38, 0.35)' },
  'html / css': { icon: SiHtml5, color: '#E34F26', bgColor: 'rgba(227, 79, 38, 0.15)', borderColor: 'rgba(227, 79, 38, 0.35)' },
  html5: { icon: SiHtml5, color: '#E34F26', bgColor: 'rgba(227, 79, 38, 0.15)', borderColor: 'rgba(227, 79, 38, 0.35)' },
  css: { icon: TbBrandCss3, color: '#1572B6', bgColor: 'rgba(21, 114, 182, 0.15)', borderColor: 'rgba(21, 114, 182, 0.35)' },
  css3: { icon: TbBrandCss3, color: '#1572B6', bgColor: 'rgba(21, 114, 182, 0.15)', borderColor: 'rgba(21, 114, 182, 0.35)' },
  tailwind: { icon: SiTailwindcss, color: '#06B6D4', bgColor: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.35)' },
  'tailwind css': { icon: SiTailwindcss, color: '#06B6D4', bgColor: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.35)' },
  vite: { icon: SiVite, color: '#646CFF', bgColor: 'rgba(100, 108, 255, 0.15)', borderColor: 'rgba(100, 108, 255, 0.35)' },
  expo: { icon: SiExpo, color: '#000000', bgColor: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.3)' },
  'framer motion': { icon: SiFramer, color: '#0055FF', bgColor: 'rgba(0, 85, 255, 0.15)', borderColor: 'rgba(0, 85, 255, 0.35)' },

  // Backend & Databases
  python: { icon: SiPython, color: '#3776AB', bgColor: 'rgba(55, 118, 171, 0.15)', borderColor: 'rgba(55, 118, 171, 0.35)' },
  django: { icon: SiDjango, color: '#092E20', bgColor: 'rgba(9, 46, 32, 0.3)', borderColor: 'rgba(43, 138, 89, 0.4)' },
  'django / python': { icon: SiDjango, color: '#44B78B', bgColor: 'rgba(68, 183, 139, 0.15)', borderColor: 'rgba(68, 183, 139, 0.35)' },
  drf: { icon: SiDjango, color: '#A30000', bgColor: 'rgba(163, 0, 0, 0.15)', borderColor: 'rgba(163, 0, 0, 0.35)' },
  flask: { icon: SiFlask, color: '#FFFFFF', bgColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' },
  'node.js': { icon: SiNodedotjs, color: '#5FA04E', bgColor: 'rgba(95, 160, 78, 0.15)', borderColor: 'rgba(95, 160, 78, 0.35)' },
  nodejs: { icon: SiNodedotjs, color: '#5FA04E', bgColor: 'rgba(95, 160, 78, 0.15)', borderColor: 'rgba(95, 160, 78, 0.35)' },
  express: { icon: SiExpress, color: '#FFFFFF', bgColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' },
  postgresql: { icon: SiPostgresql, color: '#4169E1', bgColor: 'rgba(65, 105, 225, 0.15)', borderColor: 'rgba(65, 105, 225, 0.35)' },
  postgres: { icon: SiPostgresql, color: '#4169E1', bgColor: 'rgba(65, 105, 225, 0.15)', borderColor: 'rgba(65, 105, 225, 0.35)' },
  'sql / postgresql': { icon: SiPostgresql, color: '#4169E1', bgColor: 'rgba(65, 105, 225, 0.15)', borderColor: 'rgba(65, 105, 225, 0.35)' },
  supabase: { icon: SiSupabase, color: '#3ECF8E', bgColor: 'rgba(62, 207, 142, 0.15)', borderColor: 'rgba(62, 207, 142, 0.35)' },
  mongodb: { icon: SiMongodb, color: '#47A248', bgColor: 'rgba(71, 162, 72, 0.15)', borderColor: 'rgba(71, 162, 72, 0.35)' },
  redis: { icon: SiRedis, color: '#DC382D', bgColor: 'rgba(220, 56, 45, 0.15)', borderColor: 'rgba(220, 56, 45, 0.35)' },
  firebase: { icon: SiFirebase, color: '#DD2C00', bgColor: 'rgba(221, 44, 0, 0.15)', borderColor: 'rgba(221, 44, 0, 0.35)' },
  graphql: { icon: SiGraphql, color: '#E10098', bgColor: 'rgba(225, 0, 152, 0.15)', borderColor: 'rgba(225, 0, 152, 0.35)' },
  jwt: { icon: SiJsonwebtokens, color: '#D63AF9', bgColor: 'rgba(214, 58, 249, 0.15)', borderColor: 'rgba(214, 58, 249, 0.35)' },

  // AI, Web3, DevOps & Tools
  tensorflow: { icon: SiTensorflow, color: '#FF6F00', bgColor: 'rgba(255, 111, 0, 0.15)', borderColor: 'rgba(255, 111, 0, 0.35)' },
  web3: { icon: SiSolidity, color: '#F16822', bgColor: 'rgba(241, 104, 34, 0.15)', borderColor: 'rgba(241, 104, 34, 0.35)' },
  blockchain: { icon: SiSolidity, color: '#363636', bgColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' },
  solidity: { icon: SiSolidity, color: '#363636', bgColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' },
  docker: { icon: SiDocker, color: '#2496ED', bgColor: 'rgba(36, 150, 237, 0.15)', borderColor: 'rgba(36, 150, 237, 0.35)' },
  git: { icon: SiGit, color: '#F05032', bgColor: 'rgba(240, 80, 50, 0.15)', borderColor: 'rgba(240, 80, 50, 0.35)' },
  github: { icon: SiGithub, color: '#FFFFFF', bgColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' },
  'git / github': { icon: SiGit, color: '#F05032', bgColor: 'rgba(240, 80, 50, 0.15)', borderColor: 'rgba(240, 80, 50, 0.35)' },
  'vs code': { icon: TbBrandVscode, color: '#007ACC', bgColor: 'rgba(0, 122, 204, 0.15)', borderColor: 'rgba(0, 122, 204, 0.35)' },
  postman: { icon: SiPostman, color: '#FF6C37', bgColor: 'rgba(255, 108, 55, 0.15)', borderColor: 'rgba(255, 108, 55, 0.35)' },
  dbeaver: { icon: SiDbeaver, color: '#382923', bgColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' },
  zapier: { icon: SiZapier, color: '#FF4A00', bgColor: 'rgba(255, 74, 0, 0.15)', borderColor: 'rgba(255, 74, 0, 0.35)' },
  antigravity: { icon: Terminal, color: '#6366F1', bgColor: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.35)' },
  chatgpt: { icon: SiOpenai, color: '#10A37F', bgColor: 'rgba(16, 163, 127, 0.15)', borderColor: 'rgba(16, 163, 127, 0.35)' },
  vercel: { icon: SiVercel, color: '#FFFFFF', bgColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.25)' },
  wordpress: { icon: SiWordpress, color: '#21759B', bgColor: 'rgba(33, 117, 155, 0.15)', borderColor: 'rgba(33, 117, 155, 0.35)' },

  // Languages & Other
  'c++': { icon: SiCplusplus, color: '#00599C', bgColor: 'rgba(0, 89, 156, 0.15)', borderColor: 'rgba(0, 89, 156, 0.35)' },
  rust: { icon: SiRust, color: '#000000', bgColor: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.3)' },
  go: { icon: SiGo, color: '#00ADD8', bgColor: 'rgba(0, 173, 216, 0.15)', borderColor: 'rgba(0, 173, 216, 0.35)' },
  php: { icon: SiPhp, color: '#777BB4', bgColor: 'rgba(119, 123, 180, 0.15)', borderColor: 'rgba(119, 123, 180, 0.35)' },
  ruby: { icon: SiRuby, color: '#CC342D', bgColor: 'rgba(204, 52, 45, 0.15)', borderColor: 'rgba(204, 52, 45, 0.35)' },
  swift: { icon: SiSwift, color: '#F05138', bgColor: 'rgba(240, 81, 56, 0.15)', borderColor: 'rgba(240, 81, 56, 0.35)' },
  kotlin: { icon: SiKotlin, color: '#7F52FF', bgColor: 'rgba(127, 82, 255, 0.15)', borderColor: 'rgba(127, 82, 255, 0.35)' },
  dart: { icon: SiDart, color: '#0175C2', bgColor: 'rgba(1, 117, 194, 0.15)', borderColor: 'rgba(1, 117, 194, 0.35)' },
  websockets: { icon: Globe, color: '#00D8FF', bgColor: 'rgba(0, 216, 255, 0.15)', borderColor: 'rgba(0, 216, 255, 0.35)' },
  bruno: { icon: Wrench, color: '#F26522', bgColor: 'rgba(242, 101, 34, 0.15)', borderColor: 'rgba(242, 101, 34, 0.35)' },
};

export function getTechMeta(name: string): TechMeta {
  const normalized = name.trim().toLowerCase();
  if (TECH_MAP[normalized]) {
    return TECH_MAP[normalized];
  }

  // Substring match attempt
  for (const [key, meta] of Object.entries(TECH_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return meta;
    }
  }

  return {
    icon: Code2,
    color: '#818CF8',
    bgColor: 'rgba(129, 140, 248, 0.15)',
    borderColor: 'rgba(129, 140, 248, 0.3)',
  };
}

export function TechIcon({ name, className = 'w-4 h-4' }: { name: string; className?: string }) {
  const meta = getTechMeta(name);
  const Icon = meta.icon;
  return <Icon className={className} style={{ color: meta.color }} />;
}

export interface TechBadgeProps {
  name: string;
  onClick?: (e: React.MouseEvent) => void;
  isActive?: boolean;
  size?: 'sm' | 'md';
}

export function TechBadge({ name, onClick, isActive, size = 'sm' }: TechBadgeProps) {
  const meta = getTechMeta(name);
  const Icon = meta.icon;

  const isSmall = size === 'sm';

  return (
    <span
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`Technology: ${name}`}
      style={{
        backgroundColor: isActive ? meta.bgColor : undefined,
        borderColor: isActive ? meta.borderColor : undefined,
      }}
      className={`inline-flex items-center gap-1.5 font-mono font-medium rounded-full border transition-all duration-200 select-none ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'
      } ${
        isSmall ? 'px-2.5 py-0.5 text-[11px] sm:text-xs' : 'px-3 py-1 text-xs sm:text-sm'
      } ${
        isActive
          ? 'text-white font-semibold shadow-sm'
          : 'bg-white/5 dark:bg-white/5 border-white/10 text-foreground/90 dark:text-gray-200 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <Icon className={isSmall ? 'w-3.5 h-3.5 shrink-0' : 'w-4 h-4 shrink-0'} style={{ color: meta.color }} />
      <span>{name}</span>
    </span>
  );
}
