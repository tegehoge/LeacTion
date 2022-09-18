import { Outlet } from "@solidjs/router";
import { Component } from "solid-js";

import { Header } from "~/components/organisms/navs";

export const BaseLayout: Component = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};
