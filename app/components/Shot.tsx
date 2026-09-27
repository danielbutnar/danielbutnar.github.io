import { SHOT_SIZE, shotUrl, type ShotKind } from "~/content/images";

interface ShotProps {
  name: string;
  alt: string;
  caption?: string;
  kind?: ShotKind;
  /** The first image on a page is the likely LCP element: load it eagerly. */
  priority?: boolean;
  className?: string;
}

/** A screenshot with a frame and an optional caption. */
export function Shot({
  name,
  alt,
  caption,
  kind = "desktop",
  priority = false,
  className,
}: ShotProps) {
  const src = shotUrl(name);
  const { width, height } = SHOT_SIZE[kind];
  if (!src) {
    if (import.meta.env.DEV) console.warn(`Missing screenshot: app/assets/work/${name}.webp`);
    return null;
  }
  return (
    <figure className={["shot", `shot--${kind}`, className].filter(Boolean).join(" ")}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "auto" : "async"}
        fetchPriority={priority ? "high" : undefined}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
