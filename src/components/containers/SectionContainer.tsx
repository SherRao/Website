"use client";

import React from "react";
import { motion, Transition } from "motion/react";

type SectionContainerProps = {
    id: string;
    children?: React.ReactNode;
    ref?: React.Ref<HTMLDivElement>;
    className?: string;
};

const viewport = { once: true, amount: 0.8 };
const transition = { duration: 0.8, ease: "easeOut" } as Transition;
const variants = {
    hidden: { opacity: 0.5, y: 150 },
    visible: { opacity: 1, y: 0 },
};

/**
 * TODO: docs
 * 
 * @param id
 * @param children
 * @param ref 
 * @param className
 * @returns 
 */
export const SectionContainer = {
    Flex: ({ id, children, ref, className }: SectionContainerProps) => (
        <motion.div
            id={`${id}-section`}
            ref={ref}
            className={`relative min-w-full min-h-full lg:px-50 px-10 text-center flex items-center justify-center snap-center ${className}`}

            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={transition}
            variants={variants}
        >

            {children}
        </motion.div>
    ),

    VerticalFlex: ({ id, children, ref, className }: SectionContainerProps) =>
        SectionContainer.Flex({ id: id, children: children, ref: ref, className: `flex-col ${className}` }),

    HorizontalFlex: ({ id, children, ref, className }: SectionContainerProps) =>
        SectionContainer.Flex({ id: id, children: children, ref: ref, className: `flex-row ${className}` }),
};