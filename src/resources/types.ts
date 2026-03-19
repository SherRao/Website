import type { IconType } from "react-icons";

export type PersonalInfo = {
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
    color: string;
};

export type Skill = {
    name: string;
    level: string;
};

export type Event = {
    name: string;
    description: string;
    meta: string;
    images: string[];
    url: string;
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

export type RichTextSegment = string |
{
    text: string;
    underline?: boolean;
    bold?: boolean | number | string,
    color?: string;
    underlineColor?: string;
    className?: string
};
