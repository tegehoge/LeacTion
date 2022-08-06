import { Routes, Router, Route } from "@solidjs/router";
import { Component, For } from "solid-js";

import { routes } from "~/constants/routes";

const App: Component = () => {
  return (
    <Router>
      <Routes>
        <For each={routes}>{(route) => <Route {...route} />}</For>
      </Routes>
    </Router>
  );
};

export default App;
