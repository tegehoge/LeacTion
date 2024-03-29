import { lazy } from "solid-js";

/**
 * Solid Routerで使用する設定項目。ルーティング先を追加する場合は、この場所に追加していく
 * @ref: https://github.com/solidjs/solid-router#config-based-routing
 */

export const routes = [
  {
    path: "/",
    component: lazy(() => import("~/components/layouts/BaseLayout")),
    children: [
      {
        path: "/",
        component: lazy(() => import("~/pages/Top")),
      },
      { path: "/login", component: lazy(() => import("~/pages/LoginPage")) },
      {
        path: "/my-events",
        component: lazy(() => import("~/pages/MyEvents")),
      },
      {
        path: "/new",
        component: lazy(() => import("~/pages/EventNew")),
      },
      {
        path: "/event/:eventId/edit",
        component: lazy(() => import("~/pages/EventEdit")),
      },
      {
        path: "/event/:eventId/manager-request",
        component: lazy(() => import("~/pages/EventManagerRequest")),
      },
    ],
  },
  {
    path: "/event/:id",
    component: lazy(() => import("~/pages/EventPage")),
  },
];
