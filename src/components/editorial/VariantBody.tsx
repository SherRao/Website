"use client";

import React from "react";

/**
 * Sets the body[data-variant] attribute so that variant-specific overrides
 * in globals.css can apply (palette swaps, etc).
 *
 * NOTE: We don't clean up on unmount because in app-router page transitions
 * the next variant mounts BEFORE the previous one unmounts — running cleanup
 * would clobber the freshly-set variant.
 */
export const VariantBody = ({ variant }: { variant: "editorial" | "brutalist" | "studio" }) => {
    React.useEffect(() => {
        document.body.dataset.variant = variant;
    }, [variant]);

    return null;
};
