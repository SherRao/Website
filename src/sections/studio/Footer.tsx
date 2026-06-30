"use client";

import React from "react";
import dynamic from "next/dynamic";
import { profile } from "@/data";
import { NowPlaying } from "@/components/shared/NowPlaying";

const RotatingCreeper = dynamic(
    () => import("@/components/shared/RotatingCreeper").then((m) => m.RotatingCreeper),
    { ssr: false }
);

export const StudioFooter = () => (
    <footer className="relative w-full px-6 sm:px-10 lg:px-16 py-16 border-t-2 border-foreground/15 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="text-[0.65rem] font-mono uppercase tracking-widest text-foreground/40">
                    ◆ end credits
                </div>
                <h3 className="font-heading uppercase leading-[0.85] tracking-tighter text-[clamp(2.5rem,9vw,9rem)]">
                    {profile.nameLower}
                    <span className="text-warm italic">.</span>
                </h3>
                <NowPlaying variant="sticker" />
            </div>

            <div className="lg:col-span-4 relative h-48 lg:h-64 rounded-3xl border-2 border-foreground/15 bg-foreground/[0.02] overflow-hidden">
                <RotatingCreeper scale={0.05} mouseRotation={false} autoRotate />
                <span className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-foreground text-background text-[0.55rem] font-mono uppercase tracking-widest">
                    creeper.fbx
                </span>
            </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono uppercase tracking-widest text-foreground/55">
            <div className="flex flex-col gap-1">
                <span className="text-foreground/30">[01] based in</span>
                <span className="text-foreground">{profile.location.toLowerCase()}</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-foreground/30">[02] currently</span>
                <span className="text-foreground">founder & ceo, konfer</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-foreground/30">[03] inbox</span>
                <a href={`mailto:${profile.email}`} className="text-foreground hover:text-warm">
                    {profile.email}
                </a>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-foreground/30">[04] source</span>
                <a
                    href="https://github.com/SherRao"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-perlwinkle"
                >
                    sherrao on github →
                </a>
            </div>
        </div>

        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[0.6rem] font-mono uppercase tracking-widest text-foreground/40">
            <span>© 2026 nausher rao · all rights reserved</span>
            <span>v4 / 03 · studio · made with too much coffee</span>
        </div>
    </footer>
);
