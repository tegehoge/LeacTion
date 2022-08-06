import { lazy } from "solid-js";

// @ref: https://github.com/solidjs/solid-router#config-based-routing
export const routes = [
  {
    path: "/",
    component: lazy(() => import("~/components/pages/Home")),
  },
];
