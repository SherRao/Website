import React from "react";
import { ThemeProvider } from "styled-components";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";

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

    black: "#121212",
    white: "#F5F5F5",
    colorScheme: "dark",
    primaryColor: "blue",
    primaryShade: {light: 5, dark: 5},

    colors: {
        dark: [
            "#F2F2F2",
            "#DBDBDB",
            "#C4C4C4",
            "#ADADAD",
            "#969696",
            "#808080",
            "#666666",
            "#4D4D4D",
            "#333333",
            "#1A1A1A"
        ],
        blue: [
            "#E7FBFE",
            "#BBF5FB",
            "#90EEF9",
            "#65E8F6",
            "#39E1F4",
            "#0EDBF1",
            "#0BAFC1",
            "#088391",
            "#065760",
            "#032C30"
        ],

        red: [
            "#FFE5E6",
            "#FFB8BA",
            "#FF8A8D",
            "#FF5C61",
            "#FF2E34",
            "#FF0008",
            "#CC0006",
            "#990005",
            "#660003",
            "#330002"
        ],

        grey: [
            "#F2F2F2",
            "#DBDBDB",
            "#C4C4C4",
            "#ADADAD",
            "#969696",
            "#808080",
            "#666666",
            "#4D4D4D",
            "#333333",
            "#1A1A1A"
        ],

        green: [
            "#ECF8F0",
            "#CBECD6",
            "#AADFBB",
            "#88D2A1",
            "#67C686",
            "#46B96C",
            "#389456",
            "#2A6F41",
            "#1C4A2B",
            "#0E2516"
        ],
    },

    loader: "dots"
};

export function MantineTheme({ children }) {
    const [colorScheme, setColorScheme] = React.useState("dark");
    const toggleColorScheme = (value) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={mantineTheme}
            >
                {children}
            </MantineProvider>
        </ColorSchemeProvider>
    );
}
