import Image from "next/image";
import { Blank, Counter, KaraokeScore, PageInMiniature, SharedTaste, TabSplit } from "@/components/artworks";
import { Ledger } from "@/components/DayJob";
import { Drift } from "@/components/Drift";
import { Nav } from "@/components/Nav";
import { OffHours } from "@/components/OffHours";
import { PageMotion } from "@/components/PageMotion";
import { Panel, SnapPoint } from "@/components/Panel";
import { Spotlight } from "@/components/Spotlight";
import { Work } from "@/components/Work";
import { getEvents, getJobs, getPanels, getProducts, getProfile } from "@/content";
import type { FounderWork, Product } from "@/content";
import { fillGlance, shownJobs, splitProducts } from "@/content/select";
import { getFilms } from "@/lib/letterboxd";

/** A product's museum label. */
const label = (p: Product) => ({ title: p.name, years: p.years, role: p.role, note: p.what, url: p.url });

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
        return (
            <Image
                className="photo"
                src={art.image}
                alt={art.alt}
                width={600}
                height={600}
                loading="eager"
                sizes="(max-width: 960px) 50vw, 28vh"
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
    const letterboxd = socials.find((s) => s.label === "letterboxd")?.href;

    return (
        <>
            <Nav
                name={profile.name}
                sections={(["dayjob", "engineer", "stage", "founder", "off"] as const).map((id) => ({
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
                        {glance.map((g) => {
                            const inner = (
                                <>
                                    <span className="label-s">{g.label}</span>
                                    <i className="leader" aria-hidden="true" />
                                    <b>{g.title}</b>
                                    <span className="v">{g.detail}</span>
                                </>
                            );
                            if (!g.href) return <div key={g.label}>{inner}</div>;
                            const external = g.href.startsWith("http");
                            return (
                                <a
                                    key={g.label}
                                    href={g.href}
                                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                                >
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
                        {otherProducts.map((p) => {
                            const inner = (
                                <>
                                    {p.name}
                                    {p.tag && <small className="tag">{p.tag}</small>}
                                </>
                            );
                            return p.url ? (
                                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer">
                                    {inner}
                                </a>
                            ) : (
                                <span key={p.id}>{inner}</span>
                            );
                        })}
                    </div>
                    {writing.length > 0 && (
                        <div className="also-chips also-wrote">
                            <span className="label-s">also wrote</span>
                            {writing.map((w) => {
                                // The short title shows; the full title is the hover text and what screen readers read.
                                const inner = (
                                    <>
                                        <span aria-hidden="true">{w.short}</span>
                                        <span className="sr-only">{w.title}</span>
                                    </>
                                );
                                return w.url ? (
                                    <a
                                        key={w.title}
                                        href={w.url}
                                        title={w.title}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {inner}
                                    </a>
                                ) : (
                                    <cite key={w.title} title={w.title}>
                                        {inner}
                                    </cite>
                                );
                            })}
                        </div>
                    )}
                </Panel>

                <Panel id="stage" {...panels.stage}>
                    <div className="mosaic">
                        {stagePhotos.map((p, i) => (
                            <figure
                                key={p.src}
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
                                        p.span.cols === 4
                                            ? "(max-width: 960px) 100vw, 50vw"
                                            : "(max-width: 960px) 50vw, 25vw"
                                    }
                                />
                                <figcaption>{p.caption}</figcaption>
                            </figure>
                        ))}
                    </div>
                    <div className="shows-line">
                        {events.map((e) => (
                            <a key={e.id} href={e.url} target="_blank" rel="noopener noreferrer">
                                <b>{e.name}</b> {e.stats[0].value} {e.stats[0].label}
                            </a>
                        ))}
                    </div>
                </Panel>

                <Panel id="founder" {...panels.founder}>
                    <div className="row" data-cols={founder.works.length + 1 >= 4 ? "4" : "3"}>
                        {founder.works.map((w, i) => (
                            <Work key={w.title} {...w} art={founderArt(w)} delay={i * 120} />
                        ))}
                        <Work
                            art={<Blank text="not yet on view" />}
                            {...founder.stealth}
                            delay={founder.works.length * 120}
                        />
                    </div>
                    {founder.alsoLed.length > 0 && (
                        <div className="also-chips">
                            <span className="label-s">also led</span>
                            {founder.alsoLed.map((o) => {
                                const inner = (
                                    <>
                                        {o.name}
                                        <small className="tag">
                                            {o.role}, {o.years}
                                        </small>
                                    </>
                                );
                                return o.url ? (
                                    <a key={o.name} href={o.url} target="_blank" rel="noopener noreferrer">
                                        {inner}
                                    </a>
                                ) : (
                                    <span key={o.name}>{inner}</span>
                                );
                            })}
                        </div>
                    )}
                </Panel>

                <Panel id="off" {...panels.off}>
                    <OffHours films={films} offHours={offHours} letterboxd={letterboxd} />
                </Panel>

                <section className="panel door" id="hi" aria-labelledby="hi-title">
                    <div>
                        <h2 className="label-s" id="hi-title">
                            say hi, and the house lights come up
                        </h2>
                        <a className="door-mail display" href={`mailto:${profile.email}`}>
                            {profile.email}
                        </a>
                        <nav aria-label="Elsewhere">
                            {socials.map((s) => (
                                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                                    {s.label}
                                </a>
                            ))}
                            <a href="/resume" target="_blank" rel="noopener noreferrer">
                                resume
                            </a>
                        </nav>
                        <p className="fine label-s">designed and built by {profile.name}.</p>
                    </div>
                </section>
            </main>
            <PageMotion />
            <Drift />
        </>
    );
};

export default Home;
