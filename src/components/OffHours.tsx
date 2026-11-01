import type { Film, Panels, Placeholder } from "@/content/types";
import { ListeningCard } from "./ListeningCard";
import { newTab } from "@/lib/links";

/** A film's rating as stars, read out as a whole. Letterboxd has no zero rating, so 0 means unrated and shows nothing. */
export const Stars = ({ rating }: { rating: number }) =>
    rating > 0 ? (
        <span className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
            {"★".repeat(Math.floor(rating)) + (rating % 1 ? "½" : "")}
        </span>
    ) : null;

/** A placeholder's text: the hint, any children and a "coming soon" marker until it's filled in, then its details. */
const Filled = ({ item, children }: { item: Placeholder; children?: React.ReactNode }) =>
    item.needed ? (
        <>
            <p>{item.hint}</p>
            {children}
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
            <Filled item={offHours.photography}>
                <div className="frames" aria-hidden="true">
                    <i>photo</i>
                    <i>photo</i>
                    <i>photo</i>
                    <i>photo</i>
                </div>
            </Filled>
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
                        <Stars rating={f.rating} />
                    </li>
                ))}
            </ul>
        </a>
        <div className="card" data-span="3">
            <span className="label-s">in the kitchen</span>
            <h3>cooking</h3>
            <Filled item={offHours.cooking}>
                <div className="chips">
                    {offHours.cooking.prompts.map((p, i) => (
                        <span key={i}>{p}</span>
                    ))}
                </div>
            </Filled>
        </div>
    </div>
);
