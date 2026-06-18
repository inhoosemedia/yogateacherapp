import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/admin",
          "/instructor",
          "/api",
          "/sign-in",
          "/forgot-password",
          "/reset-password",
          "/invite",
          "/onboarding",
        ],
      },
    ],
    sitemap: "https://www.yogateacherapp.com/sitemap.xml",
    host: "https://www.yogateacherapp.com",
  };
}
