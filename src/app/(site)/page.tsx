import Image from "next/image";
import { Blank, Counter, KaraokeScore, PageInMiniature, SharedTaste, TabSplit } from "@/components/artworks";
import { Ledger } from "@/components/DayJob";
import { DoorSpot } from "@/components/DoorSpot";
import { Drift } from "@/components/Drift";
import { Nav } from "@/components/Nav";
import { OffHours } from "@/components/OffHours";
import { PageMotion } from "@/components/PageMotion";
import { layoutSizes } from "@/lib/media";
import { Panel, SnapPoint } from "@/components/Panel";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Spotlight } from "@/components/Spotlight";
import { Work } from "@/components/Work";
import { getEvents, getJobs, getPanels, getProducts, getProfile } from "@/content";
import { panelIds } from "@/content/schema";
import type { FounderWork, Product } from "@/content";
import { fillGlance, shownJobs, splitProducts } from "@/content/select";
import { getFilms, letterboxdProfile } from "@/lib/letterboxd";
import { linkTarget, newTab } from "@/lib/links";

/** A product's museum label. */
const label = (p: Product) => ({ title: p.name, years: p.years, role: p.role, tag: p.tag, note: p.what, url: p.url });

/** One compact item in an "also" row: an outside link when it has one, otherwise plain text. */
const Chip = ({
    href,
    title,
    as: Plain = "span",
    children,
}: {
    href?: string;
    title?: string;
    as?: "span" | "cite";
    children: React.ReactNode;
}) =>
    href ? (
        <a href={href} title={title} {...newTab}>
            {children}
        </a>
    ) : (
        <Plain title={title}>{children}</Plain>
    );

/** Artwork for featured products, by product id. A featured product without one gets a blank frame. */
const ART: Record<string, React.ReactNode> = {
    tab: <TabSplit />,
    kabo: <KaraokeScore score={96} />,
    muspace: <SharedTaste />,
    "this-website": <PageInMiniature />,
};

/** A founder work's art: its photo, its number, or a blank frame. */
const founderArt = ({ art }: FounderWork) => {
    if (art?.kind === "photo") {
        // Eager, because lazy loading skips images still hidden by their reveal's clip-path.
        return (
            <Image
                className="photo"
                src={art.image}
                alt={art.alt}
                width={600}
                height={600}
                loading="eager"
                sizes={layoutSizes("50vw", "28vh")}
            />
        );
    }
    if (art?.kind === "counter")
        return <Counter to={art.to} prefix={art.prefix} suffix={art.suffix} label={art.label} />;
    return <Blank text="no artwork yet" />;
};

