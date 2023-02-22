import React from "react";
import { NotificationsProvider } from "@mantine/notifications";
import { Spotlight, Theme, Router } from "@components";

const AppContainer = () => {
    return (
        <Theme>
            <NotificationsProvider>
                {/* <Spotlight> */}
                <Router />
                {/* </Spotlight> */}
            </NotificationsProvider>
        </Theme>
    );
};

export { AppContainer };
