'use server';

import { supabase, isSupabaseConfigured, createAuthenticatedClient } from '@/lib/supabase';
import type {
  AdminProjectInput,
  AdminExperienceInput,
  AdminSkillInput,
  AdminToolInput,
  AdminCertificationInput,
  AdminPersonalInfoInput,
  AdminLanguageInput,
  AdminActionResult,
} from './types';

// =============================================================================
// AUTH HELPER
// =============================================================================

/**
 * Returns an authenticated Supabase client using the current session token.
 * Server Actions run on the server and need an explicit auth header to satisfy
 * Supabase RLS write policies (auth.role() = 'authenticated').
 *
 * If Supabase is not configured or there is no active session, writes will be
 * rejected by RLS — which is the correct secure-by-default behaviour.
 */
async function getAdminClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session?.access_token) {
    throw new Error('Unauthorized: No active admin session found. Please log in.');
  }

  return createAuthenticatedClient(data.session.access_token);
}

// =============================================================================
// 1. PROJECTS ADMIN ACTIONS
// =============================================================================

export async function adminUpsertProject(
  input: AdminProjectInput
): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();
    const payload = {
      title: input.title,
      slug: input.slug,
      description: input.description,
      github_url: input.github_url || null,
      live_url: input.live_url || null,
      featured: input.featured ?? false,
      color: input.color || 'purple',
      tech_stack: input.tech_stack || [],
      display_order: input.display_order ?? 0,
      is_visible: input.is_visible ?? true,
      ...(input.id ? { id: input.id } : {}),
    };

    const { data, error } = await client
      .from('projects')
      .upsert([payload], { onConflict: 'slug' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('adminUpsertProject error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save project' };
  }
}

export async function adminDeleteProject(id: string): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();
    const { error } = await client.from('projects').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('adminDeleteProject error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete project' };
  }
}

// =============================================================================
// 2. EXPERIENCES ADMIN ACTIONS
// =============================================================================

export async function adminUpsertExperience(
  input: AdminExperienceInput
): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();
    const payload = {
      company_name: input.company_name,
      company_slug: input.company_slug,
      role: input.role,
      location: input.location || null,
      start_date: input.start_date,
      end_date: input.end_date || null,
      is_current: input.is_current ?? false,
      description: input.description,
      achievements: input.achievements || [],
      tech_stack: input.tech_stack || [],
      display_order: input.display_order ?? 0,
      is_visible: input.is_visible ?? true,
      ...(input.id ? { id: input.id } : {}),
    };

    const { data, error } = await client
      .from('experiences')
      .upsert([payload], { onConflict: 'company_slug' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('adminUpsertExperience error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save experience' };
  }
}

export async function adminDeleteExperience(id: string): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();
    const { error } = await client.from('experiences').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('adminDeleteExperience error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete experience' };
  }
}

// =============================================================================
// 3. SKILLS ADMIN ACTIONS
// =============================================================================

export async function adminUpsertSkill(
  input: AdminSkillInput
): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();
    const payload = {
      name: input.name,
      category: input.category,
      proficiency: input.proficiency,
      icon: input.icon || null,
      display_order: input.display_order ?? 0,
      is_visible: input.is_visible ?? true,
      ...(input.id ? { id: input.id } : {}),
    };

    const { data, error } = await client
      .from('skills')
      .upsert([payload], { onConflict: 'name' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('adminUpsertSkill error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save skill' };
  }
}

export async function adminDeleteSkill(id: string): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();
    const { error } = await client.from('skills').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('adminDeleteSkill error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete skill' };
  }
}

// =============================================================================
// 4. TOOLS ADMIN ACTIONS
// =============================================================================

export async function adminUpsertTool(
  input: AdminToolInput
): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();
    const payload = {
      name: input.name,
      category: input.category || 'other',
      display_order: input.display_order ?? 0,
      is_visible: input.is_visible ?? true,
      ...(input.id ? { id: input.id } : {}),
    };

    const { data, error } = await client
      .from('tools')
      .upsert([payload], { onConflict: 'name' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('adminUpsertTool error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save tool' };
  }
}

export async function adminDeleteTool(id: string): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();
    const { error } = await client.from('tools').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('adminDeleteTool error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete tool' };
  }
}

// =============================================================================
// 5. CERTIFICATIONS ADMIN ACTIONS
// =============================================================================

export async function adminUpsertCertification(
  input: AdminCertificationInput
): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();
    const payload = {
      title: input.title,
      provider: input.provider,
      certificate_type: input.certificate_type || 'online',
      credential_url: input.credential_url || null,
      display_order: input.display_order ?? 0,
      is_visible: input.is_visible ?? true,
      ...(input.id ? { id: input.id } : {}),
    };

    const { data, error } = await client
      .from('certifications')
      .upsert([payload])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('adminUpsertCertification error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save certification' };
  }
}

