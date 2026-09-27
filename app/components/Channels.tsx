import { useDict } from "~/i18n";
import { CONTACT } from "~/site/contact";

/** E-mail first, then the profiles that are set in site/contact.ts. */
export function Channels({ className = "channels" }: { className?: string }) {
  const t = useDict();
  const profiles = [
    { label: t.channels.github, href: CONTACT.github },
    { label: t.channels.linkedin, href: CONTACT.linkedin },
    { label: t.channels.contra, href: CONTACT.contra },
  ].filter((profile): profile is { label: string; href: string } => Boolean(profile.href));

  return (
    <ul className={className}>
      <li>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
      </li>
      {profiles.map((profile) => (
        <li key={profile.label}>
          <a href={profile.href}>{profile.label}</a>
        </li>
      ))}
    </ul>
  );
}
