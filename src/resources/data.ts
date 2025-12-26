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

    image?: string;
    url?: string;
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

export const experience: Experience[] = [
    {
        company: "NEAR Toronto",
        title: "Developer Relations Engineer",
        description: "Led engineering community and growth at NEAR Toronto.",
        // description: "Led engineering community and growth at NEAR Toronto. Organized 50+ meetups, hackathons, and workshops; produced technical content and developer onboarding. Drove engagement and adoption of decentralized tech through educational initiatives, partnerships, and ecosystem support.",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
        url: "https://near.org/",
        startDate: "May 2022",
        endDate: "Present"
    },
    {
        company: "SPUR",
        title: "Co-Founder & COO",
        description: "Co-founded SPUR (YC W22, acquired by LayerZero), a platform building secure multi-party computation infrastructure.",
        // description: "Co-founded SPUR (YC W22, acquired by LayerZero), a platform building secure multi-party computation infrastructure. Oversaw day-to-day operations, product development, and growth strategies through the journey from pre-seed to Y Combinator and eventual acquisition.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
        url: "https://www.linkedin.com/company/spurlabs/",
        startDate: "Oct. 2020",
        endDate: "Jul. 2023"
    },
    {
        company: "Konfer",
        title: "Founder & CEO",
        description: "Founded Konfer, a platform for productized AI solutions.",
        // description: "Founded Konfer, a platform for productized AI solutions. Led company vision, technology, and business development. Managed clients, developed AI products, and handled business operations from concept to prototype and client deployments.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
        url: "https://konfer.ca/",
        startDate: "Feb. 2020",
        endDate: "Present"
    }
];