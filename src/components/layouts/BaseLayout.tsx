import { Outlet } from "@solidjs/router";
import { Component } from "solid-js";

import { Header } from "~/components/navs";

const BaseLayout: Component = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default BaseLayout;
