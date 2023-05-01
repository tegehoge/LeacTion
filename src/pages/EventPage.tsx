import { Link, useNavigate, useParams } from "@solidjs/router";
import { AddCircle, Edit, Menu as MenuIcon, Share } from "@suid/icons-material";
import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
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
  onCleanup,
} from "solid-js";
import { createStore, reconcile } from "solid-js/store";
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
  const currentUid = () => auth.uid || "";

  createEffect(() => {
    // uid がない場合は匿名認証で uid を獲得する
    if (!auth.loading && !auth.uid) {
      auth.signInAnonymously();
    }
  });

  const [event] = createResource(() => getEvent(firestore, params.id));
  const [comments, setComments] = createStore<Comment[]>([]);

  // Firestore Realtime Update
  const unsubscribeComments = onSnapshot(commentCollection(firestore, params.id), (snapshot) => {
    setComments(reconcile(snapshot.docs.map((doc) => doc.data())));
  });
  onCleanup(unsubscribeComments);

  const [talkId, setTalkId] = createSignal("");
  createEffect(() => {
    if (!event.loading && event() && talkId() == "") {
      setTalkId(event()?.talks[0].id || "");
    }
  });

  const selectedTalkComments = () => {
    return comments
      .filter((c) => c.talkId == talkId())
      .sort((a, b) => compareAsc(a.postedAt, b.postedAt));
  };

  const [anchorEl, setAnchorEl] = createSignal<HTMLElement | null>(null);
  const menuOpen = () => !!anchorEl();
  const navigate = useNavigate();
  const canEdit = () =>
    event()?.administrator == auth.account?.uid ||
    event()?.collaborators.includes(auth.account?.uid || "");

  return (
    <Box height={"100dvh"} sx={{ display: "flex", flexDirection: "column" }}>
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Suspense fallback={<Skeleton variant="text" />}>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                {event()?.name}
              </Typography>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MenuIcon fontSize="large" sx={{ color: "white" }} />
              </IconButton>
              <Menu open={menuOpen()} anchorEl={anchorEl()} onClose={() => setAnchorEl(null)}>
                <MenuItem>
                  <ListItemIcon>
                    <Share fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>シェアする</ListItemText>
                </MenuItem>
                <Divider />
                <Switch>
                  <Match when={!auth.account}>
                    <MenuItem>
                      <ListItemIcon>
                        <Edit fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>ログインしてイベント編集権限をリクエスト</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => navigate("/")}>LeacTion! トップページ</MenuItem>
                  </Match>
                  <Match when={auth.account && !canEdit()}>
                    <MenuItem>
                      <ListItemIcon>
                        <Edit fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>イベント編集権限をリクエスト</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => navigate("/new")}>
                      <ListItemIcon>
                        <AddCircle fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>新しいイベントを作る</ListItemText>
                    </MenuItem>
                  </Match>
                  <Match when={canEdit()}>
                    <MenuItem>
                      <ListItemIcon>
                        <Edit fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>イベントを編集する</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => navigate("/new")}>
                      <ListItemIcon>
                        <AddCircle fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>新しいイベントを作る</ListItemText>
                    </MenuItem>
                  </Match>
                </Switch>
              </Menu>
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
            <Box backgroundColor="#c1e4e9" flexGrow={1} overflow="auto">
              <CommentList
                firestore={firestore}
                comments={selectedTalkComments()}
                currentUid={currentUid()}
              />
            </Box>
            <Box>
              <Container>
                <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                  <FormControl fullWidth size="small">
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
