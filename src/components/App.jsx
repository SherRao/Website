import React from "react";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

const App = () => {
    return (
        <AppContainer />
    );
};

const AppContainer = () => {
    const { height, width } = useWindowDimensions();
    const cols = Math.floor(width / 50);
    const rows = Math.floor(height / 50);
    return (
        <div className="app-container">
            {
                Array(cols * rows).fill(0).map(
                    (x, index) => <div key={index} className="tile"/>
                )
            }
        </div>
    );
};

export { App };
