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

function formatMonthYear(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function formatDateRange(startDate?: string | null, endDate?: string | null, isCurrent?: boolean): string {
  if (!startDate) return isCurrent ? 'Present' : '';
  const start = formatMonthYear(startDate);
  if (isCurrent) return `${start} – Present`;
  if (endDate) return `${start} – ${formatMonthYear(endDate)}`;
  return start;
}

/**
 * Fetch all visible projects from Supabase with fallback to constants.
 * Falls back ONLY when Supabase is not configured.
 */
export async function fetchProjects(): Promise<DynamicProject[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_PROJECTS;
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
      .order('id', { ascending: true })
      .limit(100);

    if (error) {
      return FALLBACK_PROJECTS;
    }

    if (!data || data.length === 0) {
      return [];
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

      return {
        id: item.id,
        title: item.title,
        description: item.description || item.description_en,
        tech: techArray,
        link: item.github_url || item.live_url || '#',
        liveUrl: item.live_url || undefined,
        color: item.color || 'purple',
        featured: item.featured ?? false,
      };
    });
  } catch {
    return FALLBACK_PROJECTS;
  }
}

/**
 * Fetch all visible work experiences from Supabase with fallback.
 */
export async function fetchExperiences(): Promise<DynamicExperience[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_WORK_HISTORY;
  }

  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
      .limit(100);

    if (error) {
      return FALLBACK_WORK_HISTORY;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      companyName: item.company_name,
      role: item.role,
      duration: formatDateRange(item.start_date, item.end_date, item.is_current),
      description: item.description,
      achievements: Array.isArray(item.achievements) ? item.achievements : [],
      techStack: Array.isArray(item.tech_stack) ? item.tech_stack : [],
    }));
  } catch {
    return FALLBACK_WORK_HISTORY;
  }
}

/**
 * Fetch technical skills from Supabase with fallback.
 */
export async function fetchSkills(): Promise<DynamicSkill[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_SKILLS;
  }

  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
      .limit(100);

    if (error) {
      return FALLBACK_SKILLS;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      level: item.proficiency,
      category: item.category,
    }));
  } catch {
    return FALLBACK_SKILLS;
  }
}

/**
 * Fetch developer tools from Supabase with fallback.
 */
export async function fetchTools(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_TOOLS;
  }

  try {
    const { data, error } = await supabase
      .from('tools')
      .select('name')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
      .limit(100);

    if (error) {
      return FALLBACK_TOOLS;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => item.name);
  } catch {
    return FALLBACK_TOOLS;
  }
}

/**
 * Fetch certifications from Supabase with fallback.
 */
export async function fetchCertifications(): Promise<DynamicCertification[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_CERTIFICATIONS;
  }

  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
      .limit(100);

    if (error) {
      return FALLBACK_CERTIFICATIONS;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      title: item.title,
      provider: item.provider,
      typeKey: item.certificate_type || 'online',
      credentialUrl: item.credential_url || undefined,
    }));
  } catch {
    return FALLBACK_CERTIFICATIONS;
  }
}

export interface DynamicLanguage {
  id?: string;
  code: string;
  name: string;
  proficiency: string;
  flag?: string;
}

export interface DynamicPersonalInfo {
  id?: string;
  fullName: string;
  role: string;
  bio: string;
  availabilityStatus?: string;
  email?: string;
  phone?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  portfolioUrl?: string;
  profileImageUrl?: string;
  resumeUrl?: string;
}

/**
 * Fetch spoken languages from Supabase with fallback to constants.
 */
export async function fetchSpokenLanguages(): Promise<DynamicLanguage[]> {
  if (!isSupabaseConfigured()) {
    return FALLBACK_LANGUAGES.map((l) => ({
      code: l.nameKey,
      name: l.nameKey === 'english' ? 'English' : l.nameKey === 'urdu' ? 'Urdu' : 'Hindi / Punjabi',
      proficiency: l.proficiencyKey,
      flag: l.flag,
    }));
  }

  try {
    const { data, error } = await supabase
      .from('spoken_languages')
      .select('*')
      .eq('is_visible', true)
      .order('display_order', { ascending: true })
      .limit(50);

    if (error) {
      return FALLBACK_LANGUAGES.map((l) => ({
        code: l.nameKey,
        name: l.nameKey === 'english' ? 'English' : l.nameKey === 'urdu' ? 'Urdu' : 'Hindi / Punjabi',
        proficiency: l.proficiencyKey,
        flag: l.flag,
      }));
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      code: item.language_code,
      name: item.language_name,
      proficiency: item.proficiency,
      flag: item.flag_emoji || undefined,
    }));
  } catch {
    return FALLBACK_LANGUAGES.map((l) => ({
      code: l.nameKey,
      name: l.nameKey === 'english' ? 'English' : l.nameKey === 'urdu' ? 'Urdu' : 'Hindi / Punjabi',
      proficiency: l.proficiencyKey,
      flag: l.flag,
    }));
  }
}

/**
 * Fetch personal info / hero details from Supabase.
 */
export async function fetchPersonalInfo(): Promise<DynamicPersonalInfo | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('personal_info')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      fullName: data.full_name,
      role: data.role,
      bio: data.bio || '',
      availabilityStatus: data.availability_status || '',
      email: data.email || '',
      phone: data.phone || '',
      location: data.location || '',
      githubUrl: data.github_url || '',
      linkedinUrl: data.linkedin_url || '',
      twitterUrl: data.twitter_url || '',
      portfolioUrl: data.portfolio_url || '',
      profileImageUrl: data.profile_image_url || '',
      resumeUrl: data.resume_url || '',
    };
  } catch {
    return null;
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
  if (!isSupabaseConfigured()) {
    return DEFAULT_VISIBILITY;
  }

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

    if (error) {
      return DEFAULT_VISIBILITY;
    }

    if (!data || data.length === 0) {
      return DEFAULT_VISIBILITY;
    }

    const map: Record<string, string> = {};
    for (const row of data) {
      map[row.key] = row.value;
    }

    return {
      projects:       map['section_projects_visible']       !== 'false',
      github:         map['section_github_visible']         !== 'false',
      experience:     map['section_experience_visible']     !== 'false',
      skills:         map['section_skills_visible']         !== 'false',
      certifications: map['section_certifications_visible'] !== 'false',
      languages:      map['section_languages_visible']      !== 'false',
    };
  } catch {
    return DEFAULT_VISIBILITY;
  }
}

/**
 * Fetch all dynamic portfolio items concurrently.
 */
export async function fetchAllPortfolioData() {
  const [projects, experiences, skills, tools, certifications, languages, personalInfo, sectionVisibility] =
    await Promise.all([
      fetchProjects(),
      fetchExperiences(),
      fetchSkills(),
      fetchTools(),
      fetchCertifications(),
      fetchSpokenLanguages(),
      fetchPersonalInfo(),
      fetchSectionVisibility(),
    ]);

  return {
    projects,
    experiences,
    skills,
    tools,
    certifications,
    languages,
    personalInfo,
    sectionVisibility,
  };
}
