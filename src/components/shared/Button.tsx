"use client";

import React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: undefined;
    };

type ButtonAsLink = CommonProps & {
    href: string;
    target?: string;
    rel?: string;
    onClick?: never;
    type?: never;
    disabled?: never;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

const VARIANT_STYLES: Record<ButtonVariant, string> = {
    primary:
        "bg-perlwinkle text-background hover:bg-perlwinkle/90 hover:-translate-y-0.5 active:translate-y-0",
    secondary:
        "bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5 active:translate-y-0",
    ghost:
        "bg-transparent text-foreground hover:bg-foreground/10",
    outline:
        "bg-transparent text-foreground border border-foreground/20 hover:border-perlwinkle hover:text-perlwinkle",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs tracking-widest uppercase",
    md: "px-5 py-2.5 text-sm tracking-widest uppercase",
    lg: "px-7 py-3.5 text-base tracking-widest uppercase",
};

const BASE =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium font-mono transition-all duration-200 cursor-pointer no-underline whitespace-nowrap";

/**
 * Reusable button primitive used across all variants.
 * Renders as an <a> when `href` is provided, otherwise as a <button>.
 */
export const Button = ({
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...rest
}: ButtonProps) => {
    const classes = `${BASE} ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`;

    if ("href" in rest && rest.href !== undefined) {
        const isExternal = rest.href.startsWith("http") || rest.href.startsWith("mailto:");
        if (isExternal) {
            return (
                <a
                    href={rest.href}
                    target={rest.target ?? "_blank"}
                    rel={rest.rel ?? "noopener noreferrer"}
                    className={classes}
                >
                    {children}
                </a>
            );
        }
        return (
            <Link href={rest.href} className={classes}>
                {children}
            </Link>
        );
    }

    return (
        <button {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)} className={classes}>
            {children}
        </button>
    );
};
