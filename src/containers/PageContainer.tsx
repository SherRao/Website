"use client";

import React from "react";

type PageContainerProps = {
    children: React.ReactNode;
}

export const PageContainer = ({ children }: PageContainerProps) => (
    <div id="app-container" className="w-full min-h-screen flex flex-col items-center relative z-3 gap-50 overflow-hidden">
        {children}
    </div>
);
