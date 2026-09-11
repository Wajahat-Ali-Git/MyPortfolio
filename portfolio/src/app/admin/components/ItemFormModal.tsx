'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, Check, AlertCircle, RefreshCw } from 'lucide-react';

export type AdminResourceType =
  | 'projects'
  | 'experiences'
  | 'skills'
  | 'tools'
  | 'certifications'
  | 'spoken_languages'
  | 'personal_info';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: AdminResourceType;
  initialData?: any;
  onSave: (data: any) => Promise<boolean>;
}

// Helper: Convert string to kebab-case slug
function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper: Check URL validity
function isValidUrl(urlStr: string): boolean {
  if (!urlStr || urlStr.trim() === '') return true;
  try {
    const url = new URL(urlStr);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// ─── Tag Chips Input Component ────────────────────────────────────────────────
function TagChipsInput({
  tags,
  onChange,
  placeholder = 'Add tag and press Enter...',
  label,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
}) {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-xs font-semibold text-gray-300">{label}</label>}
      <div className="flex flex-wrap gap-2 p-2.5 bg-[#0a0a16] border border-white/10 rounded-xl min-h-[46px] items-center focus-within:border-cyan-500/80 transition-colors">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-cyan-400 hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : 'Add more...'}
          className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none min-w-[120px]"
        />
      </div>
    </div>
  );
}

