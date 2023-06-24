import { Router, useRoutes } from "@solidjs/router";
import CssBaseline from "@suid/material/CssBaseline";
import { ThemeProvider } from "@suid/material/styles";
import { Component } from "solid-js";

import { firebaseConfig } from "~/config";
import { AuthProvider } from "~/providers/AuthProvider";
import { FirebaseProvider } from "~/providers/FirebaseProvider";
import { routes } from "~/routes";
import { theme } from "~/theme";

const App: Component = () => {
  const Routes = useRoutes(routes);

  return (
    <FirebaseProvider config={firebaseConfig}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Routes />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
};

export default App;
