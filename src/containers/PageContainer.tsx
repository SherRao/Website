"use client";

import React from "react";

export type PageContainerProps = {
    children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => (
    <div id="app-container" className="w-full min-h-screen flex flex-col items-center relative z-3 gap-50">
        {children}
    </div>
);

export default PageContainer;