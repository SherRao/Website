import type { Film } from "@/content";
import { offHours, socials } from "@/content";
import { ListeningCard } from "./ListeningCard";

const stars = (n: number) => "★".repeat(Math.floor(n)) + (n % 1 ? "½" : "");
const letterboxd = socials.find((s) => s.label === "letterboxd")!.href;

export const OffHours = ({ films }: { films: Film[] }) => (
    <div className="wall">
        <ListeningCard />
        <div className="card" data-span="2">
            <span className="label-s">in the band</span>
            <h3>music i make</h3>
            <p>{offHours.making.hint}</p>
            <p>
                <span className="needed">coming soon</span>
            </p>
        </div>
        <a className="card" data-span="2" href={letterboxd} target="_blank" rel="noopener noreferrer">
            <span className="label-s">last watched</span>
            <h3>films</h3>
            <ul className="films">
                {films.slice(0, 4).map((f) => (
                    <li key={`${f.title}-${f.watched}`}>
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
            <span className="label-s">through the lens</span>
            <h3>photography</h3>
            <p>{offHours.photography.hint}</p>
            <div className="frames" aria-hidden="true">
                <i>photo</i>
                <i>photo</i>
                <i>photo</i>
                <i>photo</i>
            </div>
            <p>
                <span className="needed">add photos</span>
            </p>
        </div>
        <div className="card" data-span="3">
            <span className="label-s">in the kitchen</span>
            <h3>cooking</h3>
            <p>{offHours.cooking.hint}</p>
            <div className="chips">
                {offHours.cooking.prompts.map((p) => (
                    <span key={p}>{p}</span>
                ))}
            </div>
            <p>
                <span className="needed">coming soon</span>
            </p>
        </div>
    </div>
);
