"use client";

import React from "react";

type SectionContainerProps = {
    id: string;
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    className?: string;
    addionalClassName?: string;
};

/**
 * 
 * @param id
 * @param children
 * @param className
 * @param addionalClassName
 * @returns 
 */
export const SectionContainer = (
    { id, children, ref, className = "min-w-full min-h-full lg:px-50 px-10 text-center", addionalClassName = "flex flex-col items-center justify-center" }:
        SectionContainerProps) => (
    <div id={`${id}-section`} ref={ref} className={`${addionalClassName} ${className}`}>
        {children}
    </div>
);