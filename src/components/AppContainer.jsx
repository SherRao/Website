import React from "react";
import { Center } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import { Spotlight } from "@components";
import { Theme, Router } from "@misc";

const AppContainer = () => {
    return (
        <Theme>
            <NotificationsProvider>
                <Spotlight>
                    <Center style={{ height: "100vh" }}>
                        <Router />
                    </Center>
                </Spotlight>
            </NotificationsProvider>
        </Theme>
    );
};

export { AppContainer };
