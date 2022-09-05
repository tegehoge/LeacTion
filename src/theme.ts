import { createTheme } from "@suid/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      light: "#dbeafe",
      main: "#066cb5",
    },
    grey: {
      700: "#374151",
    },
  },
  breakpoints: {
    values: {
      "2sm": 768,
    },
  },
  typography: {
    fontFamily: [
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "Noto Sans",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      "Noto Color Emoji",
    ].join(","),
  },
});
