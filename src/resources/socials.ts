import React from 'react';

export type Socials = {
    name: "Instagram" | "Twitter" | "LinkedIn" | "GitHub" | "YouTube" | "TikTok" | "Twitch" | "Discord" | "Reddit" | "Steam" | "Steam";
    url: string;
    icon: string;
}

export const socials: Socials[] = [
    {
        name: 'Twitter',
        url: 'https://twitter.com/yourusername',
        icon: 'twitter',
    },
];