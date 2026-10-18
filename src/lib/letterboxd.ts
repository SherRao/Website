import { XMLParser } from "fast-xml-parser";
import type { Film } from "@/content";

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

type FeedItem = {
    "letterboxd:filmTitle"?: string | number;
    "letterboxd:filmYear"?: number;
    "letterboxd:watchedDate"?: string;
    "letterboxd:memberRating"?: number;
};

/** Reads recent films from a Letterboxd RSS feed, newest watched first. Lists and items without a watch date are skipped. */
export const parseLetterboxd = (xml: string): Film[] => {
    const parsed = new XMLParser().parse(xml);
    const raw = parsed?.rss?.channel?.item;
    const items: FeedItem[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
    return items
        .filter((i) => i["letterboxd:filmTitle"] !== undefined && i["letterboxd:watchedDate"])
        .map((i) => {
            const iso = String(i["letterboxd:watchedDate"]);
            const [, m, d] = iso.split("-").map(Number);
            return {
                iso,
                film: {
                    title: String(i["letterboxd:filmTitle"]).toLowerCase(),
                    year: Number(i["letterboxd:filmYear"]),
                    watched: `${MONTHS[m - 1]} ${d}`,
                    rating: Number(i["letterboxd:memberRating"] ?? 0),
                },
            };
        })
        .sort((a, b) => b.iso.localeCompare(a.iso))
        .map((x) => x.film);
};

/** Recent films for a user, or an empty list if Letterboxd can't be reached. Cached for six hours. */
export const getRecentFilms = async (user: string): Promise<Film[]> => {
    try {
        const res = await fetch(`https://letterboxd.com/${user}/rss/`, { next: { revalidate: 21600 } });
        if (!res.ok) return [];
        return parseLetterboxd(await res.text());
    } catch {
        return [];
    }
};
