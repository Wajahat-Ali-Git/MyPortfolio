import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { supabase } from "@/lib/supabase";

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

    return {
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark antialiased scroll-smooth`}>
      <body className="bg-background text-foreground min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
