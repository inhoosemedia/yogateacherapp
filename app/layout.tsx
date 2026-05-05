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
  metadataBase: new URL("https://yogateacherapp.com"),
  title: {
    default: "YogaTeacher — Mindbody for the rest of us",
    template: "%s · YogaTeacher",
  },
  description:
    "Stop running your yoga business on WhatsApp + Sheets + Venmo. Members, classes, packages and bookings — in one calm app for yoga teachers and boutique studios.",
  openGraph: {
    title: "YogaTeacher — Mindbody for the rest of us",
    description:
      "Run your yoga business from one calm inbox. 30 days free, no demo calls, no contracts.",
    url: "https://yogateacherapp.com",
    siteName: "YogaTeacher",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YogaTeacher — Mindbody for the rest of us",
    description:
      "Run your yoga business from one calm inbox. 30 days free, no demo calls.",
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
      </body>
    </html>
  );
}
