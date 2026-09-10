'use server';

import { supabase } from '@/lib/supabase';
import type {
  AdminProjectInput,
  AdminExperienceInput,
  AdminSkillInput,
  AdminToolInput,
  AdminCertificationInput,
  AdminPersonalInfoInput,
  AdminActionResult,
} from './types';

// =============================================================================
// 1. PROJECTS ADMIN ACTIONS
// =============================================================================

export async function adminUpsertProject(
  input: AdminProjectInput
): Promise<AdminActionResult> {
  try {
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

    const { data, error } = await supabase
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
    const { error } = await supabase.from('projects').delete().eq('id', id);
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

    const { data, error } = await supabase
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
    const { error } = await supabase.from('experiences').delete().eq('id', id);
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
    const payload = {
      name: input.name,
      category: input.category,
      proficiency: input.proficiency,
      icon: input.icon || null,
      display_order: input.display_order ?? 0,
      is_visible: input.is_visible ?? true,
      ...(input.id ? { id: input.id } : {}),
    };

    const { data, error } = await supabase
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
    const { error } = await supabase.from('skills').delete().eq('id', id);
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
    const payload = {
      name: input.name,
      category: input.category || 'other',
      display_order: input.display_order ?? 0,
      is_visible: input.is_visible ?? true,
      ...(input.id ? { id: input.id } : {}),
    };

    const { data, error } = await supabase
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
    const { error } = await supabase.from('tools').delete().eq('id', id);
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
    const payload = {
      title: input.title,
      provider: input.provider,
      certificate_type: input.certificate_type || 'online',
      credential_url: input.credential_url || null,
      display_order: input.display_order ?? 0,
      is_visible: input.is_visible ?? true,
      ...(input.id ? { id: input.id } : {}),
    };

    const { data, error } = await supabase
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
    const { error } = await supabase.from('certifications').delete().eq('id', id);
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
    const payload = {
      full_name: input.full_name,
      role: input.role,
      bio: input.bio || null,
      email: input.email || null,
      github_url: input.github_url || null,
      linkedin_url: input.linkedin_url || null,
      availability_status: input.availability_status || null,
      is_active: true,
      ...(input.id ? { id: input.id } : {}),
    };

    const { data, error } = await supabase
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