const Home = async () => {
    const [profile, products, { events, stagePhotos }, { panels, founder, writing, offHours }, { jobs }, films] =
        await Promise.all([
            getProfile(),
            getProducts(),
            getEvents(),
            getPanels(),
            getJobs(),
            // Live films from Letterboxd (cached 6h), falling back to the stored list if the feed is unreachable.
            getFilms(),
        ]);
    const { socials } = profile;
    const glance = fillGlance(profile.glance, products);
    const { featured, others: otherProducts } = splitProducts(products);
    // The films card links to the same account its films come from, whatever the social links are called.
    const letterboxd = letterboxdProfile(profile.letterboxdUser);

    // Lists of edited text use index keys: nothing makes a label or title unique, and nothing here reorders them.
    return (
        <>
            <Nav
                name={profile.name}
                sections={panelIds.map((id) => ({
                    id,
                    title: panels[id].title,
                }))}
            />
            <main>
                <SnapPoint />
                <Spotlight
                    name={profile.name.split(/\s+/).map((word, i) => (
                        <span key={i}>{word}</span>
                    ))}
                >
                    <div className="hero-foot">
                        <p className="headline">
                            {profile.headline.lead} <em>{profile.headline.emphasis}</em>
                        </p>
                        <p className="intro">{profile.intro}</p>
                    </div>
                    <div className="glance">
                        {glance.map((g, i) => {
                            const inner = (
                                <>
                                    <span className="label-s">{g.label}</span>
                                    <i className="leader" aria-hidden="true" />
                                    <b>{g.title}</b>
                                    <span className="v">{g.detail}</span>
                                </>
                            );
                            if (!g.href) return <div key={i}>{inner}</div>;
                            return (
                                <a key={i} href={g.href} {...linkTarget(g.href)}>
                                    {inner}
                                </a>
                            );
                        })}
                    </div>
                </Spotlight>
                <SnapPoint />

                <Panel id="dayjob" {...panels.dayjob}>
                    <Ledger jobs={shownJobs(jobs)} />
                </Panel>

                <Panel id="engineer" {...panels.engineer}>
                    <div className="row" data-cols={featured.length >= 4 ? "4" : "3"}>
                        {featured.map((p, i) => (
                            <Work
                                key={p.id}
                                art={ART[p.id] ?? <Blank text="no artwork yet" />}
                                {...label(p)}
                                delay={i * 120}
                            />
                        ))}
                    </div>
                    <div className="also-chips">
                        <span className="label-s">also built</span>
                        {otherProducts.map((p) => (
                            <Chip key={p.id} href={p.url}>
                                {p.name}
                                {p.tag && <small className="tag">{p.tag}</small>}
                            </Chip>
                        ))}
                    </div>
                    {writing.length > 0 && (
                        <div className="also-chips also-wrote">
                            <span className="label-s">papers written</span>
                            {writing.map((w, i) => (
                                // The short title shows; the full title is the hover text and follows it for screen
                                // readers, so the accessible name still starts with the visible text.
                                <Chip key={i} href={w.url} title={w.title} as="cite">
                                    {w.short}
                                    <span className="sr-only">: {w.title}</span>
                                </Chip>
                            ))}
                        </div>
                    )}
                </Panel>

                <Panel id="stage" {...panels.stage}>
                    <div className="mosaic">
                        {stagePhotos.map((p, i) => (
                            <figure
                                key={i}
                                className="tile rv"
                                data-cols={p.span.cols}
                                data-rows={p.span.rows}
                                tabIndex={0}
                                style={{ "--d": `${(i % 6) * 70}ms` } as React.CSSProperties}
                            >
                                <Image
                                    src={p.src}
                                    alt={p.alt}
                                    fill
                                    loading="eager"
                                    sizes={
                                        p.span.cols === 4 ? layoutSizes("100vw", "50vw") : layoutSizes("50vw", "25vw")
                                    }
                                />
                                <figcaption>{p.caption}</figcaption>
                            </figure>
                        ))}
                    </div>
                    <div className="shows-line">
                        {events.map((e, i) => (
                            <a key={i} href={e.url} {...newTab}>
                                <b>{e.name}</b> {e.stats[0].value} {e.stats[0].label}
                            </a>
                        ))}
                    </div>
                </Panel>

                <Panel id="founder" {...panels.founder}>
                    <div className="row" data-cols={founder.works.length + 1 >= 4 ? "4" : "3"}>
                        <Work art={<Blank text="not yet on view" />} {...founder.stealth} delay={0} />
                        {founder.works.map((w, i) => (
                            <Work key={i} {...w} art={founderArt(w)} delay={(i + 1) * 120} />
                        ))}
                    </div>
                    {founder.alsoLed.length > 0 && (
                        <div className="also-chips">
                            <span className="label-s">also led</span>
                            {founder.alsoLed.map((o, i) => (
                                <Chip key={i} href={o.url} title={o.note}>
                                    {o.name}
                                    <small className="tag">
                                        {o.role}, {o.years}
                                    </small>
                                </Chip>
                            ))}
                        </div>
                    )}
                </Panel>

                <Panel id="off" {...panels.off}>
                    <OffHours films={films} offHours={offHours} letterboxd={letterboxd} />
                </Panel>

                <section className="panel door" id="hi" aria-labelledby="hi-title">
                    <DoorSpot />
                    <div>
                        <h2 className="label-s" id="hi-title">
                            say hi, and the house lights come up
                        </h2>
                        <a className="door-mail display" href={`mailto:${profile.email}`}>
                            {profile.email}
                        </a>
                        <nav aria-label="Elsewhere">
                            {socials.map((s, i) => (
                                <a key={i} href={s.href} {...newTab}>
                                    {s.label}
                                </a>
                            ))}
                            {/* /resume is a route handler that redirects to the PDF, not a page, so it needs a full load. */}
                            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                            <a href="/resume" {...newTab}>
                                resume
                            </a>
                        </nav>
                        <p className="fine label-s">designed and built by {profile.name}.</p>
                    </div>
                </section>
            </main>
            <PageMotion />
            <SmoothScroll />
            <Drift />
        </>
    );
};

export default Home;
