import { Link as BaseLink } from "@solidjs/router";
import { Component, JSXElement } from "solid-js";

import styles from "./link.module.css";

type Props = {
  href: string;
  children: JSXElement;
};

const RouterLink: Component<Props> = (props) => {
  return (
    <BaseLink href={props.href} class={styles.disableAnchorStyle}>
      {props.children}
    </BaseLink>
  );
};

export default RouterLink;
