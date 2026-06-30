import type { IconType } from "react-icons";

export type SocialMedia = {
    title: string;
    handle: string;
    link: string;
    icon: IconType;
};

export type Education = {
    school: string;
    degree: string;
    startDate: string;
    endDate: string;
    location?: string;
};

export type Experience = {
    company: string;
    title: string;
    description: string;
    longDescription?: string;
    image?: string;
    url?: string;
    startDate: string;
    endDate: string;
    accent: string;
    tags?: string[];
};

export type Project = {
    name: string;
    tag: string;
    accent: string;
    image: string;
    url: string;
    description: string;
    year: string;
    role: string;
    stack?: string[];
};

export type Event = {
    name: string;
    short: string;
    meta: string;
    description: string;
    images: string[];
    url: string;
    accent: string;
    stats: { label: string; value: string }[];
};

export type Movie = {
    title: string;
    score: number;
};

export type SpotifyTrack = {
    title: string;
    artist: string;
    album: string;
    albumArt: string;
    url: string;
    isPlaying: boolean;
};

export type MusicTrack = {
    title: string;
    type: string;
    year: string;
    cover: string;
    description: string;
    duration: string;
    todo?: boolean;
};

export type GameProject = {
    title: string;
    type: string;
    year: string;
    cover: string;
    description: string;
    stack: string[];
    todo?: boolean;
};

export type Pillar = {
    title: string;
    accent: string;
    description: string;
    icon?: string;
};
