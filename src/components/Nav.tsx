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
            <a href="/resume" target="_blank" rel="noopener noreferrer">
                resume
            </a>
            <a href="#hi">say hi</a>
        </nav>
    </header>
);
