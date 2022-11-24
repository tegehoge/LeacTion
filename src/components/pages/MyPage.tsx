import { useNavigate } from "@solidjs/router";
import Box from "@suid/material/Box";
import Container from "@suid/material/Container";
import { getFirestore } from "firebase/firestore";
import { createEffect, createSignal, Match, Switch, VoidComponent } from "solid-js";
import { Loading } from "../organisms/Loading";
import { LargeButtonWithRouterLink } from "~/components/atoms/buttons";
import { LargeHeading } from "~/components/atoms/typographies";
import { EventList } from "~/components/organisms/events/EventList";
import { checkSignedInWithGoogle, useAuthState } from "~/firebase/Auth";
import { useFirebaseApp } from "~/firebase/FirebaseProvider";

const MyPage: VoidComponent = () => {
  const navigate = useNavigate();
  const app = useFirebaseApp();
  const authState = useAuthState();
  const firestore = getFirestore(app);
  const [displayName, setDisplayName] = createSignal<string>("");

  createEffect(() => {
    if (!authState.loading) {
      checkSignedInWithGoogle(authState, firestore)
        .then((account) => {
          setDisplayName(account.displayName);
        })
        .catch((e) => {
          console.log(e);
          navigate("/");
        });
    }
  });

  return (
    <Switch>
      <Match when={authState.loading}>
        <Loading />
      </Match>
      <Match when={authState.data}>
        <Container maxWidth="lg">
          <LargeHeading gutterBottom>管理イベント一覧</LargeHeading>
          <Box>
            <LargeButtonWithRouterLink href="/new">
              イベントを新規登録する
            </LargeButtonWithRouterLink>
          </Box>
          <EventList uid={authState.data!.uid} />
        </Container>
      </Match>
    </Switch>
  );
};

export default MyPage;
