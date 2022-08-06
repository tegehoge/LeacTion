import { Routes, Router, Route } from "@solidjs/router";
import { ThemeProvider } from "@suid/material/styles";
import { Component, For } from "solid-js";

import { routes } from "~/constants/routes";
import { createTheme } from "~/theme/createTheme";

const App: Component = () => {
  return (
    <ThemeProvider theme={createTheme}>
      <Router>
        <Routes>
          <For each={routes}>{(route) => <Route {...route} />}</For>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
