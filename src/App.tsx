import { Router, useRoutes } from "@solidjs/router";
import CssBaseline from "@suid/material/CssBaseline";
import { ThemeProvider } from "@suid/material/styles";
import { Component } from "solid-js";

import { routes } from "~/routes";
import { theme } from "~/theme";

const App: Component = () => {
  const Routes = useRoutes(routes);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes />
      </Router>
    </ThemeProvider>
  );
};

export default App;
