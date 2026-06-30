"use client";

import React from "react";
import { profile } from "@/data";

export const BrutalistFooter = () => (
    <footer className="relative w-full px-6 sm:px-10 lg:px-16 py-12 border-t border-ink/15">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs uppercase tracking-widest text-ink/60">
            <div className="flex flex-col gap-1">
                <span className="text-ink/40">[01] who</span>
                <span className="text-ink">{profile.nameLower}</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-ink/40">[02] where</span>
                <span className="text-ink">{profile.location.toLowerCase()}</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-ink/40">[03] currently</span>
                <span className="text-ink">founder · konfer</span>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-ink/40">[04] source</span>
                <a
                    href="https://github.com/SherRao"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:text-perlwinkle"
                >
                    github →
                </a>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-ink/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[0.6rem] font-mono uppercase tracking-widest text-ink/40">
            <span>© 2026 nausher rao · all rights reserved</span>
            <span>v4 / 02 · brutalist · build {new Date().getFullYear()}.{(new Date().getMonth() + 1).toString().padStart(2, "0")}</span>
        </div>
    </footer>
);
