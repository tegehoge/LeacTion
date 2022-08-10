import { Outlet } from "@solidjs/router";
import { Component } from "solid-js";
import { Header } from "~/components/organisms/navs";

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
