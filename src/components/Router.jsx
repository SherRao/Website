import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { HomePage } from "@pages";
import { ErrorMessage } from "@components";

const Router = () => {
    return (
        <ErrorMessage>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<HomePage/>}
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
        </ErrorMessage>
    );
};

export { Router };
