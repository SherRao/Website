import React from "react";
import { BsThreeDotsVertical as Divider } from "react-icons/bs";
import {
    RiDiscordLine as DiscordIcon,
    RiLinkedinLine as LinkedinIcon,
    RiInstagramLine as InstagramIcon,
    RiGithubLine as GithubIcon,
    RiFileTextLine as ResumeIcon,
    RiRestTimeLine as OldSiteIcon,
} from "react-icons/ri";

const SocialMediaBar = () => {
    const iconProps = {size: 50, className: "social-icon"};
    return (
        <div className="social-container">
            <SocialMediaIcon url="https://linkedin.com/in/nausherrao"
                icon={<LinkedinIcon {...iconProps} />}
            />
            <SocialMediaIcon url="https://discord.com/users/190984801929396224"
                icon={<DiscordIcon {...iconProps} />}
            />
            <SocialMediaIcon url="https://instagram.com/sherrao15/"
                icon={<InstagramIcon {...iconProps} />}
            />
            <SocialMediaIcon url="https://github.com/SherRao"
                icon={<GithubIcon {...iconProps} />}
            />

            <Divider style={{pointerEvents: "none"}} {...iconProps} />

            <SocialMediaIcon url="/resume.pdf"
                icon={<ResumeIcon {...iconProps} />}
            />
            <SocialMediaIcon url="/v1/index.html"
                icon={<OldSiteIcon {...iconProps} />}
            />
        </div>
    );
};

const SocialMediaIcon = ({icon, url}) => {
    return (
        <a href={url} target="_blank" rel="noreferrer">
            {icon}
        </a>
    );
};

export { SocialMediaBar };
