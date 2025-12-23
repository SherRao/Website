import React from "react";
import { image } from "motion/react-client";
import { LiaGithub, LiaLinkedin, LiaTwitter, LiaDiscord } from "react-icons/lia";

import type { IconType } from "react-icons";

export type Personal = {
    name: string;
    email: string;
    phone: string;
    location: string;
    country: string;
};

export type SocialMedia = {
    title: string;
    link: string;
    icon: IconType;
};

export type Education = {
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
};

export type Experience = {
    company: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
};

export type Skills = {
    name: string;
    level: string;
};

export type Project = {
    name: string;
    description: string;
    image: string;
    url: string;
};

export const personal: Personal = {
    name: "Nausher Rao",
    email: "nausher@konfer.ca",
    phone: "+1 (437) 996 8786",
    location: "Waterloo, ON",
    country: "Canada",
};

export const socials: SocialMedia[] = [
    {
        title: "GitHub",
        link: "https://github.com/SherRao",
        icon: LiaGithub,
    },
    {
        title: "LinkedIn",
        link: "https://linkedin.com/in/nausherrao",
        icon: LiaLinkedin,
    },
    {
        title: "Twitter",
        link: "https://twitter.com/SherRao15",
        icon: LiaTwitter,
    },
    {
        title: "Discord",
        link: "https://discord.com/users/393976349565181952",
        icon: LiaDiscord,
    },
];

export const education: Education[] = [
    { school: "Wilfrid Laurier University", degree: "BSc Computer Science", startDate: "Sept. 2019", endDate: "Apr. 2024" },
    { school: "Wilfrid Laurier University", degree: "Applied Mathematics Option", startDate: "Sept. 2019", endDate: "Apr. 2024" }
];

export const skills: Skills[] = [
    { name: "", level: "" }
];

export const projects: Project[] = [
    { name: "", description: "", image: "", url: "" }
];