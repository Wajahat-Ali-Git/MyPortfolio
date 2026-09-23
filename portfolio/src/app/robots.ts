import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wajahatali.dev';

  try {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'seo_robots')
      .single();

    // Default to allow all if not specifically set to noindex
    const isNoIndex = data?.value?.includes('noindex');

    return {
      rules: {
        userAgent: '*',
        allow: isNoIndex ? [] : '/',
        disallow: isNoIndex ? '/' : ['/admin', '/api/admin'],
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  } catch {
    // Fallback if DB fails
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin'],
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }
}
