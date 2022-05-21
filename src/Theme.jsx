import React from "react";
import { ThemeProvider } from "styled-components";
import { MantineProvider } from "@mantine/core";

const styledTheme = {
    colors: {
        blue: "#087E8B",
        red: "#FF5A5F",
        black: "#3C3C3C",
        white: "##F5F5F5",
        green: "#8FD5A6",
        purple: "#6600FF"
    },

    fonts: {
        title: "Zen Kurenaido",
        caption: "Montserrat",

        header: "Nunito",
        subHeader: "Nunito",
        body: "Montserrat",
    },

    fontSizes: {
        title: "3em",
        caption: "1.2em",

        header: "2em",
        subHeader: "1.6em",
        body: "1em",
    },

    transitions: {
        link: "0.25s",
        button: "0.35s",
        logo: "0.5s",
    },

    shadows: {
        blur: "2px",
        elevations: {
            low: "1px",
            med: "5px",
            high: "15px"
        }
    }
};

export function StyledTheme(props) {
    return (
        <ThemeProvider theme={styledTheme}>
            {props.children}
        </ThemeProvider>
    );
}

const mantineTheme = {
    fontFamily: "Montserrat",
    headings: {
        fontFamily: "Zen Kurenaido",
        sizes: {
            h1: { fontSize: "3.5em" },
            h2: { fontSize: "2.5em" },
            h3: { fontSize: "2em" }
        }
    },
};

export function MantineTheme({ children }) {
    return (
        <MantineProvider theme={mantineTheme}>
            {children}
        </MantineProvider>
    );
}