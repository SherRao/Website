

export const navbar = {
    cta: { text: "Resume", link: "/resume" },
};

export const hero = {
    headings: [
        { title: "software engineer", color: "#a374ff", },
        { title: "project manager", color: "#17f1d1", push: "right" },
        { title: "entrepreneur", color: "#ffd074", push: "left" },
    ],
};

export const about = {
    title: "who am i",
    icons: [
        {
            modelUrl: "/models/pc.fbx",
            title: "beginning",
            description: "i've been programming since i was 8 years old, and became an entreprenuer VERY early on by selling Minecraft server plugins as a freelancer (definitely not legal for my age)."
        },

        {
            modelUrl: "/models/rocket.fbx",
            title: "fast-paced",
            description: "overall, i've worked in quite fast-paced and unconvential environments since the start of my career."
        },

        {
            modelUrl: "/models/megaphone.fbx",
            title: "founder",
            description: "i've recently pivoted to being a full-time founder and ceo after spending my entire undergrad founding and leading some of the largest tech-focused orgs in canada!"
        },
    ],


    description: () => (
        <p className="lg:text-7xl px-50 text-lg font-extralight text-gray-100 leading-relaxed tracking-wide">
            {"a life-long programmer who also loves "}
            <span className="text-[#a374ff]">leadership,</span>
            {" "}
            <span className="text-[#ffd074]">project management,</span>
            {" "}
            <span className="text-[#17f1d1]">event planning,</span>
            {" "}
            <span className="text-[#ffd074]">and live production.</span>
        </p>
    ),

    paragraph1: " ",

    paragraph2: "other than nerdy programming, i absolutely love leading people and managing teams, both technical and non-technical. i've recently spent time working as a project manager, software engineer, business development manager, live event/stage manager, and entrepreneur -- all at the same time! "
};

export const projects = {
    title: "my projects",
    description: () => (
        <p className="text-6xl text-left font-extralight text-gray-100 leading-relaxed tracking-wide">
            <span className="text-[#a374ff]">
                Lorem ipsum
            </ span >
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