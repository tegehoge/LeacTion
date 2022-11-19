import { Router, useRoutes } from "@solidjs/router";
import CssBaseline from "@suid/material/CssBaseline";
import { ThemeProvider } from "@suid/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { attachDebugger } from "solid-devtools";
import { Component } from "solid-js";

import { Toast } from "~/components/atoms/toasts";
import { routes } from "~/routes";
import { theme } from "~/theme";

const App: Component = () => {
  const Routes = useRoutes(routes);
  const queryClient = new QueryClient();
  attachDebugger();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes />
          <Toast />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
