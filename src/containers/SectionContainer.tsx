"use client";

import React from "react";

export type SectionContainerProps = {
    id: string;
    children?: React.ReactNode;
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
const SectionContainer = (
    { id, children,
        className = "w-full lg:px-50 px-10 min-h-screen text-center overflow-hidden",
        addionalClassName = "flex flex-col items-center justify-center"
    }: SectionContainerProps) => (
    <div id={`${id}-section`} className={`${addionalClassName} ${className}`} >
        {children}
    </div >
);

export default SectionContainer;