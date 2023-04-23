import { Link, useParams } from "@solidjs/router";
import { Menu } from "@suid/icons-material";
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Toolbar,
  Typography,
} from "@suid/material";
import { compareAsc } from "date-fns";
import { getFirestore, onSnapshot } from "firebase/firestore";
import {
  For,
  Match,
  Suspense,
  Switch,
  VoidComponent,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import { commentCollection } from "~/features/comment/api/firestoreConversion";
import { CommentList, CreateComment } from "~/features/comment/components";
import { Comment } from "~/features/comment/types";
import { getEvent } from "~/features/event/api";
import { useAuthContext } from "~/providers/AuthProvider";
import { useFirebaseApp } from "~/providers/FirebaseProvider";

const LoadingEvent: VoidComponent = () => {
  return (
    <Box textAlign="center">
      <CircularProgress />
    </Box>
  );
};

const EventPage: VoidComponent = () => {
  const params = useParams<{ id: string }>();
  const firestore = getFirestore(useFirebaseApp());
  const auth = useAuthContext();

  createEffect(() => {
    // uid がない場合は匿名認証で uid を獲得する
    if (!auth.loading && !auth.uid) {
      auth.signInAnonymously();
    }
  });

  const [event] = createResource(() => getEvent(firestore, params.id));
  const [comments, setComments] = createSignal<Comment[]>([]);

  // Firestore Realtime Update
  onSnapshot(commentCollection(firestore, params.id), (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const commentData = change.doc.data();
      // console.log(commentData);
      switch (change.type) {
        case "added":
          setComments((prev) => prev.concat([commentData]));
          break;
        case "removed":
          setComments((prev) => prev.filter((c) => c.id != commentData.id));
          break;
        case "modified":
          setComments((prev) => prev.map((c) => (c.id == commentData.id ? commentData : c)));
          break;
      }
    });
  });

  const [talkId, setTalkId] = createSignal("");
  createEffect(() => {
    if (!event.loading && event() && talkId() == "") {
      setTalkId(event()?.talks[0].id || "");
    }
  });

  const selectedTalkComments = () => {
    return comments()
      .filter((c) => c.talkId == talkId())
      .sort((a, b) => compareAsc(a.postedAt, b.postedAt));
  };

  return (
    <Box height={"100dvh"} sx={{ display: "flex", flexDirection: "column" }}>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Suspense fallback={<Skeleton variant="text" />}>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                {event()?.name}
              </Typography>
              <IconButton>
                <Menu fontSize="large" sx={{ color: "white" }} />
              </IconButton>
            </Suspense>
          </Toolbar>
        </AppBar>
      </Box>
      <Suspense fallback={<LoadingEvent />}>
        <Switch>
          <Match when={!event()}>
            <Box textAlign="center">
              <Typography variant="h4">お探しのイベントは見つかりませんでした</Typography>
              <Link href="/">LeacTion! トップページへ</Link>
            </Box>
          </Match>
          <Match when={event()}>
            <Box
              backgroundColor="#c1e4e9"
              flexGrow={1}
              overflow="auto"
              sx={{ paddingTop: "1rem", paddingBottom: "1rem" }}
            >
              <CommentList firestore={firestore} comments={selectedTalkComments()} />
            </Box>
            <Box>
              <Container>
                <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                  <FormControl fullWidth>
                    <InputLabel>発表</InputLabel>
                    <Select value={talkId()} onChange={(e) => setTalkId(e.target.value)}>
                      <For each={event()?.talks}>
                        {(talk) => (
                          <MenuItem value={talk.id}>
                            {talk.speakerName || "不明"} : {talk.title || "未定"}
                          </MenuItem>
                        )}
                      </For>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                  <CreateComment
                    firestore={firestore}
                    config={{ eventId: params.id, talkId: talkId(), postedBy: auth.uid || "dummy" }}
                  />
                </Box>
              </Container>
            </Box>
          </Match>
        </Switch>
      </Suspense>
    </Box>
  );
};

export default EventPage;
