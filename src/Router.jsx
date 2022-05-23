import React from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { ComingSoonPage, HomePage, NotFoundPage } from "@pages";

export function Router() {
    return (
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
                
                <Route
                    path="*"
                    element={<NotFoundPage/>}
                />
            </Routes>
        </BrowserRouter>
    );
}