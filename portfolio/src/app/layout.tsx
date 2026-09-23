import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { supabase } from "@/lib/supabase";
import { fetchPersonalInfo } from "@/lib/portfolioData";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const defaultTitle = "Wajahat Ali | Portfolio";
  const defaultDescription = "Software Engineer & Developer Portfolio";

  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error || !data) {
      return {
        title: defaultTitle,
        description: defaultDescription,
      };
    }

    const settings: Record<string, string> = {};
    for (const row of data) {
      if (row.key.startsWith("seo_")) {
        settings[row.key] = row.value;
      }
    }

    const title = settings.seo_title || defaultTitle;
    const description = settings.seo_description || defaultDescription;
    const keywords = settings.seo_keywords
      ? settings.seo_keywords.split(",").map((k) => k.trim())
      : undefined;
    const author = settings.seo_author || undefined;
    const canonicalUrl = settings.seo_canonical_url || undefined;
    const ogTitle = settings.seo_og_title || title;
    const ogDescription = settings.seo_og_description || description;
    const ogImageUrl = settings.seo_og_image_url || undefined;
    const twitterCard =
      (settings.seo_twitter_card as "summary" | "summary_large_image") ||
      "summary_large_image";
    const robots = settings.seo_robots || "index, follow";

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wajahatali.dev";

    return {
      metadataBase: new URL(siteUrl),
      title,
      description,
      keywords,
      authors: author ? [{ name: author }] : undefined,
      alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
      robots,
      openGraph: {
        title: ogTitle,
        description: ogDescription,
        images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
        type: "website",
      },
      twitter: {
        card: twitterCard,
        title: ogTitle,
        description: ogDescription,
        images: ogImageUrl ? [ogImageUrl] : undefined,
      },
    };
  } catch {
    return {
      title: defaultTitle,
      description: defaultDescription,
    };
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personalInfo = await fetchPersonalInfo();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wajahatali.dev";

  return (
    <html lang="en" className={`${inter.variable} dark antialiased scroll-smooth`}>
      <body className="bg-background text-foreground min-h-screen flex flex-col font-sans">
        {personalInfo && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: personalInfo.fullName,
                url: siteUrl,
                sameAs: [
                  personalInfo.githubUrl,
                  personalInfo.linkedinUrl,
                  personalInfo.twitterUrl,
                  personalInfo.portfolioUrl,
                ].filter(Boolean),
                jobTitle: personalInfo.role,
                description: personalInfo.bio,
              }),
            }}
          />
        )}
        {children}
      </body>
    </html>
  );
}
