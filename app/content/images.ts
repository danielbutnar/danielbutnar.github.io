// Screenshots in app/assets/work, imported so Vite fingerprints them.
// Desktop shots are 1440 × 900, phone shots 780 × 1688 (390 × 844 at 2x).

const files = import.meta.glob<string>("../assets/work/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

export type ShotKind = "desktop" | "phone";

export const SHOT_SIZE: Record<ShotKind, { width: number; height: number }> = {
  desktop: { width: 1440, height: 900 },
  phone: { width: 780, height: 1688 },
};

export function shotUrl(name: string): string | undefined {
  return files[`../assets/work/${name}.webp`];
}
