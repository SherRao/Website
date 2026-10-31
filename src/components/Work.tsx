import { newTab } from "@/lib/links";

type WorkProps = {
    art: React.ReactNode;
    title: string;
    years: string;
    role: string;
    /** A short credit after the role, such as the hackathon it was built at. */
    tag?: string;
    note: string;
    url?: string;
    /** Stagger for the reveal, in ms. */
    delay?: number;
};

/** One gallery work: an artwork with a museum-style label underneath. */
export const Work = ({ art, title, years, role, tag, note, url, delay = 0 }: WorkProps) => (
    <article className="cell">
        <div className="art rv" style={{ "--d": `${delay}ms` } as React.CSSProperties}>
            {art}
        </div>
        <div className="wl">
            <span className="title">
                {title}
                <span>, {years}</span>
            </span>
            <p className="role">
                {role}
                {tag && <span className="tag">, {tag}</span>}
            </p>
            <p className="note">{note}</p>
            {url && (
                <p className="note">
                    <a href={url} {...newTab}>
                        visit ↗<span className="sr-only"> {title}</span>
                    </a>
                </p>
            )}
        </div>
    </article>
);
