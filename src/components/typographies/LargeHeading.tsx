import { useTheme } from "@suid/material";
import Typography from "@suid/material/Typography";
import { TypographyProps } from "@suid/material/Typography";
import { ParentComponent, mergeProps, splitProps } from "solid-js";

export type Props = TypographyProps & {
  color?: string;
  gutterBottom?: boolean;
};

export const LargeHeading: ParentComponent<Props> = (props) => {
  const theme = useTheme();
  const merged = mergeProps({ color: theme.palette.grey["700"] }, props);
  const [local, restProps] = splitProps(merged, ["children"]);

  return (
    <Typography {...restProps} variant="h5" fontWeight="bold" gutterBottom={props.gutterBottom}>
      {local.children}
    </Typography>
  );
};
