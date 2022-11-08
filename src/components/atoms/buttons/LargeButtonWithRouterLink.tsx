import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
import { ParentComponent } from "solid-js";

import { RouterLink } from "~/components/atoms/links";

type Props = {
  href: string;
};

export const LargeButtonWithRouterLink: ParentComponent<Props> = (props) => {
  return (
    <Box marginBottom="40px">
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
    </Box>
  );
};
