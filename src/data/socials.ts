import { LiaGithub, LiaLinkedin, LiaTwitter, LiaDiscord } from "react-icons/lia";
import type { SocialMedia } from "./types";

export const socials: SocialMedia[] = [
    {
        title: "GitHub",
        handle: "SherRao",
        link: "https://github.com/SherRao",
        icon: LiaGithub,
    },
    {
        title: "LinkedIn",
        handle: "in/nausherrao",
        link: "https://linkedin.com/in/nausherrao",
        icon: LiaLinkedin,
    },
    {
        title: "Twitter",
        handle: "@SherRao15",
        link: "https://twitter.com/SherRao15",
        icon: LiaTwitter,
    },
    {
        title: "Discord",
        handle: "@nausher",
        link: "https://discord.com/users/393976349565181952",
        icon: LiaDiscord,
    },
];
