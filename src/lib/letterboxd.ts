import { XMLParser } from "fast-xml-parser";
import { cacheLife } from "next/cache";
import { getPanels, getProfile, type Film } from "@/content";
import { MONTHS } from "@/content/dates";

type FeedItem = {
    "letterboxd:filmTitle"?: string | number;
    "letterboxd:filmYear"?: number;
    "letterboxd:watchedDate"?: string;
    "letterboxd:memberRating"?: number;
};

/** A Letterboxd user's profile page. */
export const letterboxdProfile = (user: string) => `https://letterboxd.com/${encodeURIComponent(user)}`;

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

/** Recent films for a user. Throws if Letterboxd can't be reached or answers with an error. */
const fetchRecentFilms = async (user: string): Promise<Film[]> => {
    const res = await fetch(`https://letterboxd.com/${user}/rss/`);
    if (!res.ok) throw new Error(`Letterboxd responded ${res.status}`);
    return parseLetterboxd(await res.text());
};

/**
 * The feed, cached for six hours, or null if Letterboxd can't be reached. The failure is caught in here so its
 * shorter lifetime still reaches the page: an error thrown out of the cache would fail the prerender instead.
 */
const recentFilms = async (user: string): Promise<Film[] | null> => {
    "use cache";
    try {
        const films = await fetchRecentFilms(user);
        cacheLife("films");
        return films;
    } catch {
        cacheLife("filmsRetry");
        return null;
    }
};

/** Films for the site: live from Letterboxd, or the stored list if the feed is unreachable or empty. */
export const getFilms = async (): Promise<Film[]> => {
    const live = await recentFilms((await getProfile()).letterboxdUser);
    return live?.length ? live : (await getPanels()).fallbackFilms;
};
