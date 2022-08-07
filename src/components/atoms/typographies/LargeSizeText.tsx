import { useTheme } from "@suid/material";
import Typography from "@suid/material/Typography";
import { Component, JSXElement, mergeProps } from "solid-js";

export type Props = {
  children: JSXElement;
  color?: string;
};

const LargeSizeText: Component<Props> = (props) => {
  const theme = useTheme();
  const merged = mergeProps({ color: theme.palette.grey["700"] }, props);

  return (
    <Typography variant="subtitle1" fontWeight="bold" color={merged.color}>
      {merged.children}
    </Typography>
  );
};

export default LargeSizeText;
