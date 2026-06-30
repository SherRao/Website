"use client";

import React from "react";

export const VariantBody = () => {
    React.useEffect(() => {
        document.body.dataset.variant = "studio";
    }, []);
    return null;
};
