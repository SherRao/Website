import { panels, profile } from "@/content";
import { newTab } from "@/lib/links";

const SECTIONS = ["dayjob", "engineer", "stage", "founder", "off"] as const;

export const Nav = () => (
    <header className="nav">
        <a href="#top">{profile.name}</a>
        <nav aria-label="Sections">
            {SECTIONS.map((id) => (
                <a key={id} href={`#${id}`}>
                    {panels[id].title}
                </a>
            ))}
            <a href={profile.resume} {...newTab}>
                resume
            </a>
            <a href="#hi">say hi</a>
        </nav>
    </header>
);
