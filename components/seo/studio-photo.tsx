import Image from "next/image";

// Photo treatment with operator-perspective caption. The caption breaks
// the "yoga is beautiful" stock-photo cliché and reframes the photo as
// the studio-as-workplace view — which is what the product actually serves.

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /**
   * A short caption rendered as a label beside or below the photo. Use it
   * to anchor the photo to a specific operator use case ("Marking attendance
   * mid-class"), not to describe the photo's literal contents (the alt
   * already does that).
   */
  caption?: string;
  priority?: boolean;
  className?: string;
};

export function StudioPhoto({
  src,
  alt,
  width,
  height,
  caption,
  priority,
  className,
}: Props) {
  return (
    <figure className={"relative " + (className ?? "")}>
      <div className="overflow-hidden rounded-3xl bg-secondary/60 border border-border/60 shadow-lg shadow-primary/5">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes="(min-width: 1024px) 540px, 90vw"
          className="w-full h-auto"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-xs text-muted-foreground/80 tracking-wide flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-primary/70" aria-hidden />
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
