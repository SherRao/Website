import React from "react";
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

    );
};

export { AppContainer };