export async function adminDeleteCertification(id: string): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();
    const { error } = await client.from('certifications').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('adminDeleteCertification error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete certification' };
  }
}

// =============================================================================
// 6. PERSONAL INFO ADMIN ACTIONS
// =============================================================================

export async function adminUpdatePersonalInfo(
  input: AdminPersonalInfoInput
): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();
    const payload = {
      full_name: input.full_name,
      role: input.role,
      bio: input.bio || null,
      email: input.email || null,
      phone: input.phone || null,
      location: input.location || null,
      github_url: input.github_url || null,
      linkedin_url: input.linkedin_url || null,
      twitter_url: input.twitter_url || null,
      portfolio_url: input.portfolio_url || null,
      profile_image_url: input.profile_image_url || null,
      resume_url: input.resume_url || null,
      availability_status: input.availability_status || null,
      is_active: true,
      ...(input.id ? { id: input.id } : {}),
    };

    const { data, error } = await client
      .from('personal_info')
      .upsert([payload])
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('adminUpdatePersonalInfo error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update personal info' };
  }
}

// =============================================================================
// 7. SPOKEN LANGUAGES ADMIN ACTIONS
// =============================================================================

export async function adminUpsertLanguage(
  input: AdminLanguageInput
): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();
    const payload = {
      language_code: input.language_code,
      language_name: input.language_name,
      proficiency: input.proficiency,
      flag_emoji: input.flag_emoji || null,
      display_order: input.display_order ?? 0,
      is_visible: input.is_visible ?? true,
      ...(input.id ? { id: input.id } : {}),
    };

    const { data, error } = await client
      .from('spoken_languages')
      .upsert([payload], { onConflict: 'language_code' })
      .select()
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('adminUpsertLanguage error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save spoken language' };
  }
}

export async function adminDeleteLanguage(id: string): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();
    const { error } = await client.from('spoken_languages').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('adminDeleteLanguage error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete spoken language' };
  }
}

// =============================================================================
// 7. SECTION VISIBILITY ADMIN ACTION
// =============================================================================

export interface SectionVisibilityInput {
  projects: boolean;
  github: boolean;
  experience: boolean;
  skills: boolean;
  certifications: boolean;
  languages: boolean;
}

/**
 * Upsert section visibility settings into site_settings.
 * Each section maps to a row: key = 'section_<name>_visible', value = 'true'|'false'.
 */
export async function adminUpdateSectionVisibility(
  input: SectionVisibilityInput
): Promise<AdminActionResult> {
  try {
    const client = await getAdminClient();

    const rows = [
      { key: 'section_projects_visible',       value: String(input.projects) },
      { key: 'section_github_visible',         value: String(input.github) },
      { key: 'section_experience_visible',     value: String(input.experience) },
      { key: 'section_skills_visible',         value: String(input.skills) },
      { key: 'section_certifications_visible', value: String(input.certifications) },
      { key: 'section_languages_visible',      value: String(input.languages) },
    ].map((r) => ({ ...r, updated_at: new Date().toISOString() }));

    const { error } = await client
      .from('site_settings')
      .upsert(rows, { onConflict: 'key' });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('adminUpdateSectionVisibility error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update section visibility' };
  }
}

// =============================================================================
// 8. QUICK TOGGLE VISIBILITY & ORDER UPDATE ACTIONS
// =============================================================================

export type ManageableResource = 'projects' | 'experiences' | 'skills' | 'tools' | 'certifications' | 'languages';

const RESOURCE_TABLE_MAP: Record<ManageableResource, string> = {
  projects: 'projects',
  experiences: 'experiences',
  skills: 'skills',
  tools: 'tools',
  certifications: 'certifications',
  languages: 'spoken_languages',
};

export async function adminToggleItemVisibility(
  resource: ManageableResource,
  id: string,
  is_visible: boolean
): Promise<AdminActionResult> {
  const table = RESOURCE_TABLE_MAP[resource];
  if (!table) return { success: false, error: 'Invalid resource type' };

  try {
    const client = await getAdminClient();
    const { error } = await client.from(table).update({ is_visible }).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error(`adminToggleItemVisibility (${resource}) error:`, err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update visibility' };
  }
}

export async function adminUpdateItemOrder(
  resource: ManageableResource,
  id: string,
  display_order: number
): Promise<AdminActionResult> {
  const table = RESOURCE_TABLE_MAP[resource];
  if (!table) return { success: false, error: 'Invalid resource type' };

  try {
    const client = await getAdminClient();
    const { error } = await client.from(table).update({ display_order }).eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error(`adminUpdateItemOrder (${resource}) error:`, err);
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update position' };
  }
}

