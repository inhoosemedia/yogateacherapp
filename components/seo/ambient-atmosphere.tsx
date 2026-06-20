// Hero-area atmospheric layer. Two soft radial gradients in sage and warm
// terracotta, breathing on long cycles. CSS-only — no JS, no canvas, no
// performance cost beyond the GPU compositing already happening for the
// existing decorations. Respects prefers-reduced-motion via globals.css.

export function AmbientAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div
        className="sage-breath absolute -top-32 -right-40 size-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(63, 81, 65, 0.28) 0%, rgba(63, 81, 65, 0) 65%)",
        }}
      />
      <div
        className="terracotta-breath absolute top-40 -left-48 size-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(180, 95, 74, 0.22) 0%, rgba(180, 95, 74, 0) 65%)",
        }}
      />
    </div>
  );
}
