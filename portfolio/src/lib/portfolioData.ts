import { supabase, isSupabaseConfigured } from './supabase';
import {
  PROJECTS as FALLBACK_PROJECTS,
  WORK_HISTORY as FALLBACK_WORK_HISTORY,
  SKILLS as FALLBACK_SKILLS,
  TOOLS as FALLBACK_TOOLS,
  CERTIFICATIONS as FALLBACK_CERTIFICATIONS,
  LANGUAGES as FALLBACK_LANGUAGES,
} from '../constants/contants';

export interface DynamicProject {
  id?: string;
  title: string;
  descKey?: string;
  description?: string;
  tech: string[];
  link: string;
  liveUrl?: string;
  color: string;
  featured?: boolean;
}

export interface DynamicExperience {
  id?: string;
  companyKey?: string;
  companyName?: string;
  roleKey?: string;
  role?: string;
  durationKey?: string;
  duration?: string;
  descKey?: string;
  description?: string;
  achievements?: string[];
  techStack?: string[];
}

export interface DynamicSkill {
  id?: string;
  name: string;
  level: number;
  category?: string;
}

export interface DynamicCertification {
  id?: string;
  titleKey?: string;
  title?: string;
  provider: string;
  typeKey?: string;
  credentialUrl?: string;
}

export interface DynamicPersonalInfo {
  id?: string;
  fullName: string;
  role: string;
  bio: string;
  availabilityStatus: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
}

/**
 * Fetch all visible projects from Supabase with instant fallback to constants
 */
export async function fetchProjects(): Promise<DynamicProject[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_PROJECTS;
    }

    return data.map((item) => {
      let techArray: string[] = [];
      if (Array.isArray(item.tech_stack)) {
        techArray = item.tech_stack;
      } else if (typeof item.tech_stack === 'string') {
        try {
          techArray = JSON.parse(item.tech_stack);
        } catch {
          techArray = [item.tech_stack];
        }
      }

      // Map slug to translation descKey if standard, or use raw description
      const knownDescKeys: Record<string, string> = {
        carsage: 'carsage_desc',
        blogdrf: 'blogdrf_desc',
        'opensea-project': 'opensea_desc',
        'chat-app': 'chatapp_desc',
      };

      return {
        id: item.id,
        title: item.title,
        descKey: knownDescKeys[item.slug] || undefined,
        description: item.description || item.description_en,
        tech: techArray,
        link: item.github_url || item.live_url || '#',
        liveUrl: item.live_url || undefined,
        color: item.color || 'purple',
        featured: item.featured ?? false,
      };
    });
  } catch (err) {
    console.warn('Failed to fetch projects from Supabase, using fallback:', err);
    return FALLBACK_PROJECTS;
  }
}

/**
 * Fetch all visible work experiences from Supabase with instant fallback
 */
export async function fetchExperiences(): Promise<DynamicExperience[]> {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_WORK_HISTORY;
    }

    const knownKeys: Record<string, { companyKey: string; roleKey: string; durationKey: string; descKey: string }> = {
      'cmit-internship': {
        companyKey: 'cmit_company',
        roleKey: 'cmit_role',
        durationKey: 'cmit_duration',
        descKey: 'cmit_desc',
      },
      devflovv: {
        companyKey: 'devflovv_company',
        roleKey: 'devflovv_role',
        durationKey: 'devflovv_duration',
        descKey: 'devflovv_desc',
      },
    };

    return data.map((item) => {
      const mapped = knownKeys[item.company_slug];
      return {
        id: item.id,
        companyKey: mapped?.companyKey,
        companyName: item.company_name,
        roleKey: mapped?.roleKey,
        role: item.role,
        durationKey: mapped?.durationKey,
        duration: item.is_current ? 'Present' : undefined,
        descKey: mapped?.descKey,
        description: item.description,
        achievements: Array.isArray(item.achievements) ? item.achievements : [],
        techStack: Array.isArray(item.tech_stack) ? item.tech_stack : [],
      };
    });
  } catch (err) {
    console.warn('Failed to fetch experiences from Supabase, using fallback:', err);
    return FALLBACK_WORK_HISTORY;
  }
}

/**
 * Fetch technical skills from Supabase with instant fallback
 */
export async function fetchSkills(): Promise<DynamicSkill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_SKILLS;
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      level: item.proficiency,
      category: item.category,
    }));
  } catch (err) {
    console.warn('Failed to fetch skills from Supabase, using fallback:', err);
    return FALLBACK_SKILLS;
  }
}

/**
 * Fetch developer tools from Supabase with instant fallback
 */
export async function fetchTools(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('tools')
      .select('name')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_TOOLS;
    }

    return data.map((item) => item.name);
  } catch (err) {
    console.warn('Failed to fetch tools from Supabase, using fallback:', err);
    return FALLBACK_TOOLS;
  }
}

/**
 * Fetch certifications from Supabase with instant fallback
 */
export async function fetchCertifications(): Promise<DynamicCertification[]> {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_CERTIFICATIONS;
    }

    return data.map((item, index) => ({
      id: item.id,
      titleKey: index < 5 ? (`cert${index + 1}` as const) : undefined,
      title: item.title,
      provider: item.provider,
      typeKey: item.certificate_type || 'online',
      credentialUrl: item.credential_url || undefined,
    }));
  } catch (err) {
    console.warn('Failed to fetch certifications from Supabase, using fallback:', err);
    return FALLBACK_CERTIFICATIONS;
  }
}

// ─── Section Visibility ───────────────────────────────────────────────────────

export interface SectionVisibility {
  projects: boolean;
  github: boolean;
  experience: boolean;
  skills: boolean;
  certifications: boolean;
  languages: boolean;
}

const DEFAULT_VISIBILITY: SectionVisibility = {
  projects: true,
  github: true,
  experience: true,
  skills: true,
  certifications: true,
  languages: true,
};

/**
 * Fetch section visibility settings from the site_settings table.
 * Falls back to all-visible if Supabase is unavailable or the table is empty.
 */
export async function fetchSectionVisibility(): Promise<SectionVisibility> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', [
        'section_projects_visible',
        'section_github_visible',
        'section_experience_visible',
        'section_skills_visible',
        'section_certifications_visible',
        'section_languages_visible',
      ]);

    if (error || !data || data.length === 0) {
      return DEFAULT_VISIBILITY;
    }

    const map: Record<string, string> = {};
    for (const row of data) {
      map[row.key] = row.value;
    }

    return {
      projects:      map['section_projects_visible']      !== 'false',
      github:        map['section_github_visible']        !== 'false',
      experience:    map['section_experience_visible']    !== 'false',
      skills:        map['section_skills_visible']        !== 'false',
      certifications:map['section_certifications_visible']!== 'false',
      languages:     map['section_languages_visible']     !== 'false',
    };
  } catch (err) {
    console.warn('Failed to fetch section visibility from Supabase, using fallback:', err);
    return DEFAULT_VISIBILITY;
  }
}

/**
 * Fetch all dynamic portfolio items concurrently
 */
export async function fetchAllPortfolioData() {
  const [projects, experiences, skills, tools, certifications, sectionVisibility] = await Promise.all([
    fetchProjects(),
    fetchExperiences(),
    fetchSkills(),
    fetchTools(),
    fetchCertifications(),
    fetchSectionVisibility(),
  ]);

  return {
    projects,
    experiences,
    skills,
    tools,
    certifications,
    languages: FALLBACK_LANGUAGES,
    sectionVisibility,
  };
}
