import Button, { ButtonProps } from "@suid/material/Button";
import CircularProgress from "@suid/material/CircularProgress";
import { ParentComponent, mergeProps, Show, splitProps } from "solid-js";

export type Props = ButtonProps & {
  onClick?: () => void;
  isLoading?: boolean;
};

export const PrimaryButtonWithLoading: ParentComponent<Props> = (props) => {
  const mergedProps = mergeProps({ isLoading: false }, props);
  const [local, others] = splitProps(mergedProps, ["onClick"]);

  return (
    <Button
      component="button"
      sx={{
        fontWeight: "bold",
        letterSpacing: ".1em",
        minWidth: "200px",
      }}
      onClick={() => local.onClick && local.onClick()}
      variant="contained"
      {...others}
    >
      <Show
        when={!mergedProps.isLoading}
        fallback={<CircularProgress color="inherit" size={24.5} />}
      >
        {mergedProps.children}
      </Show>
    </Button>
  );
};
