import React from "react";
import { Center } from "@mantine/core";
import { Router } from "@src/Router";
import { MantineTheme } from "@src/Theme";
    
export default function AppContainer() {
    return (
        <MantineTheme>
            <Center fluid style={{ height: "100vh" }}>
                <Router />
            </Center>
        </MantineTheme>
    );    
}