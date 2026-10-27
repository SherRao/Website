/** A zero-height marker: one of the points SmoothScroll.tsx snaps the page to on the large layout. */
export const SnapPoint = () => <div className="snap" aria-hidden="true" />;

type PanelProps = { id: string; n: string; title: string; text: string; children: React.ReactNode };

/** A full-screen chapter panel. A snap point follows it, where the next panel is fully in place. */
export const Panel = ({ id, n, title, text, children }: PanelProps) => (
    <>
        <section className="panel chapter" id={id} aria-labelledby={`${id}-title`}>
            <div className="panel-in">
                <header className="chapter-head">
                    <div>
                        <span className="label-s">{n}.</span>
                        <h2 className="chapter-title display" id={`${id}-title`}>
                            {title}
                        </h2>
                    </div>
                    <div className="chapter-text">
                        <p>{text}</p>
                    </div>
                </header>
                <div className="panel-body">{children}</div>
            </div>
        </section>
        <SnapPoint />
    </>
);
