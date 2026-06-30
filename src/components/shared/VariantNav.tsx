"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const VARIANTS = [
    { href: "/editorial", label: "editorial", num: "01" },
    { href: "/brutalist", label: "brutalist", num: "02" },
    { href: "/studio", label: "studio", num: "03" },
] as const;

type VariantNavProps = {
    /** Base styling preset matched to the active variant. */
    tone?: "dark" | "light" | "auto";
};

/**
 * Floating top-right pill that lets the user jump between v4 variants.
 * Only mounted on the variant pages, not on the picker landing.
 */
export const VariantNav = ({ tone = "dark" }: VariantNavProps) => {
    const pathname = usePathname();

    const wrapperTone =
        tone === "light"
            ? "bg-background/80 text-foreground border-foreground/10"
            : "bg-foreground/5 text-foreground border-foreground/15 backdrop-blur-xl";

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex items-center gap-2"
        >
            <Link
                href="/"
                className={`hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-full border text-[0.65rem] font-mono uppercase tracking-widest no-underline hover:opacity-100 transition-opacity ${wrapperTone}`}
            >
                <span className="opacity-60">←</span>
                <span>all variants</span>
            </Link>

            <div className={`flex items-center gap-0.5 p-0.5 sm:gap-1 sm:p-1 rounded-full border ${wrapperTone}`}>
                {VARIANTS.map((v) => {
                    const active = pathname === v.href;
                    return (
                        <Link
                            key={v.href}
                            href={v.href}
                            className={`relative px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[0.55rem] sm:text-[0.65rem] font-mono uppercase tracking-widest no-underline transition-colors duration-200 ${
                                active ? "text-background" : "hover:opacity-100 opacity-60"
                            }`}
                        >
                            {active && (
                                <motion.span
                                    layoutId="variant-pill-bg"
                                    className="absolute inset-0 rounded-full bg-perlwinkle"
                                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                                <span className="opacity-60 hidden sm:inline">{v.num}</span>
                                <span>{v.label}</span>
                            </span>
                        </Link>
                    );
                })}
            </div>
        </motion.div>
    );
};
