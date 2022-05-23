import React from "react";
import { Center } from "@mantine/core";

import { Spotlight } from "@components";
import { MantineTheme } from "@src/Theme";
import { Router } from "@src/Router";
    
export default function AppContainer() {
    return (
        <MantineTheme>
            <Spotlight>
                <Center fluid style={{ height: "100vh" }}>
                    <Router />
                </Center>
            </Spotlight>
        </MantineTheme>
    );    
}