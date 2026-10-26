import Image from "next/image";
import { BlueDot, Blank, Counter, Dots, TabSplit } from "@/components/artworks";
import { Drift } from "@/components/Drift";
import { Nav } from "@/components/Nav";
import { OffHours } from "@/components/OffHours";
import { PageMotion } from "@/components/PageMotion";
import { Panel, SnapPoint } from "@/components/Panel";
import { Spotlight } from "@/components/Spotlight";
import { Work } from "@/components/Work";
import { getEvents, getPanels, getProducts, getProfile } from "@/content";
import type { Product } from "@/content";
import { productById, splitProducts } from "@/content/select";
import { getFilms } from "@/lib/letterboxd";

/** A product's museum label. */
const label = (p: Product) => ({ title: p.name, years: p.years, role: p.role, note: p.what, url: p.url });

/** Artwork for featured products, by product id. A featured product without one gets a blank frame. */
const ART: Record<string, React.ReactNode> = {
    "blue-dot": <BlueDot />,
    tab: <TabSplit />,
    shopify: <Counter to={1100000} suffix="+" label="1,100,000+ people a day" />,
};

const Home = async () => {
    const [profile, products, { events, stagePhotos }, { panels, founderWorks, offHours }, films] = await Promise.all([
        getProfile(),
        getProducts(),
        getEvents(),
        getPanels(),
        // Live films from Letterboxd (cached 6h), falling back to the stored list if the feed is unreachable.
        getFilms(),
    ]);
    const { glance, socials } = profile;
    const { featured, others: otherProducts } = splitProducts(products);
    const { image: konferImage, alt: konferAlt, ...konfer } = founderWorks.konfer;
    const seahorse = productById(products, founderWorks.seahorse.productId);
    const letterboxd = socials.find((s) => s.label === "letterboxd")?.href;

    return (
        <>
            <Nav
                name={profile.name}
                sections={(["engineer", "stage", "founder", "off"] as const).map((id) => ({
                    id,
                    title: panels[id].title,
                }))}
            />
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
                        {otherProducts.map((p) =>
                            p.url ? (
                                <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer">
                                    {p.name}
                                </a>
                            ) : (
                                <span key={p.id}>{p.name}</span>
                            ),
                        )}
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
                    <div className="row" data-cols="4">
                        <Work
                            art={
                                <Image
                                    className="photo"
                                    src={konferImage}
                                    alt={konferAlt}
                                    width={600}
                                    height={600}
                                    loading="eager"
                                    sizes="(max-width: 960px) 50vw, 28vh"
                                />
                            }
                            {...konfer}
                        />
                        <Work art={<Dots filled={12} total={15} />} {...founderWorks.spur} delay={120} />
                        {seahorse && (
                            <Work
                                art={<Counter {...founderWorks.seahorse.counter} />}
                                {...label(seahorse)}
                                delay={240}
                            />
                        )}
                        <Work art={<Blank text="not yet on view" />} {...founderWorks.stealth} delay={360} />
                    </div>
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
                        <p className="fine label-s">designed and built by nausher rao.</p>
                    </div>
                </section>
            </main>
            <PageMotion />
            <Drift />
        </>
    );
};

export default Home;
