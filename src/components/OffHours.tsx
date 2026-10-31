import type { Film, Panels, Placeholder } from "@/content/types";
import { ListeningCard } from "./ListeningCard";
import { newTab } from "@/lib/links";

const stars = (n: number) => "★".repeat(Math.floor(n)) + (n % 1 ? "½" : "");

/** A placeholder's text: the hint and a "coming soon" marker until it's filled in, then its details. */
const Filled = ({ item }: { item: Placeholder }) =>
    item.needed ? (
        <>
            <p>{item.hint}</p>
            <p>
                <span className="needed">coming soon</span>
            </p>
        </>
    ) : (
        <p>
            {item.details}
            {item.url && (
                <>
                    {" "}
                    <a href={item.url} {...newTab}>
                        more ↗
                    </a>
                </>
            )}
        </p>
    );

type OffHoursProps = { films: Film[]; offHours: Panels["offHours"]; letterboxd?: string };

export const OffHours = ({ films, offHours, letterboxd }: OffHoursProps) => (
    <div className="wall">
        <ListeningCard hint={offHours.listening.hint} />
        <div className="card" data-span="2">
            <span className="label-s">in the band</span>
            <h3>music i make</h3>
            <Filled item={offHours.making} />
        </div>
        <div className="card" data-span="2">
            <span className="label-s">through the lens</span>
            <h3>photography</h3>
            {offHours.photography.needed ? (
                <>
                    <p>{offHours.photography.hint}</p>
                    <div className="frames" aria-hidden="true">
                        <i>photo</i>
                        <i>photo</i>
                        <i>photo</i>
                        <i>photo</i>
                    </div>
                    <p>
                        <span className="needed">coming soon</span>
                    </p>
                </>
            ) : (
                <Filled item={offHours.photography} />
            )}
        </div>
        <a className="card" data-span="3" href={letterboxd} {...newTab}>
            <span className="label-s">last watched</span>
            <h3>films</h3>
            <ul className="films">
                {films.slice(0, 8).map((f, i) => (
                    <li key={i}>
                        <span>
                            {f.title} <small>{f.year}</small>
                        </span>
                        <span className="stars" aria-label={`${f.rating} out of 5 stars`}>
                            {stars(f.rating)}
                        </span>
                    </li>
                ))}
            </ul>
        </a>
        <div className="card" data-span="3">
            <span className="label-s">in the kitchen</span>
            <h3>cooking</h3>
            {offHours.cooking.needed ? (
                <>
                    <p>{offHours.cooking.hint}</p>
                    <div className="chips">
                        {offHours.cooking.prompts.map((p, i) => (
                            <span key={i}>{p}</span>
                        ))}
                    </div>
                    <p>
                        <span className="needed">coming soon</span>
                    </p>
                </>
            ) : (
                <Filled item={offHours.cooking} />
            )}
        </div>
    </div>
);
