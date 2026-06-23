import Image from "next/image";

// A stack of 3 photos rotated like polaroids tossed on a desk. Each card has
// a cream backing + soft sage shadow + caption strip below the image — looks
// hand-placed rather than "square image stuck on the page".
//
// Per Tyron's note: more visuals, but creative not bolted-on.

type Polaroid = {
  src: string;
  alt: string;
  caption: string;
};

const PHOTOS: Polaroid[] = [
  {
    src: "/seo/photos/polaroid-1-instructor-tablet.jpg",
    alt: "Yoga instructor checking the class schedule on a tablet while students hold a plank",
    caption: "06:30 · Sunrise Flow",
  },
  {
    src: "/seo/photos/polaroid-2-warrior-class.jpg",
    alt: "Yoga teacher adjusting a student's posture in warrior pose",
    caption: "09:00 · Mid-class assist",
  },
  {
    src: "/seo/photos/polaroid-3-portrait.jpg",
    alt: "Yoga studio owner standing in front of her class",
    caption: "Studio owner · before the room fills",
  },
];

export function PolaroidStack({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={
        "relative size-[280px] md:size-[360px] " + (className ?? "")
      }
      aria-hidden={false}
    >
      {PHOTOS.map((p, i) => (
        <div
          key={p.src}
          className={
            "absolute bg-[#FBFAF7] rounded-md p-3 pb-4 shadow-xl shadow-primary/10 border border-border/40 transition-transform duration-300 hover:!rotate-0 hover:!z-30 hover:-translate-y-1 " +
            (i === 0
              ? "top-0 left-0 -rotate-[8deg] z-10"
              : i === 1
                ? "top-3 left-12 md:left-20 rotate-[5deg] z-20"
                : "top-16 left-4 md:left-8 -rotate-[3deg] z-30")
          }
          style={{ width: "220px" }}
        >
          <div className="relative w-full aspect-square overflow-hidden rounded-sm bg-secondary/40">
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="220px"
              className="object-cover"
            />
          </div>
          <div className="mt-2.5 text-[10px] text-foreground/70 tracking-[0.05em] font-medium italic">
            {p.caption}
          </div>
        </div>
      ))}
    </div>
  );
}
