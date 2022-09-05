import { Link } from "@solidjs/router";
import { Component, JSXElement } from "solid-js";

import styles from "./link.module.css";

type Props = {
  href: string;
  children: JSXElement;
};

export const RouterLink: Component<Props> = (props) => {
  return (
    <Link href={props.href} class={styles.disableAnchorStyle}>
      {props.children}
    </Link>
  );
};
