import React from "react";
import { Button, Group } from "@mantine/core";
import { SpotlightProvider, openSpotlight } from "@mantine/spotlight";
import { AiFillHome, AiFillDashboard, AiFillFile, AiOutlineSearch } from "react-icons/ai";

// function SpotlightControl() {
//     return (
//         <Group position="center">
//             <Button onClick={openSpotlight}>Open spotlight</Button>
//         </Group>
//     );
// }

const actions = [
    {
        title: "Home",
        description: "Go to the top of the page",
        icon: <AiFillHome size={18} />,
        onTrigger: () => window.location.href = "#home",
    },
    {
        title: "About",
        description: "Learn about some personal stuff about me!",
        icon: <AiFillDashboard size={18} />,
        onTrigger: () => window.location.href = "#about",
    },
    {
        title: "Music",
        description: "Visit documentation to lean more about all features",
        icon: <AiFillFile size={18} />,
        onTrigger: () => window.location.href = "#music",
    },
];
export default function Spotlight({children}) {
    return (
        <SpotlightProvider
            actions={actions}
            searchIcon={<AiOutlineSearch size={18} />}
            searchPlaceholder="Search..."
            shortcut={["ctrl + k", "mod + ctrl + k"]}
            nothingFoundMessage="Bruh try actually searching..."
        >
            {children}
        </SpotlightProvider>
    );
}