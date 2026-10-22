import { afterEach, describe, expect, it, vi } from "vitest";
import { getNowPlaying, parseNowPlaying } from "@/lib/spotify";

const fixture = {
    is_playing: true,
    item: {
        name: "Motion Sickness",
        artists: [{ name: "Phoebe Bridgers" }],
        album: { name: "Stranger in the Alps", images: [{ url: "https://i.scdn.co/image/abc" }] },
        external_urls: { spotify: "https://open.spotify.com/track/xyz" },
    },
};

describe("parseNowPlaying", () => {
    it("reads a playing track", () => {
        expect(parseNowPlaying(fixture)).toEqual({
            title: "Motion Sickness",
            artist: "Phoebe Bridgers",
            album: "Stranger in the Alps",
            albumArt: "https://i.scdn.co/image/abc",
            url: "https://open.spotify.com/track/xyz",
            isPlaying: true,
        });
    });

    it("joins several artists", () => {
        const two = { ...fixture, item: { ...fixture.item, artists: [{ name: "A" }, { name: "B" }] } };
        expect(parseNowPlaying(two)?.artist).toBe("A, B");
    });

    it("returns null when nothing is playing", () => {
        expect(parseNowPlaying(null)).toBeNull();
        expect(parseNowPlaying({ is_playing: false })).toBeNull();
    });
});

describe("getNowPlaying", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    it("returns null without credentials and never calls spotify", async () => {
        vi.stubEnv("SPOTIFY_CLIENT_ID", "");
        const fetchSpy = vi.fn();
        vi.stubGlobal("fetch", fetchSpy);
        expect(await getNowPlaying()).toBeNull();
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("returns null when spotify fails", async () => {
        vi.stubEnv("SPOTIFY_CLIENT_ID", "id");
        vi.stubEnv("SPOTIFY_CLIENT_SECRET", "secret");
        vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "refresh");
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
        expect(await getNowPlaying()).toBeNull();
    });

    it("returns the track when spotify answers", async () => {
        vi.stubEnv("SPOTIFY_CLIENT_ID", "id");
        vi.stubEnv("SPOTIFY_CLIENT_SECRET", "secret");
        vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "refresh");
        vi.stubGlobal(
            "fetch",
            vi
                .fn()
                .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: "t" })))
                .mockResolvedValueOnce(new Response(JSON.stringify(fixture), { status: 200 })),
        );
        expect((await getNowPlaying())?.title).toBe("Motion Sickness");
    });
});
