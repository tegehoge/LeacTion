import { useNavigate } from "@solidjs/router";
import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
import Container from "@suid/material/Container";
import { createEffect, createSignal, Match, Switch, VoidComponent } from "solid-js";
import { Loading } from "../organisms/Loading";
import { LargeButtonWithRouterLink } from "~/components/atoms/buttons";
import { LargeHeading } from "~/components/atoms/typographies";
import { EventList } from "~/components/organisms/events/EventList";
import { useAuthContext } from "~/firebase/AuthProvider";

const MyPage: VoidComponent = () => {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const [displayName, setDisplayName] = createSignal<string>("");

  createEffect(() => {
    if (!auth.loading) {
      const currentAccount = auth.account;
      if (currentAccount) {
        setDisplayName(currentAccount.displayName);
      } else {
        navigate("/");
      }
    }
  });
  const signOutToTop = () => {
    auth.signOut().then(() => navigate("/"));
  };

  return (
    <Switch>
      <Match when={auth.loading}>
        <Loading />
      </Match>
      <Match when={auth.account}>
        <Container maxWidth="lg">
          <LargeHeading gutterBottom>管理イベント一覧</LargeHeading>
          <Button onClick={signOutToTop}>ログアウト</Button>
          <Box>
            <LargeButtonWithRouterLink href="/new">
              イベントを新規登録する
            </LargeButtonWithRouterLink>
          </Box>
          <EventList uid={auth.account!.uid} />
        </Container>
      </Match>
    </Switch>
  );
};

export default MyPage;
