"use client";

import { useEffect, useState } from "react";
import { offHours } from "@/content/panels";
import type { NowPlaying } from "@/lib/spotify";
import { Wave } from "./artworks";

const POLL_MS = 30_000;

/** Music i listen to: the track playing on Spotify right now, checked every 30s while the tab is visible. */
export const ListeningCard = () => {
    const [track, setTrack] = useState<NowPlaying | null>(null);

    useEffect(() => {
        let timer: number | undefined;
        const controller = new AbortController();
        const load = async () => {
            try {
                const res = await fetch("/api/spotify/now-playing", { signal: controller.signal });
                setTrack(res.ok ? ((await res.json()) as NowPlaying | null) : null);
            } catch {
                if (!controller.signal.aborted) setTrack(null);
            }
        };
        const start = () => {
            load();
            timer = window.setInterval(load, POLL_MS);
        };
        const stop = () => window.clearInterval(timer);
        const onVisibility = () => (document.hidden ? stop() : start());

        if (!document.hidden) start();
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            stop();
            controller.abort();
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    const playing = track?.isPlaying ? track : null;

    return (
        <div className="card" data-span="2">
            <span className="label-s">on repeat</span>
            <h3>music i listen to</h3>
            {playing ? (
                <a className="now-track" href={playing.url} target="_blank" rel="noopener noreferrer">
                    {/* Album art comes from Spotify's CDN; a plain img avoids adding it to next/image's allowed hosts. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {playing.albumArt ? <img src={playing.albumArt} alt="" width={52} height={52} /> : <span />}
                    <span>
                        <b>{playing.title}</b>
                        <span>{playing.artist}</span>
                    </span>
                </a>
            ) : (
                <p>{offHours.listening.hint}</p>
            )}
            <Wave />
            <p aria-live="polite">{playing ? "playing now on spotify" : "not listening right now"}</p>
        </div>
    );
};
