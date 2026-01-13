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
 * TODO: docs
 * 
 * @param id
 * @param children
 * @param ref 
 * @param className
 * @param addionalClassName
 * @returns 
 */
export const SectionContainer = {
    Flex: ({ id, children, ref, className }: SectionContainerProps) => (
        <div id={`${id}-section`} ref={ref} className={`relative min-w-full min-h-full lg:px-50 px-10 text-center flex items-center justify-center ${className}`}>
            {children}
        </div>
    ),

    VerticalFlex: ({ id, children, ref, className }: SectionContainerProps) =>
        SectionContainer.Flex({ id: id, children: children, ref: ref, className: `flex-col ${className}` }),

    HorizontalFlex: ({ id, children, ref, className }: SectionContainerProps) =>
        SectionContainer.Flex({ id: id, children: children, ref: ref, className: `flex-row ${className}` }),
};