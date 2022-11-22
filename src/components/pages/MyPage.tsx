import { useNavigate } from "@solidjs/router";
import Box from "@suid/material/Box";
import Container from "@suid/material/Container";
import { getAuth } from "firebase/auth";
import { useAuth } from "solid-firebase";
import { createEffect, Match, Show, Switch, VoidComponent } from "solid-js";
import { LargeButtonWithRouterLink } from "~/components/atoms/buttons";
import { LargeHeading } from "~/components/atoms/typographies";
import { EventList } from "~/components/organisms/events/EventList";
import { useFirebaseApp } from "~/firebase/FirebaseProvider";

export const MyPage: VoidComponent = () => {
  const navigate = useNavigate();
  const app = useFirebaseApp();
  const auth = getAuth(app);
  const authState = useAuth(auth);

  createEffect(() => {
    if (!(authState.loading || authState.data)) {
      navigate("/");
    }
  });

  return (
    <Switch>
      <Match when={authState.loading}>
        <Container>
          <Box textAlign="center">Loading...</Box>
        </Container>
      </Match>
      <Match when={authState.data}>
        <Container maxWidth="lg">
          <LargeHeading gutterBottom>管理イベント一覧</LargeHeading>
          <Box>
            <LargeButtonWithRouterLink href="/new">
              イベントを新規登録する
            </LargeButtonWithRouterLink>
          </Box>
          <EventList uid={authState.data?.uid || ""} />
        </Container>
      </Match>
    </Switch>
  );
};
