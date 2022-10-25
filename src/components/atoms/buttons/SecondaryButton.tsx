import Button from "@suid/material/Button";
import { common } from "@suid/material/colors";
import { ParentComponent, JSXElement, mergeProps } from "solid-js";

export type Props = {
  onClick: () => void;
  startIcon?: JSXElement;
  fullWidth?: boolean;
};

export const SecondaryButton: ParentComponent<Props> = (props) => {
  const mergedProps = mergeProps({ fullWidth: false }, props);

  return (
    <Button
      component="button"
      sx={{
        fontWeight: "bold",
        letterSpacing: ".1em",
        color: common.white,
      }}
      color="secondary"
      onClick={() => mergedProps.onClick()}
      variant="contained"
      fullWidth={mergedProps.fullWidth}
      startIcon={mergedProps.startIcon}
    >
      {mergedProps.children}
    </Button>
  );
};
