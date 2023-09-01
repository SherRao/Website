import React from "react";
import ReactFullpage from '@fullpage/react-fullpage';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { App } from "@components";

const AppContainer = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<App/>}
                />

                <Route
                    path="v1"
                    element={<Navigate to="/v1/index.html"/>}
                />

                <Route
                    path="resume"
                    element={<Navigate to="/resume.pdf" replace />}
                />
            </Routes>
        </BrowserRouter>
        // <ReactFullpage
        //     licenseKey="gplv3-license"
        //     scrollingSpeed={1000}
        //     render={({ state, fullpageApi }) => (
        //         <ReactFullpage.Wrapper>
        //             <App state={state} fullpageApi={fullpageApi}/>
        //         </ReactFullpage.Wrapper>
        //     )}
        // />
    );
};



export { AppContainer };
