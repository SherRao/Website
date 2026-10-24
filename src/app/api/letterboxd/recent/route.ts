import { getFilms } from "@/lib/letterboxd";

export const revalidate = 21600;

/** Recently watched films from Letterboxd, newest first, or the stored list if the feed can't be reached. */
export const GET = async () => Response.json(await getFilms());
