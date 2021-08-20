import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { AppContainer } from "@layouts";
import { Router } from "./Router";
import { Theme } from "./Theme";

ReactDOM.render(
    <React.StrictMode>
        <AppContainer>
            <Theme>
                <Router />
            </Theme>
        </AppContainer>
    </React.StrictMode>,
    document.getElementById("root")
);
