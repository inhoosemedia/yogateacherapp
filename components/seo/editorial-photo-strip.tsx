import Image from "next/image";

// A full-bleed horizontal strip of 4 photos with a sage tint overlay so they
// harmonise with the cream + sage palette instead of jumping off the page.
// Acts as an editorial moment between text sections — "studio days, all at
// once" — without imposing a single hero image.

type StripPhoto = { src: string; alt: string };

const PHOTOS: StripPhoto[] = [
  {
    src: "/seo/photos/strip-1.jpg",
    alt: "Yoga class in extended triangle pose with the teacher adjusting a student",
  },
  {
    src: "/seo/photos/strip-2.jpg",
    alt: "Studio tablet showing the YogaTeacher class list during a warrior-pose class",
  },
  {
    src: "/seo/photos/strip-3.jpg",
    alt: "Yoga instructor in a sage tank consulting her tablet while a class flows behind her",
  },
  {
    src: "/seo/photos/strip-4.jpg",
    alt: "Studio owner sitting cross-legged on a mat with her dashboard open on a tablet",
  },
];

export function EditorialPhotoStrip({
  eyebrow = "A studio week, in four moments",
}: {
  eyebrow?: string;
}) {
  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="text-center mb-8 px-6">
        <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          {eyebrow}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-1.5">
        {PHOTOS.map((p, i) => (
          <div
            key={p.src}
            className={
              "relative aspect-[3/4] md:aspect-[4/5] overflow-hidden " +
              "after:absolute after:inset-0 after:bg-primary/10 after:transition-opacity after:duration-700 hover:after:opacity-0 " +
              (i % 2 === 0 ? "md:translate-y-3" : "")
            }
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Soft warm-edge gradient to soften the rectangular boundaries */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(251,250,247,0.0) 60%, rgba(251,250,247,0.25) 100%)",
              }}
              aria-hidden
            />
          </div>
        ))}
      </div>
    </section>
  );
}
