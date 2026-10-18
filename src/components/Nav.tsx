import { panels, profile } from "@/content";

const SECTIONS = ["engineer", "stage", "founder", "off"] as const;

export const Nav = () => (
    <header className="nav">
        <a href="#top">{profile.name}</a>
        <nav aria-label="Sections">
            {SECTIONS.map((id) => (
                <a key={id} href={`#${id}`}>
                    {panels[id].title}
                </a>
            ))}
            <a href="#hi">say hi</a>
        </nav>
    </header>
);
