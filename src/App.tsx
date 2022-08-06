import { Router, useRoutes } from "@solidjs/router";
import { ThemeProvider } from "@suid/material/styles";
import { Component } from "solid-js";

import { routes } from "~/constants/routes";
import { createTheme } from "~/theme/createTheme";

const App: Component = () => {
  const Routes = useRoutes(routes);

  return (
    <ThemeProvider theme={createTheme}>
      <Router>
        <Routes />
      </Router>
    </ThemeProvider>
  );
};

export default App;
