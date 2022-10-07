import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { ComingSoonPage, HomePage, NotFoundPage } from "@pages";
import { ErrorBoundary } from "@components";

const Router = () => {
    return (
        <ErrorBoundary>
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
                        path="resume"
                        element={<Navigate to="/resume.pdf" replace />}
                    />
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    );
};

export { Router };
