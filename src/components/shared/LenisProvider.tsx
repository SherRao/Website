"use client";

import React from "react";
import ReactLenis, { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";

/**
 * Lenis smooth-scroll root provider with a scroll-to-top side effect on
 * pathname changes (Lenis otherwise holds onto the previous page's scroll
 * and intercepts plain window.scrollTo calls).
 */
export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <ReactLenis root options={{ lerp: 0.07, wheelMultiplier: 1 }} />
            <ScrollResetOnRoute />
            {children}
        </>
    );
};

const ScrollResetOnRoute = () => {
    const pathname = usePathname();
    const lenis = useLenis();

    React.useEffect(() => {
        if (lenis) {
            lenis.scrollTo(0, { immediate: true, lock: true, force: true });
        }
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }, [pathname, lenis]);

    return null;
};
