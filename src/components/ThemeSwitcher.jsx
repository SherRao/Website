import React from "react";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { FaSun, FaMoon } from "react-icons/fa";


export default function ThemeSwitcher() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    return (
        <ActionIcon
            variant="outline"
            color={dark ? "yellow" : "blue"}
            onClick={() => {throw "ERRORADAS!";}}
            title="Toggle color scheme"
        >
            {dark ? <FaSun size={18} /> : <FaMoon size={18} />}
        </ActionIcon>
    );
}