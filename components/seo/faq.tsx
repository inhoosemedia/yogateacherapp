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
        <div className="space-y-4">
          {items.map((it) => (
            <details
              key={it.question}
              className="group border border-border rounded-xl p-5 bg-card hover:bg-secondary/30 transition-colors"
            >
              <summary className="font-medium cursor-pointer flex items-center justify-between gap-4">
                <span>{it.question}</span>
                <span className="text-muted-foreground group-open:rotate-45 transition-transform shrink-0">
                  +
                </span>
              </summary>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {it.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
      <JsonLd data={faqPageSchema(items)} />
    </section>
  );
}
