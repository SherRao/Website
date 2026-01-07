"use client";

import React from "react";
import { projects } from "@/content";
import { MasonryGallery } from "@/components";
import { SectionContainer } from "@/containers";

export const ProjectsSection = () => {
    return (
        <SectionContainer id="projects" addionalClassName="min-h-screen py-100 gap-100 flex flex-col items-center justify-center">
            <div className="flex flex-col px-75 text-right items-end">
                <h2 className="text-5xl font-black text-right text-[#a374ff] text-nowrap self-start uppercase drop-shadow-sm">
                    {projects.title}
                </h2>

                {projects.description()}
            </div>

            <MasonryGallery />
        </SectionContainer>
    );
};