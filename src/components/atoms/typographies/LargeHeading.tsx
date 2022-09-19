import { useTheme } from "@suid/material";
import Typography from "@suid/material/Typography";
import { Component, JSXElement, mergeProps } from "solid-js";

export type Props = {
  children: JSXElement;
  color?: string;
};

export const LargeHeading: Component<Props> = (props) => {
  const theme = useTheme();
  const merged = mergeProps({ color: theme.palette.grey["700"] }, props);

  return (
    <Typography variant="h5" fontWeight="bold" color={merged.color}>
      {merged.children}
    </Typography>
  );
};
