import { getFilms } from "@/lib/letterboxd";

/** Recently watched films from Letterboxd, newest first, or the stored list if the feed can't be reached. */
export const GET = async () => Response.json(await getFilms());
