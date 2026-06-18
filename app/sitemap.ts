import type { MetadataRoute } from "next";
import { db } from "@/db/drizzle";
import { studio } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.yogateacherapp.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/yoga-studio-software`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/pilates-studio-software`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/yoga-booking-software`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/pilates-booking-software`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/class-scheduling-software`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/membership-management-software`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/online-payments`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/instructor-management`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/check-in-system`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/multi-location`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/reporting-analytics`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/customer-app`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/vs-mindbody`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/vs-momence`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/vs-wellnessliving`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/vs-vagaro`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/vs-glofox`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/pricing`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/customers`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/sign-up`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${base}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms-of-service`, changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const studios = await db.select({ slug: studio.slug }).from(studio);
    const studioPages: MetadataRoute.Sitemap = studios.map((s) => ({
      url: `${base}/book/${s.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
    return [...staticPages, ...studioPages];
  } catch {
    return staticPages;
  }
}
