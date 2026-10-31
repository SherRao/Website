import Image from "next/image";
import { Blank, Counter, KaraokeScore, PageInMiniature, SharedTaste, TabSplit } from "@/components/artworks";
import { Ledger } from "@/components/DayJob";
import { Drift } from "@/components/Drift";
import { Followspot } from "@/components/Followspot";
import { Nav } from "@/components/Nav";
import { OffHours } from "@/components/OffHours";
import { PageMotion } from "@/components/PageMotion";
import { layoutSizes } from "@/lib/media";
import { Panel, SnapPoint } from "@/components/Panel";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Spotlight } from "@/components/Spotlight";
import { Work } from "@/components/Work";
import {
    events,
    findProduct,
    founder,
    glance,
    panels,
    products,
    profile,
    shownJobs,
    socials,
    stagePhotos,
    writing,
} from "@/content";
import type { FounderWork, Product } from "@/content";
import { getFilms } from "@/lib/letterboxd";

/** Side projects shown as large works, in order, with their artwork. */
const FEATURED: [string, React.ReactNode][] = [
    ["tab", <TabSplit key="tab" />],
    ["kabo", <KaraokeScore key="kabo" score={96} />],
    ["muspace", <SharedTaste key="muspace" />],
    ["this website", <PageInMiniature key="site" />],
];
const featuredNames = FEATURED.map(([name]) => name);

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
        <a href={href} title={title} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    ) : (
        <Plain title={title}>{children}</Plain>
    );

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
    // Live films from Letterboxd (cached 6h), falling back to the stored list if the feed is unreachable.
    const films = await getFilms();
    const otherProducts = products.filter((p) => !featuredNames.includes(p.name));

    return (
        <>
            <Nav />
            <main>
                <SnapPoint />
                <Spotlight
                    name={
                        <>
                            <span>nausher</span>
                            <span>rao</span>
                        </>
                    }
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
                    <Ledger jobs={shownJobs()} />
                </Panel>

                <Panel id="engineer" {...panels.engineer}>
                    <div className="row" data-cols="4">
                        {FEATURED.map(([name, art], i) => (
                            <Work key={name} art={art} {...label(findProduct(name))} delay={i * 120} />
                        ))}
                    </div>
                    <div className="also-chips">
                        <span className="label-s">also built</span>
                        {otherProducts.map((p) => (
                            <Chip key={p.name} href={p.url}>
                                {p.name}
                                {p.tag && <small className="tag">{p.tag}</small>}
                            </Chip>
                        ))}
                    </div>
                    <div className="also-chips also-wrote">
                        <span className="label-s">papers written</span>
                        {writing.map((w) => (
                            // The short title shows; the full title is the hover text and follows it for screen
                            // readers, so the accessible name still starts with the visible text.
                            <Chip key={w.title} href={w.url} title={w.title} as="cite">
                                {w.short}
                                <span className="sr-only">: {w.title}</span>
                            </Chip>
                        ))}
                    </div>
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
                                        p.span.cols === 4 ? layoutSizes("100vw", "50vw") : layoutSizes("50vw", "25vw")
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
                        <Work art={<Blank text="not yet on view" />} {...founder.stealth} delay={0} />
                        {founder.works.map((w, i) => (
                            <Work key={w.title} {...w} art={founderArt(w)} delay={(i + 1) * 120} />
                        ))}
                    </div>
                    <div className="also-chips">
                        <span className="label-s">also led</span>
                        {founder.alsoLed.map((o) => (
                            <Chip key={o.name} href={o.url} title={o.note}>
                                {o.name}
                                <small className="tag">
                                    {o.role}, {o.years}
                                </small>
                            </Chip>
                        ))}
                    </div>
                </Panel>

                <Panel id="off" {...panels.off}>
                    <OffHours films={films} />
                </Panel>

                <section className="panel door" id="hi" aria-labelledby="hi-title">
                    <Followspot mood="hi" className="door-spot" />
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
                            <a href={profile.resume} target="_blank" rel="noopener noreferrer">
                                resume
                            </a>
                        </nav>
                        <p className="fine label-s">designed and built by nausher rao.</p>
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
