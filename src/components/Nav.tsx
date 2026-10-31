import { panelIds, panels, profile } from "@/content";
import { newTab } from "@/lib/links";

export const Nav = () => (
    <header className="nav">
        <a href="#top">{profile.name}</a>
        <nav aria-label="Sections">
            {panelIds.map((id) => (
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
