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
        className = "w-full px-50 min-h-screen text-center",
        addionalClassName = "flex flex-col items-center justify-center"
    }: SectionContainerProps) => (
    <div id={`${id}-section`} className={`${addionalClassName} ${className}`} >
        {children}
    </div >
);

export default SectionContainer;