import { cacheLife } from "next/cache";
import { getNowPlaying } from "@/lib/spotify";

/** Spotify is asked at most every 30s; visitors polling in between share the cached answer. */
const nowPlaying = async () => {
    "use cache";
    cacheLife("nowPlaying");
    return getNowPlaying();
};

/** The currently playing Spotify track, or null. */
export const GET = async () => Response.json(await nowPlaying());
