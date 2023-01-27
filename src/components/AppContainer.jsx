import React from "react";
import { Center } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { Spotlight, Theme, Router } from "@components";

const AppContainer = () => {
    return (
        <Theme>
            <NotificationsProvider>
                <Spotlight>
                    <Center style={{ width: "100vw", height: "100vh" }}>
                        <Router />
                    </Center>
                </Spotlight>
            </NotificationsProvider>
        </Theme>
    );
};

export { AppContainer };
