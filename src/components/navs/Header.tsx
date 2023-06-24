import { useNavigate } from "@solidjs/router";
import { Person } from "@suid/icons-material";
import { Button, Skeleton } from "@suid/material";
import AppBar from "@suid/material/AppBar";
import Box from "@suid/material/Box";
import Toolbar from "@suid/material/Toolbar";
import Typography from "@suid/material/Typography";
import { Component, Match, Switch } from "solid-js";

import { RouterLink } from "~/components/links";
import { AccountMenuButton } from "~/features/account/components/AccountMenuButton";
import { useAuthContext } from "~/providers/AuthProvider";

export const Header: Component = () => {
  const [auth, { signOut, updateDisplayName }] = useAuthContext();
  const navigate = useNavigate();

  return (
    <header>
      <Box>
        <AppBar position="static" sx={{ padding: 0 }}>
          <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold" }}>
              <RouterLink href="/">LeacTion!</RouterLink>
            </Typography>
            <Switch>
              <Match when={auth.loading}>
                <Skeleton />
              </Match>
              <Match when={auth.account}>
                <AccountMenuButton
                  account={auth.account!}
                  signOut={signOut}
                  updateDisplayName={updateDisplayName}
                />
              </Match>
              <Match when={!auth.account}>
                <Button variant="text" color="inherit" onClick={() => navigate("/login")}>
                  ログイン / アカウント作成
                </Button>
              </Match>
            </Switch>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
};
