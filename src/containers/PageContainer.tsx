"use client";

import React from "react";

type PageContainerProps = {
    children: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
};

export const PageContainer = ({ children, ref }: PageContainerProps) => (
    <div id="page-container" ref={ref} className="min-w-screen min-h-screen flex flex-col items-center z-3 gap-50">
        {children}
    </div>
);
