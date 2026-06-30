"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaSpotify } from "react-icons/fa";
import type { SpotifyTrack } from "@/data/types";

const POLL_INTERVAL_MS = 30_000;

type NowPlayingProps = {
    /** Visual treatment per variant. */
    variant?: "chip" | "minimal" | "sticker";
};

export const NowPlaying = ({ variant = "chip" }: NowPlayingProps) => {
    const [track, setTrack] = React.useState<SpotifyTrack | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let cancelled = false;

        const fetchNowPlaying = async () => {
            try {
                const res = await fetch("/api/spotify/now-playing");
                const data: SpotifyTrack | null = await res.json();
                if (!cancelled) setTrack(data);
            } catch {
                if (!cancelled) setTrack(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchNowPlaying();
        const interval = setInterval(fetchNowPlaying, POLL_INTERVAL_MS);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    if (loading) return <NowPlayingSkeleton variant={variant} />;
    return <NowPlayingCard track={track} variant={variant} />;
};

const NowPlayingSkeleton = ({ variant }: { variant: NowPlayingProps["variant"] }) => {
    if (variant === "minimal") {
        return (
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground/30">
                <FaSpotify className="text-foreground/30" />
                <span>loading…</span>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/10 max-w-80">
            <div className="w-10 h-10 rounded-md bg-white/5 animate-pulse" />
            <div className="flex flex-col gap-1.5">
                <div className="w-24 h-2 rounded bg-white/10 animate-pulse" />
                <div className="w-32 h-2 rounded bg-white/10 animate-pulse" />
            </div>
        </div>
    );
};

const NowPlayingCard = ({
    track,
    variant,
}: {
    track: SpotifyTrack | null;
    variant: NowPlayingProps["variant"];
}) => {
    if (variant === "minimal") return <NowPlayingMinimal track={track} />;
    if (variant === "sticker") return <NowPlayingSticker track={track} />;
    return <NowPlayingChip track={track} />;
};

const NowPlayingChip = ({ track }: { track: SpotifyTrack | null }) => (
    <AnimatePresence mode="wait">
        {track ? (
            <motion.a
                key={track.title}
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/5 border border-white/10
                    hover:bg-white/10 hover:border-perlwinkle/30 transition-colors duration-300 no-underline max-w-80"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
            >
                <div className="relative shrink-0">
                    {track.albumArt && (
                        <img
                            src={track.albumArt}
                            alt={track.album}
                            width={40}
                            height={40}
                            className="rounded-md"
                        />
                    )}
                    {track.isPlaying && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-xs text-foreground/40 font-mono uppercase tracking-widest flex items-center gap-1.5">
                        <FaSpotify className="text-green-500 text-sm" />
                        {track.isPlaying ? "now playing" : "last played"}
                    </span>
                    <span className="text-sm text-foreground font-medium truncate">{track.title}</span>
                    <span className="text-xs text-foreground/50 truncate">{track.artist}</span>
                </div>
                {track.isPlaying && <EqualiserBars />}
            </motion.a>
        ) : (
            <motion.div
                key="idle"
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
            >
                <FaSpotify className="text-foreground/30 text-base" />
                <span className="text-xs text-foreground/30 font-mono uppercase tracking-widest">
                    not playing
                </span>
            </motion.div>
        )}
    </AnimatePresence>
);

const NowPlayingMinimal = ({ track }: { track: SpotifyTrack | null }) => (
    <AnimatePresence mode="wait">
        {track ? (
            <motion.a
                key={track.title}
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors duration-200 no-underline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <FaSpotify className="text-green-500" />
                <span className="text-foreground/30">{track.isPlaying ? "now_playing:" : "last_played:"}</span>
                <span className="truncate max-w-60">{track.title}</span>
                <span className="text-foreground/40 truncate max-w-40">— {track.artist}</span>
                {track.isPlaying && <EqualiserBars compact />}
            </motion.a>
        ) : (
            <motion.div
                key="idle"
                className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <FaSpotify />
                <span>now_playing: nothing</span>
            </motion.div>
        )}
    </AnimatePresence>
);

const NowPlayingSticker = ({ track }: { track: SpotifyTrack | null }) => (
    <AnimatePresence mode="wait">
        {track ? (
            <motion.a
                key={track.title}
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-3 py-3 rounded-2xl bg-foreground text-background no-underline shadow-[6px_6px_0_var(--perlwinkle)] hover:shadow-[8px_8px_0_var(--perlwinkle)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <div className="relative shrink-0">
                    {track.albumArt && (
                        <img src={track.albumArt} alt={track.album} width={48} height={48} className="rounded-lg" />
                    )}
                    {track.isPlaying && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-foreground" />
                    )}
                </div>
                <div className="flex flex-col min-w-0 max-w-56">
                    <span className="text-[0.6rem] font-mono uppercase tracking-widest text-background/50 flex items-center gap-1">
                        <FaSpotify className="text-green-500" />
                        {track.isPlaying ? "now playing" : "last played"}
                    </span>
                    <span className="text-sm font-bold truncate">{track.title}</span>
                    <span className="text-xs text-background/60 truncate">{track.artist}</span>
                </div>
                {track.isPlaying && <EqualiserBars dark />}
            </motion.a>
        ) : (
            <motion.div
                key="idle"
                className="inline-flex items-center gap-2 px-3 py-3 rounded-2xl bg-foreground text-background shadow-[6px_6px_0_var(--perlwinkle)]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <FaSpotify />
                <span className="text-xs font-mono uppercase tracking-widest">silence — for now</span>
            </motion.div>
        )}
    </AnimatePresence>
);

const EqualiserBars = ({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) => (
    <div className={`flex items-end gap-0.5 shrink-0 ${compact ? "h-3" : "h-4"} ${compact ? "" : "ml-auto"}`}>
        {[0, 0.2, 0.4].map((delay) => (
            <motion.span
                key={delay}
                className={`w-0.5 ${dark ? "bg-green-500" : "bg-green-500"} rounded-full`}
                animate={{ height: ["40%", "100%", "40%"] }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay,
                    ease: "easeInOut",
                }}
            />
        ))}
    </div>
);
