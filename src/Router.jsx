import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import { LandingPage } from "@pages";

export function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={LandingPage}/>
                
                <Route>
                    <Redirect to="/"/>
                </Route>
            </Switch>
        </BrowserRouter>
    );
}