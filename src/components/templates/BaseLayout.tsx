import { Component, JSXElement } from "solid-js";
import { Header } from "~/components/molecules/navs";

export type Props = {
  children: JSXElement;
};

const BaseLayout: Component<Props> = (props) => {
  return (
    <>
      <Header />
      <main>{props.children}</main>
    </>
  );
};

export default BaseLayout;
