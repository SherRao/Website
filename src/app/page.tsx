import Image from "next/image";
import { BlueDot, Blank, Counter, Dots, TabSplit } from "@/components/artworks";
import { Nav } from "@/components/Nav";
import { OffHours } from "@/components/OffHours";
import { PageMotion } from "@/components/PageMotion";
import { Panel, SnapPoint } from "@/components/Panel";
import { Spotlight } from "@/components/Spotlight";
import { Work } from "@/components/Work";
import { events, fallbackFilms, findProduct, founderWorks, glance, letterboxdUser, panels, products, profile, socials, stagePhotos } from "@/content";
import { getRecentFilms } from "@/lib/letterboxd";

const FEATURED = ["blue dot", "tab", "shopify cli + partner dashboard"];

const Home = async () => {
    // Live films from Letterboxd (cached 6h), falling back to the stored list if the feed is unreachable.
    const liveFilms = await getRecentFilms(letterboxdUser);
    const films = liveFilms.length ? liveFilms : fallbackFilms;
    const [blueDot, tab, shopify] = FEATURED.map(findProduct);
    const otherProducts = products.filter((p) => !FEATURED.includes(p.name));

    return (
        <>
            <Nav />
            <main>
                <Spotlight name={<><span>nausher</span><span>rao</span></>}>
                    <div className="hero-foot">
                        <p className="headline">{profile.headline.lead} <em>{profile.headline.emphasis}</em></p>
                        <p className="intro">{profile.intro}</p>
                    </div>
                    <div className="glance">
                        {glance.map((g) => {
                            const inner = <><span className="label-s">{g.label}</span><b>{g.title}</b><span className="v">{g.detail}</span></>;
                            if (!g.href) return <div key={g.label}>{inner}</div>;
                            const external = g.href.startsWith("http");
                            return <a key={g.label} href={g.href} {...(external && { target: "_blank", rel: "noopener noreferrer" })}>{inner}</a>;
                        })}
                    </div>
                </Spotlight>
                <SnapPoint />

                <Panel id="engineer" {...panels.engineer}>
                    <div className="row" data-cols="3">
                        <Work art={<BlueDot />} title={blueDot.name} years={blueDot.years} role={blueDot.role} note={blueDot.what} url={blueDot.url} />
                        <Work art={<TabSplit />} title={tab.name} years={tab.years} role={tab.role} note={tab.what} url={tab.url} delay={120} />
                        <Work art={<Counter to={1100000} suffix="+" label="1,100,000+ people a day" />} title={shopify.name} years={shopify.years} role={shopify.role} note={shopify.what} url={shopify.url} delay={240} />
                    </div>
                    <div className="also-chips">
                        <span className="label-s">also built</span>
                        {otherProducts.map((p) => p.url
                            ? <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a>
                            : <span key={p.name}>{p.name}</span>)}
                    </div>
                </Panel>

                <Panel id="stage" {...panels.stage}>
                    <div className="mosaic">
                        {stagePhotos.map((p, i) => (
                            <figure key={p.src} className="tile rv" data-cols={p.span.cols} data-rows={p.span.rows} tabIndex={0} style={{ "--d": `${(i % 6) * 70}ms` } as React.CSSProperties}>
                                <Image src={p.src} alt={p.alt} fill loading="eager" sizes={p.span.cols === 4 ? "(max-width: 960px) 100vw, 50vw" : "(max-width: 960px) 50vw, 25vw"} />
                                <figcaption>{p.caption}</figcaption>
                            </figure>
                        ))}
                    </div>
                    <div className="shows-line">
                        {events.map((e) => (
                            <a key={e.id} href={e.url} target="_blank" rel="noopener noreferrer"><b>{e.name}</b> {e.stats[0].value} {e.stats[0].label}</a>
                        ))}
                    </div>
                </Panel>

                <Panel id="founder" {...panels.founder}>
                    <div className="row" data-cols="4">
                        <Work
                            art={<Image className="photo" src={founderWorks.konfer.image} alt={founderWorks.konfer.alt} width={600} height={600} loading="eager" sizes="(max-width: 960px) 50vw, 28vh" />}
                            {...founderWorks.konfer}
                        />
                        <Work art={<Dots filled={12} total={15} />} {...founderWorks.spur} delay={120} />
                        <Work art={<Counter to={750} prefix="$" suffix="k" label="$750k raised" />} {...founderWorks.seahorse} delay={240} />
                        <Work art={<Blank text="not yet on view" />} {...founderWorks.stealth} delay={360} />
                    </div>
                </Panel>

                <Panel id="off" {...panels.off}>
                    <OffHours films={films} />
                </Panel>

                <section className="panel door" id="hi" aria-labelledby="hi-title">
                    <div>
                        <h2 className="label-s" id="hi-title">say hi, and the house lights come up</h2>
                        <a className="door-mail display" href={`mailto:${profile.email}`}>{profile.email}</a>
                        <nav aria-label="Elsewhere">
                            {socials.map((s) => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a>)}
                        </nav>
                        <p className="fine label-s">designed and built by nausher rao.</p>
                    </div>
                </section>
            </main>
            <PageMotion />
        </>
    );
};

export default Home;
