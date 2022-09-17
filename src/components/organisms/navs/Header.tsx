import AppBar from "@suid/material/AppBar";
import Box from "@suid/material/Box";
import IconButton from "@suid/material/IconButton";
import Toolbar from "@suid/material/Toolbar";
import Typography from "@suid/material/Typography";
import { Component } from "solid-js";

import { GitHubIcon } from "~/components/atoms/icons";
import { ExternalLink, RouterLink } from "~/components/atoms/links";

export const Header: Component = () => {
  return (
    <header>
      <Box>
        <AppBar position="static" sx={{ padding: 0 }}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
              <RouterLink href="/">LeacTion!</RouterLink>
            </Typography>
            <ExternalLink href="https://github.com/tegehoge/LeacTion">
              <IconButton component="span">
                <GitHubIcon sx={{ color: "white" }} />
              </IconButton>
            </ExternalLink>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};
