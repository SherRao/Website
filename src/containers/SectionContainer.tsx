import React from "react";

export type SectionContainerProps = {
    id: string;
    children: React.ReactNode;
    className?: string;
};

const SectionContainer = ({ id, children, className = "" }: SectionContainerProps) => (
    <div id={`${id}-section`} className={`w-full px-50 min-h-screen flex flex-col items-center justify-center text-center ${className}`} >
        {children}
    </div >
);

export default SectionContainer;