import { letterboxdUser } from "@/content";
import { getRecentFilms } from "@/lib/letterboxd";

export const revalidate = 21600;

/** Recently watched films from Letterboxd, newest first. An empty list if the feed can't be reached. */
export const GET = async () => Response.json(await getRecentFilms(letterboxdUser));
