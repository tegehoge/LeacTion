import { Link as BaseLink } from "@solidjs/router";
import { Component, JSXElement } from "solid-js";

import styles from "./link.module.css";
import type { RoutesPathType } from "~/constants/routes";

type Props = {
  href: RoutesPathType;
  children: JSXElement;
};

const Link: Component<Props> = (props) => {
  return (
    <BaseLink href={props.href} class={styles.disableAnchorStyle}>
      {props.children}
    </BaseLink>
  );
};

export default Link;
