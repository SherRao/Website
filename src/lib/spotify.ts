export type NowPlaying = {
    title: string;
    artist: string;
    album: string;
    albumArt: string;
    url: string;
    isPlaying: boolean;
};

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";

/** Turns Spotify's currently-playing response into what the page needs, or null if nothing usable is playing. */
export const parseNowPlaying = (data: unknown): NowPlaying | null => {
    const d = data as {
        is_playing?: boolean;
        item?: {
            name?: string;
            artists?: { name: string }[];
            album?: { name?: string; images?: { url: string }[] };
            external_urls?: { spotify?: string };
        };
    } | null;
    const item = d?.item;
    if (!item?.name) return null;
    return {
        title: item.name,
        artist: (item.artists ?? []).map((a) => a.name).join(", "),
        album: item.album?.name ?? "",
        albumArt: item.album?.images?.[0]?.url ?? "",
        url: item.external_urls?.spotify ?? "",
        isPlaying: Boolean(d?.is_playing),
    };
};

/**
 * Asks Spotify what's playing. Returns null when nothing is, when credentials are missing, or on any failure,
 * so the page never breaks. Credentials are optional, so their absence is quiet; with them set, a failure is
 * logged on the server, or a revoked token would look like "not listening" forever. Credentials stay on the server.
 */
export const getNowPlaying = async (): Promise<NowPlaying | null> => {
    const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
    if (!id || !secret || !refresh) return null;
    try {
        const tokenRes = await fetch(TOKEN_URL, {
            method: "POST",
            headers: {
                Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            // POST requests are never cached, so this doesn't stop the route caching for 30s.
            body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
        });
        const { access_token: token, error } = (await tokenRes.json()) as { access_token?: string; error?: string };
        if (!token) {
            console.error(`spotify: token refresh failed (${tokenRes.status} ${error ?? "no token"})`);
            return null;
        }
        const res = await fetch(NOW_PLAYING_URL, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 30 },
        });
        // 204: nothing is playing.
        if (res.status === 204) return null;
        if (res.status !== 200) {
            console.error(`spotify: currently-playing failed (${res.status})`);
            return null;
        }
        return parseNowPlaying(await res.json());
    } catch (err) {
        console.error("spotify: request failed", err);
        return null;
    }
};
