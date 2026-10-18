import { getNowPlaying } from "@/lib/spotify";

export const revalidate = 30;

/** The currently playing Spotify track, or null. */
export const GET = async () => Response.json(await getNowPlaying());
