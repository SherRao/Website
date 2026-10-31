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
        vi.restoreAllMocks();
    });

    const withCredentials = () => {
        vi.stubEnv("SPOTIFY_CLIENT_ID", "id");
        vi.stubEnv("SPOTIFY_CLIENT_SECRET", "secret");
        vi.stubEnv("SPOTIFY_REFRESH_TOKEN", "refresh");
    };
    const token = () => new Response(JSON.stringify({ access_token: "t" }));

    it("returns null without credentials, quietly, and never calls spotify", async () => {
        vi.stubEnv("SPOTIFY_CLIENT_ID", "");
        const fetchSpy = vi.fn();
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        vi.stubGlobal("fetch", fetchSpy);
        expect(await getNowPlaying()).toBeNull();
        expect(fetchSpy).not.toHaveBeenCalled();
        expect(log).not.toHaveBeenCalled();
    });

    it("returns null and logs when spotify can't be reached", async () => {
        withCredentials();
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
        expect(await getNowPlaying()).toBeNull();
        expect(log).toHaveBeenCalledOnce();
    });

    it("returns null and logs when the refresh token is rejected", async () => {
        withCredentials();
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ error: "invalid_grant" }), { status: 400 })),
        );
        expect(await getNowPlaying()).toBeNull();
        expect(log).toHaveBeenCalledWith("spotify: token refresh failed (400 invalid_grant)");
    });

    it("returns null quietly when nothing is playing", async () => {
        withCredentials();
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        vi.stubGlobal(
            "fetch",
            vi
                .fn()
                .mockResolvedValueOnce(token())
                .mockResolvedValueOnce(new Response(null, { status: 204 })),
        );
        expect(await getNowPlaying()).toBeNull();
        expect(log).not.toHaveBeenCalled();
    });

    it("returns null and logs when spotify answers with an error", async () => {
        withCredentials();
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        vi.stubGlobal(
            "fetch",
            vi
                .fn()
                .mockResolvedValueOnce(token())
                .mockResolvedValueOnce(new Response(null, { status: 429 })),
        );
        expect(await getNowPlaying()).toBeNull();
        expect(log).toHaveBeenCalledWith("spotify: currently-playing failed (429)");
    });

    it("returns the track when spotify answers", async () => {
        withCredentials();
        vi.stubGlobal(
            "fetch",
            vi
                .fn()
                .mockResolvedValueOnce(token())
                .mockResolvedValueOnce(new Response(JSON.stringify(fixture), { status: 200 })),
        );
        expect((await getNowPlaying())?.title).toBe("Motion Sickness");
    });
});
