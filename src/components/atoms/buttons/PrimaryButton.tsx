import Button from "@suid/material/Button";
import { Component, JSXElement, mergeProps } from "solid-js";

export type Props = {
  onClick: () => void;
  startIcon?: JSXElement;
  fullWidth?: boolean;
  children: JSXElement;
};

export const PrimaryButton: Component<Props> = (props) => {
  const mergedProps = mergeProps({ fullWidth: false }, props);

  return (
    <Button
      component="button"
      sx={{
        fontWeight: "bold",
        letterSpacing: ".1em",
      }}
      onClick={() => mergedProps.onClick()}
      variant="contained"
      fullWidth={mergedProps.fullWidth}
      startIcon={mergedProps.startIcon}
    >
      {mergedProps.children}
    </Button>
  );
};