export default function ItemFormModal({
  isOpen,
  onClose,
  resource,
  initialData,
  onSave,
}: ItemFormModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
      // Default initial states per resource
      switch (resource) {
        case 'projects':
          setFormData({
            title: '',
            slug: '',
            description: '',
            github_url: '',
            live_url: '',
            featured: false,
            color: 'purple',
            tech_stack: [],
            display_order: 0,
            is_visible: true,
          });
          break;
        case 'experiences':
          setFormData({
            company_name: '',
            company_slug: '',
            role: '',
            location: '',
            start_date: new Date().toISOString().split('T')[0],
            end_date: '',
            is_current: false,
            description: '',
            achievements: [],
            tech_stack: [],
            display_order: 0,
            is_visible: true,
          });
          break;
        case 'skills':
          setFormData({
            name: '',
            category: 'framework',
            proficiency: 80,
            icon: '',
            display_order: 0,
            is_visible: true,
          });
          break;
        case 'tools':
          setFormData({
            name: '',
            category: 'editor',
            website_url: '',
            display_order: 0,
            is_visible: true,
          });
          break;
        case 'certifications':
          setFormData({
            title: '',
            provider: '',
            certificate_type: 'online',
            credential_url: '',
            display_order: 0,
            is_visible: true,
          });
          break;
        case 'spoken_languages':
          setFormData({
            language_code: '',
            language_name: '',
            proficiency: 'intermediate',
            flag_emoji: '🌐',
            display_order: 0,
            is_visible: true,
          });
          break;
        case 'personal_info':
          setFormData({
            full_name: '',
            role: '',
            bio: '',
            email: '',
            phone: '',
            location: '',
            github_url: '',
            linkedin_url: '',
            twitter_url: '',
            portfolio_url: '',
            profile_image_url: '',
            resume_url: '',
            availability_status: 'Available for opportunities',
          });
          break;
      }
    }
    setErrors({});
  }, [initialData, resource, isOpen]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = { ...prev, [field]: value };

      // Auto generate slug when title or company_name changes if user hasn't explicitly customized slug
      if (field === 'title' && resource === 'projects' && !prev.id) {
        updated.slug = toKebabCase(value);
      }
      if (field === 'company_name' && resource === 'experiences' && !prev.id) {
        updated.company_slug = toKebabCase(value);
      }

      return updated;
    });

    // Clear error for that field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // ── Validation Engine ────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (resource === 'projects') {
      if (!formData.title?.trim()) newErrors.title = 'Project title is required';
      if (!formData.slug?.trim()) newErrors.slug = 'Project slug is required';
      if (!formData.description?.trim()) newErrors.description = 'Description is required';
      if (formData.github_url && !isValidUrl(formData.github_url)) {
        newErrors.github_url = 'Must be a valid HTTP/HTTPS URL';
      }
      if (formData.live_url && !isValidUrl(formData.live_url)) {
        newErrors.live_url = 'Must be a valid HTTP/HTTPS URL';
      }
    } else if (resource === 'experiences') {
      if (!formData.company_name?.trim()) newErrors.company_name = 'Company name is required';
      if (!formData.company_slug?.trim()) newErrors.company_slug = 'Company slug is required';
      if (!formData.role?.trim()) newErrors.role = 'Role is required';
      if (!formData.start_date?.trim()) newErrors.start_date = 'Start date is required';
      if (!formData.description?.trim()) newErrors.description = 'Description is required';
    } else if (resource === 'skills') {
      if (!formData.name?.trim()) newErrors.name = 'Skill name is required';
      if (formData.proficiency === undefined || formData.proficiency === null || isNaN(formData.proficiency)) {
        newErrors.proficiency = 'Proficiency percentage is required';
      } else if (formData.proficiency < 0 || formData.proficiency > 100) {
        newErrors.proficiency = 'Proficiency must be between 0 and 100';
      }
    } else if (resource === 'tools') {
      if (!formData.name?.trim()) newErrors.name = 'Tool name is required';
      if (formData.website_url && !isValidUrl(formData.website_url)) {
        newErrors.website_url = 'Must be a valid HTTP/HTTPS URL';
      }
    } else if (resource === 'certifications') {
      if (!formData.title?.trim()) newErrors.title = 'Certificate title is required';
      if (!formData.provider?.trim()) newErrors.provider = 'Provider is required';
      if (formData.credential_url && !isValidUrl(formData.credential_url)) {
        newErrors.credential_url = 'Must be a valid HTTP/HTTPS URL';
      }
    } else if (resource === 'spoken_languages') {
      if (!formData.language_code?.trim()) newErrors.language_code = 'Language code is required (e.g. en, ur)';
      if (!formData.language_name?.trim()) newErrors.language_name = 'Language name is required';
    } else if (resource === 'personal_info') {
      if (!formData.full_name?.trim()) newErrors.full_name = 'Full name is required';
      if (!formData.role?.trim()) newErrors.role = 'Role is required';
      if (formData.github_url && !isValidUrl(formData.github_url)) newErrors.github_url = 'Invalid URL';
      if (formData.linkedin_url && !isValidUrl(formData.linkedin_url)) newErrors.linkedin_url = 'Invalid URL';
      if (formData.twitter_url && !isValidUrl(formData.twitter_url)) newErrors.twitter_url = 'Invalid URL';
      if (formData.portfolio_url && !isValidUrl(formData.portfolio_url)) newErrors.portfolio_url = 'Invalid URL';
      if (formData.profile_image_url && !isValidUrl(formData.profile_image_url)) newErrors.profile_image_url = 'Invalid URL';
      if (formData.resume_url && !isValidUrl(formData.resume_url)) newErrors.resume_url = 'Invalid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const success = await onSave(formData);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#121226] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-8 text-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a16]/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white capitalize">
                {initialData ? `Edit ${resource.replace('_', ' ')}` : `Add New ${resource.replace('_', ' ')}`}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* ── PROJECTS FORM ── */}
            {resource === 'projects' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Project Title *</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="e.g. CARSAGE Mobile App"
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.title ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.title && <p className="text-[11px] text-red-400 mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Slug *</label>
                    <div className="relative mt-1 flex items-center">
                      <input
                        type="text"
                        value={formData.slug || ''}
                        onChange={(e) => handleChange('slug', e.target.value)}
                        placeholder="carsage-app"
                        className={`w-full bg-[#0a0a16] border rounded-xl pl-3.5 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                          errors.slug ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleChange('slug', toKebabCase(formData.title || ''))}
                        title="Auto-generate slug from title"
                        className="absolute right-2 text-gray-400 hover:text-cyan-400"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {errors.slug && <p className="text-[11px] text-red-400 mt-1">{errors.slug}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Description *</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Provide a detailed project overview..."
                    className={`w-full mt-1 bg-[#0a0a16] border rounded-xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none ${
                      errors.description ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                    }`}
                  />
                  {errors.description && <p className="text-[11px] text-red-400 mt-1">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">GitHub URL</label>
                    <input
                      type="text"
                      value={formData.github_url || ''}
                      onChange={(e) => handleChange('github_url', e.target.value)}
                      placeholder="https://github.com/..."
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.github_url ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.github_url && <p className="text-[11px] text-red-400 mt-1">{errors.github_url}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Live Demo URL</label>
                    <input
                      type="text"
                      value={formData.live_url || ''}
                      onChange={(e) => handleChange('live_url', e.target.value)}
                      placeholder="https://..."
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.live_url ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.live_url && <p className="text-[11px] text-red-400 mt-1">{errors.live_url}</p>}
                  </div>
                </div>

                <TagChipsInput
                  label="Technologies / Tech Stack"
                  tags={formData.tech_stack || []}
                  onChange={(tags) => handleChange('tech_stack', tags)}
                  placeholder="e.g. React, Next.js, PostgreSQL (press Enter)"
                />

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Theme Color</label>
                    <select
                      value={formData.color || 'purple'}
                      onChange={(e) => handleChange('color', e.target.value)}
                      className="w-full mt-1 bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/80"
                    >
                      <option value="purple">Purple</option>
                      <option value="blue">Blue</option>
                      <option value="teal">Teal</option>
                      <option value="orange">Orange</option>
                      <option value="green">Green</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-6 pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 select-none">
                      <input
                        type="checkbox"
                        checked={formData.featured || false}
                        onChange={(e) => handleChange('featured', e.target.checked)}
                        className="rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-0 w-4 h-4"
                      />
                      <span>Featured</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 select-none">
                      <input
                        type="checkbox"
                        checked={formData.is_visible ?? true}
                        onChange={(e) => handleChange('is_visible', e.target.checked)}
                        className="rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-0 w-4 h-4"
                      />
                      <span>Visible</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* ── EXPERIENCES FORM ── */}
            {resource === 'experiences' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Company Name *</label>
                    <input
                      type="text"
                      value={formData.company_name || ''}
                      onChange={(e) => handleChange('company_name', e.target.value)}
                      placeholder="e.g. DevFlovv"
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.company_name ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.company_name && <p className="text-[11px] text-red-400 mt-1">{errors.company_name}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Company Slug *</label>
                    <div className="relative mt-1 flex items-center">
                      <input
                        type="text"
                        value={formData.company_slug || ''}
                        onChange={(e) => handleChange('company_slug', e.target.value)}
                        placeholder="devflovv"
                        className={`w-full bg-[#0a0a16] border rounded-xl pl-3.5 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                          errors.company_slug ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleChange('company_slug', toKebabCase(formData.company_name || ''))}
                        title="Auto-generate slug"
                        className="absolute right-2 text-gray-400 hover:text-cyan-400"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {errors.company_slug && <p className="text-[11px] text-red-400 mt-1">{errors.company_slug}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Role / Job Title *</label>
                    <input
                      type="text"
                      value={formData.role || ''}
                      onChange={(e) => handleChange('role', e.target.value)}
                      placeholder="e.g. Associate Software Engineer"
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.role ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.role && <p className="text-[11px] text-red-400 mt-1">{errors.role}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Location</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="e.g. Lahore, Pakistan"
                      className="w-full mt-1 bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Start Date *</label>
                    <input
                      type="date"
                      value={formData.start_date || ''}
                      onChange={(e) => handleChange('start_date', e.target.value)}
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none ${
                        errors.start_date ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.start_date && <p className="text-[11px] text-red-400 mt-1">{errors.start_date}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">End Date</label>
                    <input
                      type="date"
                      disabled={formData.is_current}
                      value={formData.is_current ? '' : formData.end_date || ''}
                      onChange={(e) => handleChange('end_date', e.target.value)}
                      className="w-full mt-1 bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/80 disabled:opacity-40"
                    />
                  </div>

                  <div className="pb-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 select-none">
                      <input
                        type="checkbox"
                        checked={formData.is_current || false}
                        onChange={(e) => handleChange('is_current', e.target.checked)}
                        className="rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-0 w-4 h-4"
                      />
                      <span>Currently Working Here</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Description *</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Describe main responsibilities..."
                    className={`w-full mt-1 bg-[#0a0a16] border rounded-xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none ${
                      errors.description ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                    }`}
                  />
                  {errors.description && <p className="text-[11px] text-red-400 mt-1">{errors.description}</p>}
                </div>

                <TagChipsInput
                  label="Key Achievements / Bullet points"
                  tags={formData.achievements || []}
                  onChange={(tags) => handleChange('achievements', tags)}
                  placeholder="e.g. Reduced query execution by 40% (press Enter)"
                />

                <TagChipsInput
                  label="Technologies Used"
                  tags={formData.tech_stack || []}
                  onChange={(tags) => handleChange('tech_stack', tags)}
                  placeholder="e.g. React, PostgreSQL, Docker"
                />
              </>
            )}

            {/* ── SKILLS FORM ── */}
            {resource === 'skills' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Skill Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g. TypeScript"
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.name ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Category *</label>
                    <select
                      value={formData.category || 'framework'}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full mt-1 bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/80"
                    >
                      <option value="language">Programming Language</option>
                      <option value="framework">Framework / Library</option>
                      <option value="database">Database</option>
                      <option value="tool">Developer Tool</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 flex justify-between">
                      <span>Proficiency (%) *</span>
                      <span className="text-cyan-400 font-mono">{formData.proficiency || 0}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.proficiency ?? 80}
                      onChange={(e) => handleChange('proficiency', parseInt(e.target.value, 10))}
                      className="w-full mt-2 accent-cyan-500 cursor-pointer"
                    />
                    {errors.proficiency && <p className="text-[11px] text-red-400 mt-1">{errors.proficiency}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Icon / Class Name</label>
                    <input
                      type="text"
                      value={formData.icon || ''}
                      onChange={(e) => handleChange('icon', e.target.value)}
                      placeholder="e.g. SiTypescript"
                      className="w-full mt-1 bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── TOOLS FORM ── */}
            {resource === 'tools' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Tool Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g. Postman"
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.name ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Category</label>
                    <select
                      value={formData.category || 'editor'}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full mt-1 bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/80"
                    >
                      <option value="editor">IDE / Code Editor</option>
                      <option value="database">Database Tool</option>
                      <option value="api">API Client</option>
                      <option value="automation">Automation & CI/CD</option>
                      <option value="design">UI & Design</option>
                      <option value="other">Other Software</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Website URL</label>
                  <input
                    type="text"
                    value={formData.website_url || ''}
                    onChange={(e) => handleChange('website_url', e.target.value)}
                    placeholder="https://www.postman.com"
                    className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                      errors.website_url ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                    }`}
                  />
                  {errors.website_url && <p className="text-[11px] text-red-400 mt-1">{errors.website_url}</p>}
                </div>
              </>
            )}

            {/* ── CERTIFICATIONS FORM ── */}
            {resource === 'certifications' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Certificate Title *</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="e.g. Introduction to JavaScript"
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.title ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.title && <p className="text-[11px] text-red-400 mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Provider *</label>
                    <input
                      type="text"
                      value={formData.provider || ''}
                      onChange={(e) => handleChange('provider', e.target.value)}
                      placeholder="e.g. Google, Great Learning"
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.provider ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.provider && <p className="text-[11px] text-red-400 mt-1">{errors.provider}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Certificate Type</label>
                    <select
                      value={formData.certificate_type || 'online'}
                      onChange={(e) => handleChange('certificate_type', e.target.value)}
                      className="w-full mt-1 bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/80"
                    >
                      <option value="online">Online Course</option>
                      <option value="internship">Internship</option>
                      <option value="degree">Degree / Diploma</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Credential / Verify URL</label>
                    <input
                      type="text"
                      value={formData.credential_url || ''}
                      onChange={(e) => handleChange('credential_url', e.target.value)}
                      placeholder="https://..."
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.credential_url ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.credential_url && <p className="text-[11px] text-red-400 mt-1">{errors.credential_url}</p>}
                  </div>
                </div>
              </>
            )}

            {/* ── SPOKEN LANGUAGES FORM ── */}
            {resource === 'spoken_languages' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Language Code *</label>
                    <input
                      type="text"
                      value={formData.language_code || ''}
                      onChange={(e) => handleChange('language_code', e.target.value.toLowerCase())}
                      placeholder="e.g. en, ur, hi"
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.language_code ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.language_code && <p className="text-[11px] text-red-400 mt-1">{errors.language_code}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Language Name *</label>
                    <input
                      type="text"
                      value={formData.language_name || ''}
                      onChange={(e) => handleChange('language_name', e.target.value)}
                      placeholder="e.g. English, Urdu"
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.language_name ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.language_name && <p className="text-[11px] text-red-400 mt-1">{errors.language_name}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Proficiency Level</label>
                    <select
                      value={formData.proficiency || 'intermediate'}
                      onChange={(e) => handleChange('proficiency', e.target.value)}
                      className="w-full mt-1 bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/80"
                    >
                      <option value="native">Native / Bilingual</option>
                      <option value="fluent">Fluent</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="basic">Basic</option>
                      <option value="understand">Can understand spoken</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Flag Emoji</label>
                    <input
                      type="text"
                      value={formData.flag_emoji || ''}
                      onChange={(e) => handleChange('flag_emoji', e.target.value)}
                      placeholder="🇬🇧"
                      className="w-full mt-1 bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── PERSONAL INFO / HERO & SOCIAL LINKS FORM ── */}
            {resource === 'personal_info' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Full Name *</label>
                    <input
                      type="text"
                      value={formData.full_name || ''}
                      onChange={(e) => handleChange('full_name', e.target.value)}
                      placeholder="Wajahat Ali"
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.full_name ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.full_name && <p className="text-[11px] text-red-400 mt-1">{errors.full_name}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Role / Hero Title *</label>
                    <input
                      type="text"
                      value={formData.role || ''}
                      onChange={(e) => handleChange('role', e.target.value)}
                      placeholder="Software Engineer & Developer"
                      className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                        errors.role ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                      }`}
                    />
                    {errors.role && <p className="text-[11px] text-red-400 mt-1">{errors.role}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Availability Status</label>
                  <input
                    type="text"
                    value={formData.availability_status || ''}
                    onChange={(e) => handleChange('availability_status', e.target.value)}
                    placeholder="e.g. Available for opportunities"
                    className="w-full mt-1 bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Hero Bio / About Me</label>
                  <textarea
                    rows={3}
                    value={formData.bio || ''}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    placeholder="Short introduction about your experience and focus..."
                    className="w-full mt-1 bg-[#0a0a16] border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
                  />
                </div>

                <div className="border-t border-white/10 pt-4 mt-2">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">
                    Contact & Social Links
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-300">Email Address</label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="your-email@example.com"
                        className="w-full mt-1 bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/80"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300">GitHub Profile URL</label>
                      <input
                        type="text"
                        value={formData.github_url || ''}
                        onChange={(e) => handleChange('github_url', e.target.value)}
                        placeholder="https://github.com/..."
                        className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                          errors.github_url ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                        }`}
                      />
                      {errors.github_url && <p className="text-[11px] text-red-400 mt-1">{errors.github_url}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300">LinkedIn Profile URL</label>
                      <input
                        type="text"
                        value={formData.linkedin_url || ''}
                        onChange={(e) => handleChange('linkedin_url', e.target.value)}
                        placeholder="https://www.linkedin.com/in/..."
                        className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                          errors.linkedin_url ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                        }`}
                      />
                      {errors.linkedin_url && <p className="text-[11px] text-red-400 mt-1">{errors.linkedin_url}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300">Twitter / X URL</label>
                      <input
                        type="text"
                        value={formData.twitter_url || ''}
                        onChange={(e) => handleChange('twitter_url', e.target.value)}
                        placeholder="https://twitter.com/..."
                        className={`w-full mt-1 bg-[#0a0a16] border rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                          errors.twitter_url ? 'border-red-500' : 'border-white/10 focus:border-cyan-500/80'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Display Order & Visibility (Common fields for items except personal_info) */}
            {resource !== 'personal_info' && (
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-2">
                <div>
                  <label className="text-xs font-semibold text-gray-300">Display Order Index</label>
                  <input
                    type="number"
                    value={formData.display_order ?? 0}
                    onChange={(e) => handleChange('display_order', parseInt(e.target.value, 10) || 0)}
                    className="w-full mt-1 bg-[#0a0a16] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/80"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 select-none">
                    <input
                      type="checkbox"
                      checked={formData.is_visible ?? true}
                      onChange={(e) => handleChange('is_visible', e.target.checked)}
                      className="rounded border-white/20 bg-black/40 text-cyan-500 focus:ring-0 w-4 h-4"
                    />
                    <span>Visible to Visitors</span>
                  </label>
                </div>
              </div>
            )}

            {/* General Submission Error */}
            {Object.keys(errors).length > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>Please fix the highlighted errors above before saving.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xs font-semibold hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>{isSubmitting ? 'Saving...' : 'Save Record'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
