import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage, NotFoundPage } from "@pages";

export function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}