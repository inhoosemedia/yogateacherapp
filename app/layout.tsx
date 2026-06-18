import { GoogleAnalytics } from "@/components/google-analytics";
import {
  JsonLd,
  organizationSchema,
  softwareAppSchema,
} from "@/components/seo/json-ld";
import { Toaster } from "@/components/ui/sonner";
import { Fraunces, Inter } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "../components/provider";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.yogateacherapp.com"),
  title: {
    default: "Yoga & Pilates Studio Management Software | YogaTeacher",
    template: "%s · YogaTeacher",
  },
  description:
    "Run your yoga or pilates studio from one platform. Manage bookings, memberships, payments, instructors and clients with YogaTeacher. 30-day free trial, no credit card.",
  alternates: {
    canonical: "https://www.yogateacherapp.com",
  },
  openGraph: {
    title: "Yoga & Pilates Studio Management Software | YogaTeacher",
    description:
      "Run your yoga or pilates studio from one platform. Manage bookings, memberships, payments, instructors and clients.",
    url: "https://www.yogateacherapp.com",
    siteName: "YogaTeacher",
    type: "website",
    images: [{ url: "/logo.png", width: 500, height: 500, alt: "YogaTeacher" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoga & Pilates Studio Management Software | YogaTeacher",
    description:
      "Bookings, memberships, payments, instructors. One calm app for yoga teachers and boutique studios.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
        <GoogleAnalytics />
        <JsonLd data={organizationSchema} />
        <JsonLd data={softwareAppSchema} />
      </body>
    </html>
  );
}
