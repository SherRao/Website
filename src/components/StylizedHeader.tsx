import React from "react";
import { cN } from "@/resources";

type StylizedHeaderProps = {
    title: string;
    className?: string;
};

export const StylizedHeader = ({ title, className }: StylizedHeaderProps) => {
    return (
        <h1 className={cN("", className)}>
            {title}
        </h1>
    );
};