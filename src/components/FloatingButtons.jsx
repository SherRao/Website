import React from "react";
import { getYoureALoserForUsingLightThemeNotification } from "@notifications";

import { ActionIcon, Container, useMantineColorScheme } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { openSpotlight } from "@mantine/spotlight";

import { AiFillBulb, AiOutlineBulb } from "react-icons/ai";
import { BsKeyboard } from "react-icons/bs";

const FloatingButtons = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    return (
        <Container style={{
            position: "fixed", top: 25, right: 25, paddingLeft: 45, paddingRight: 45,
            display: "flex", flexDirection: "row", justifyContent: "center",
        }}>
            <ActionIcon
                variant="outline"
                color={dark ? "yellow" : "blue"}
                onClick={() => {
                    toggleColorScheme();
                    showNotification(getYoureALoserForUsingLightThemeNotification());
                }}
                title="Toggle color scheme"
                style={{position: "fixed", top: 25, right: 25}}
            >
                {dark ? <AiFillBulb size={18} /> : <AiOutlineBulb size={18} />}
            </ActionIcon>


            <ActionIcon
                variant="outline"
                color="blue"
                onClick={openSpotlight}
                title="Toggle spotlight"
            >
                <BsKeyboard size={18} />
            </ActionIcon>
        </Container>
    );
};


export { FloatingButtons };
