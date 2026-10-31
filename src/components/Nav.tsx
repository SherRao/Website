import { newTab } from "@/lib/links";

type NavProps = { name: string; sections: { id: string; title: string }[] };

export const Nav = ({ name, sections }: NavProps) => (
    <header className="nav">
        <a href="#top">{name}</a>
        <nav aria-label="Sections">
            {sections.map(({ id, title }) => (
                <a key={id} href={`#${id}`}>
                    {title}
                </a>
            ))}
            {/* /resume is a route handler that redirects to the PDF, not a page, so it needs a full load. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/resume" {...newTab}>
                resume
            </a>
            <a href="#hi">say hi</a>
        </nav>
    </header>
);
