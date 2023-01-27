import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { ComingSoonPage, HomePage } from "@pages";
import { ErrorMessage } from "@components";

const Router = () => {
    return (
        <ErrorMessage>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<ComingSoonPage/>}
                    />

                    <Route
                        path="test"
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
