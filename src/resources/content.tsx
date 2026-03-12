

export const navbar = {
    cta: { text: "Resume", link: "/resume" },
};

export const hero = {
    name: "nausher rao",
    cta: { text: "see my work", href: "#about1-section" },
    headings: [
        { title: "software engineer", color: "var(--perlwinkle)" },
        { title: "project manager", color: "var(--airforce)" },
        { title: "entrepreneur", color: "#ffd074" },
    ],
};

export const about = {
    title: "who am i",
    tagline: "i craft experiences that bring people together",
    subtitle: [
        "a life-long programmer who also loves ",
        { text: "leadership, ", color: "#a374ff" },
        { text: "project management, ", color: "#ffd074" },
        { text: "event planning, ", color: "#17f1d1" },
        { text: "and live production.", color: "#ffd074" },
    ],
    bio: "i've been programming since i was 8 years old. i've recently pivoted to being a full-time founder and ceo after spending my entire undergrad founding and leading some of the largest tech-focused orgs in canada.",
    pillars: [
        {
            title: "engineering",
            accent: "#a374ff",
            description: "building software since age 8 — from selling minecraft server plugins as a kid to architecting full-stack platforms and developer tools.",
        },
        {
            title: "leadership",
            accent: "#17f1d1",
            description: "founded and scaled multiple tech-focused organizations, leading cross-functional teams of engineers, designers, and operations staff.",
        },
        {
            title: "events",
            accent: "#ffd074",
            description: "directed canada's second-largest hackathon — 1,400+ attendees, $100k+ in prizes, and 290 project submissions, all produced live.",
        },
        {
            title: "entrepreneurship",
            accent: "#a374ff",
            description: "pivoted to full-time founder and ceo, turning ideas into products and building ventures from zero to launch.",
        },
    ],
};

export const projects = {
    title: "my projects",
    description: () => (
        <p className="text-6xl text-left font-extralight text-gray-100 leading-relaxed tracking-wide">
            <span className="text-[#a374ff]">
                Lorem ipsum
            </span>
            {" dolor sit amet, "}
            <span className="text-[#17f1d1]" >
                consectetur adipiscing elit.
            </span>
            {" Morbi maximus "}
            <span className="underline underline-offset-4 decoration-[#a374ff]/80" >
                ultrices mi
            </span>
            {", ultricies vestibulum."}
        </p>
    )
};

export const contact = {
    title: "",
    cta: "",
};

export const events = {
    title: "Events",
    description: "a collection of events that i've hosted and am proud of.",
    cta: "See Event Details"
};

export const footer = {
    sourceCode: [
        "the source code for my website can be ",
        { text: "found on GitHub ", color: "#a374ff" },
        { text: "here!", color: "#17f1d1" }
    ],
    name: "nausher rao",
};