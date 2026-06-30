import type { SpotifyTrack } from "@/data/types";

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const getAccessToken = async (): Promise<string | null> => {
    if (!client_id || !client_secret || !refresh_token) return null;

    const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

    const response = await fetch(SPOTIFY_TOKEN_URL, {
        method: "POST",
        headers: {
            Authorization: `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token,
        }),
    });

    const data = await response.json();
    return data.access_token ?? null;
};

/**
 * Returns the currently playing Spotify track, or null if nothing is playing.
 */
export async function GET() {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) return Response.json(null);

        const response = await fetch(SPOTIFY_NOW_PLAYING_URL, {
            headers: { Authorization: `Bearer ${accessToken}` },
            next: { revalidate: 30 },
        });

        if (response.status === 204 || response.status > 400)
            return Response.json(null);

        const data = await response.json();
        if (!data.item)
            return Response.json(null);

        const track: SpotifyTrack = {
            title: data.item.name,
            artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
            album: data.item.album.name,
            albumArt: data.item.album.images[0]?.url ?? "",
            url: data.item.external_urls.spotify,
            isPlaying: data.is_playing,
        };

        return Response.json(track);

    } catch {
        return Response.json(null);
    }
}
