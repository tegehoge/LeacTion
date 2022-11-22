import { lazy } from "solid-js";

/**
 * Solid Routerで使用する設定項目。ルーティング先を追加する場合は、この場所に追加していく
 * @ref: https://github.com/solidjs/solid-router#config-based-routing
 */

export const routes = [
  {
    path: "/",
    component: lazy(() =>
      import("~/components/templates/BaseLayout").then(({ BaseLayout }) => ({
        default: BaseLayout,
      }))
    ),
    children: [
      {
        path: "/",
        component: lazy(() =>
          import("~/components/pages/Top").then(({ Top }) => ({ default: Top }))
        ),
      },

      {
        path: "/mypage",
        component: lazy(() =>
          import("~/components/pages/MyPage").then(({ MyPage }) => ({ default: MyPage }))
        ),
      },

      {
        path: "/new",
        component: lazy(() =>
          import("~/components/pages/EventNew").then(({ EventNew }) => ({ default: EventNew }))
        ),
      },
    ],
  },
];
