import Box from "@suid/material/Box";
import CircularProgress from "@suid/material/CircularProgress";
import { VoidComponent } from "solid-js";

/**
 * ローディング画面
 * @returns
 */
export const Loading: VoidComponent = () => {
  return (
    <Box textAlign="center" margin="5em auto">
      <CircularProgress />
    </Box>
  );
};
