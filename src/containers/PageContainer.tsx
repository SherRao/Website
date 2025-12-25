"use client";

import React from "react";

type PageContainerProps = {
    children: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
};

export const PageContainer = ({ children, ref }: PageContainerProps) => (
    <div id="page-container" ref={ref} className="w-full min-h-screen flex flex-col items-center relative z-3 gap-50 overflow-hidden">
        {children}
    </div>
);
