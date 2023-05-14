import { Link, useNavigate } from "@solidjs/router";
import Button from "@suid/material/Button";
import CircularProgress from "@suid/material/CircularProgress";
import { Component, Match, Switch } from "solid-js";
import { useAuthContext } from "~/providers/AuthProvider";

type Props = {
  redirectPath: string;
};

export const LoginButton: Component<Props> = (props) => {
  const navigate = useNavigate();
  const [auth, { signInWithPopup }] = useAuthContext();
  const signIn = () =>
    signInWithPopup()
      .then((_) => navigate(props.redirectPath))
      .catch((e) => {
        console.error(e);
      });

  return (
    <Switch>
      <Match when={auth.loading}>
        <Button variant="contained" fullWidth size="large">
          <CircularProgress color="inherit" size="1.6rem" />
        </Button>
      </Match>
      <Match when={!auth.account}>
        <Button variant="contained" fullWidth size="large" onClick={signIn}>
          Googleアカウントでログインする
        </Button>
      </Match>
      <Match when={auth.account}>
        <Link href={props.redirectPath}>
          <Button variant="contained" fullWidth size="large">
            マイページへ
          </Button>
        </Link>
      </Match>
    </Switch>
  );
};
