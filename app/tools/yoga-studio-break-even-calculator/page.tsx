import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import {
  SeoBreadcrumbs,
  SeoFooter,
  SeoNav,
} from "@/components/seo/page-shell";
import type { Metadata } from "next";
import { BreakEvenCalc } from "./calc";

export const metadata: Metadata = {
  title: "Yoga Studio Break-Even Calculator (Free, No Sign-Up)",
  description:
    "Free yoga studio break-even calculator. Enter rent, instructor pay and class price — get monthly break-even revenue and the number of classes you need to fill to be profitable.",
  alternates: {
    canonical:
      "https://www.yogateacherapp.com/tools/yoga-studio-break-even-calculator",
  },
  openGraph: {
    title: "Yoga Studio Break-Even Calculator",
    description:
      "How many full classes a month do you need to pay rent + instructors? Free calculator, no email required.",
    url: "https://www.yogateacherapp.com/tools/yoga-studio-break-even-calculator",
    type: "website",
  },
};

export default function Page() {
  return (
    <main className="min-h-screen bg-canvas text-foreground">
      <SeoNav />
      <SeoBreadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Free tools", href: "/tools" },
          { label: "Break-even calculator" },
        ]}
      />
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Profitability · Free calculator
          </div>
          <h1 className="font-display text-4xl md:text-6xl tracking-tight leading-[1.05]">
            Yoga studio break-even{" "}
            <span className="italic text-primary">calculator</span>.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            How many classes a month do you need to fill before rent and
            instructor pay are covered? Plug in your numbers — the result
            updates as you type.
          </p>
        </div>
      </section>

      <BreakEvenCalc />

      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="font-display text-3xl tracking-tight mb-5">
          How to use this calculator
        </h2>
        <ol className="space-y-3 text-base text-muted-foreground leading-relaxed list-decimal pl-6">
          <li>
            <strong>Monthly rent + utilities:</strong> total fixed studio cost.
            Include rent, utilities, insurance, and any cleaning service.
          </li>
          <li>
            <strong>Instructor pay per class:</strong> what you pay one teacher
            for one class. Use the average across your team if it varies.
          </li>
          <li>
            <strong>Classes per week:</strong> total weekly classes on your
            schedule across all teachers.
          </li>
          <li>
            <strong>Price per drop-in / class credit:</strong> what one class
            is worth in revenue terms. Use the blended average of drop-ins,
            class-pack credits, and unlimited-membership-attributed revenue.
          </li>
          <li>
            <strong>Capacity per class:</strong> max students one class can
            hold. For reformer pilates this is your bed count.
          </li>
        </ol>
        <p className="mt-6 text-base text-muted-foreground leading-relaxed">
          The calculator multiplies classes-per-week by 4.33 to get a monthly
          run rate, divides total monthly fixed cost by class price, and
          shows the average fill rate per class needed to break even.
        </p>
      </section>

      <SeoFooter />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Yoga Studio Break-Even Calculator",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.yogateacherapp.com/" },
          { name: "Free tools", url: "https://www.yogateacherapp.com/tools" },
          {
            name: "Break-even calculator",
            url: "https://www.yogateacherapp.com/tools/yoga-studio-break-even-calculator",
          },
        ])}
      />
    </main>
  );
}
