import { useNavigate } from "@solidjs/router";
import Box from "@suid/material/Box";
import Container from "@suid/material/Container";
import { getAuth, GoogleAuthProvider, User } from "firebase/auth";
import { getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useAuth } from "solid-firebase";
import { createEffect, createSignal, Match, Switch, VoidComponent } from "solid-js";
import { Loading } from "../organisms/Loading";
import { LargeButtonWithRouterLink } from "~/components/atoms/buttons";
import { LargeHeading } from "~/components/atoms/typographies";
import { EventList } from "~/components/organisms/events/EventList";
import { signedInWithGoogleProvider, useAuthState } from "~/firebase/Auth";
import { useFirebaseApp } from "~/firebase/FirebaseProvider";
import { accountDoc } from "~/models/Account";

const MyPage: VoidComponent = () => {
  const navigate = useNavigate();
  const app = useFirebaseApp();
  const authState = useAuthState();
  const firestore = getFirestore(app);
  const [displayName, setDisplayName] = createSignal<string>("");

  createEffect(() => {
    if (!signedInWithGoogleProvider(authState)) {
      navigate("/");
    }
    if (authState.data) {
      const user = authState.data;
      const authDisplayName = user.displayName || "";
      const accountDocRef = accountDoc(firestore, user.uid);
      getDoc(accountDocRef).then((snapshot) => {
        if (!snapshot.exists()) {
          setDoc(accountDocRef, {
            uid: user.uid,
            displayName: authDisplayName,
          });
          setDisplayName(authDisplayName);
        } else {
          setDisplayName(snapshot.data().displayName);
        }
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
