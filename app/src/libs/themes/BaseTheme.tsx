import { extendTheme } from "@chakra-ui/react";

const config = {
    initialColorMode: "dark",
    useSystemColorMode: false, // Always use dark mode
};

const styles = {
    global: {
        body: {
            bg: "#121212", // Rich dark background
            color: "#EAEAEA", // Subtle off-white text for better contrast
        },
    },
};

const colors = {
    back: {
        900: "#0D0D0D", // Deep black
        800: "#121212", // Rich dark background
        700: "#1A1A1A", // Slightly lighter for sections
        600: "#222222", // Card backgrounds
        500: "#2A2A2A", // Borders and dividers
    },
    primary: {
        300: "#28A745", // Bright green for primary elements
        200: "#4CAF50", // Medium green for interactive elements
    },
    secondary: {
        200: "#66BB6A", // Light green for highlights
    },
    font: {
        900: "#EAEAEA", // Subtle off-white for headings
        800: "#CCCCCC", // Light gray for secondary text
        700: "#B3B3B3", // Dimmed gray for tertiary text
        600: "#8C8C8C", // Even dimmer gray for hints
        500: "#666666", // Borders and outlines
    },
    transparent: {
        white: {
            900: "rgba(255, 255, 255, 0.97)",
            800: "rgba(255, 255, 255, 0.8)",
            700: "rgba(255, 255, 255, 0.7)",
            600: "rgba(255, 255, 255, 0.6)",
            500: "rgba(255, 255, 255, 0.5)",
            400: "rgba(255, 255, 255, 0.4)",
        },
        black: {
            900: "rgba(0, 0, 0, 0.97)",
            800: "rgba(0, 0, 0, 0.8)",
            700: "rgba(0, 0, 0, 0.7)",
            600: "rgba(0, 0, 0, 0.6)",
            500: "rgba(0, 0, 0, 0.5)",
        },
    },
    shadow: {
        primary: {
            300: "0 0 5px #28A745",
            400: "0 0 10px #28A745",
            500: "0 0 15px #28A745",
        },
        secondary: {
            300: "0 0 5px #66BB6A",
            400: "0 0 10px #66BB6A",
        },
    },
};

const fonts = {
    heading: "Roboto",
    body: "Roboto",
};

const breakpoints = {
    sm: "321px",
    lsm: "480px",
    md: "768px",
    lg: "992px",
    xl: "1280px",
    "2xl": "1536px",
};

const theme = extendTheme({ config, styles, colors, fonts, breakpoints });

export default theme;
