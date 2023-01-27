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
                        path="old"
                        element={<Navigate to="/old/index.html"/>}
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
