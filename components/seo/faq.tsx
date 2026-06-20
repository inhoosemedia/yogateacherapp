import { JsonLd, faqPageSchema } from "./json-ld";

export type FaqItem = { question: string; answer: string };

export function FaqSection({
  items,
  title = "Frequently asked questions",
}: {
  items: FaqItem[];
  title?: string;
}) {
  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-8">
          {title}
        </h2>
        <div className="space-y-3">
          {items.map((it) => (
            <details
              key={it.question}
              className="group border border-border rounded-2xl bg-card transition-all duration-300 ease-out open:bg-secondary/40 open:shadow-md open:shadow-primary/5 hover:border-primary/30"
            >
              <summary className="px-6 py-5 font-medium cursor-pointer flex items-center justify-between gap-4 list-none [&::-webkit-details-marker]:hidden">
                <span className="transition-colors group-open:text-primary">
                  {it.question}
                </span>
                <span
                  className="size-7 rounded-full border border-border flex items-center justify-center text-muted-foreground transition-all duration-300 group-open:rotate-45 group-open:border-primary group-open:text-primary"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className="grid grid-rows-[1fr] motion-safe:animate-faq-open px-6 pb-6 -mt-1">
                <p className="text-muted-foreground leading-relaxed">
                  {it.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
      <JsonLd data={faqPageSchema(items)} />
    </section>
  );
}
