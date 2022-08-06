import { createTheme as BaseCreateTheme } from "@suid/material/styles";

export const createTheme = BaseCreateTheme({
  palette: {
    primary: {
      light: "#dbeafe",
      main: "#066cb5",
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
