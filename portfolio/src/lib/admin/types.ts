export interface AdminProjectInput {
  id?: string;
  title: string;
  slug: string;
  description: string;
  github_url?: string;
  live_url?: string;
  featured?: boolean;
  color?: string;
  tech_stack: string[];
  display_order?: number;
  is_visible?: boolean;
}

export interface AdminExperienceInput {
  id?: string;
  company_name: string;
  company_slug: string;
  role: string;
  location?: string;
  start_date: string;
  end_date?: string | null;
  is_current?: boolean;
  description: string;
  achievements?: string[];
  tech_stack?: string[];
  display_order?: number;
  is_visible?: boolean;
}

export interface AdminSkillInput {
  id?: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'database' | 'other';
  proficiency: number;
  icon?: string;
  display_order?: number;
  is_visible?: boolean;
}

export interface AdminToolInput {
  id?: string;
  name: string;
  category?: 'editor' | 'database' | 'api' | 'automation' | 'design' | 'other';
  display_order?: number;
  is_visible?: boolean;
}

export interface AdminCertificationInput {
  id?: string;
  title: string;
  provider: string;
  certificate_type?: 'online' | 'internship' | 'degree' | 'other';
  credential_url?: string;
  display_order?: number;
  is_visible?: boolean;
}

export interface AdminPersonalInfoInput {
  id?: string;
  full_name: string;
  role: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  portfolio_url?: string;
  profile_image_url?: string;
  resume_url?: string;
  availability_status?: string;
}

export interface AdminLanguageInput {
  id?: string;
  language_code: string;
  language_name: string;
  proficiency: 'native' | 'fluent' | 'intermediate' | 'basic' | 'understand';
  flag_emoji?: string;
  display_order?: number;
  is_visible?: boolean;
}

export interface AdminActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

