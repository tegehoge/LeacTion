import Button from "@suid/material/Button";
import { Component, JSXElement } from "solid-js";

import { RouterLink } from "~/components/atoms/links";

export type Props = {
  href: string;
  children: JSXElement;
};

export const LargeButtonWithRouterLink: Component<Props> = (props) => {
  return (
    <RouterLink href={props.href}>
      <Button
        variant="contained"
        fullWidth
        size="large"
        sx={{
          fontWeight: "bold",
          letterSpacing: ".1em",
        }}
      >
        {props.children}
      </Button>
    </RouterLink>
  );
};
