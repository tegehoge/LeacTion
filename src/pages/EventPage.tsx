import { Link, useParams, useSearchParams } from "@solidjs/router";
import { ArrowDownward } from "@suid/icons-material";
import {
  Box,
  CircularProgress,
  Container,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@suid/material";
import { compareAsc } from "date-fns";
import { onSnapshot } from "firebase/firestore";
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
import { Toaster } from "solid-toast";
import { commentCollection } from "~/features/comment/api/firestoreConversion";
import { CommentList, CreateComment } from "~/features/comment/components";
import { Comment } from "~/features/comment/types";
import { getEvent } from "~/features/event/api";
import { EventHeader } from "~/features/event/components";
import { useAuthContext } from "~/providers/AuthProvider";
import { useFirestore } from "~/providers/FirebaseProvider";

const LoadingEvent: VoidComponent = () => {
  return (
    <Box textAlign="center" sx={{ marginTop: "2em" }}>
      <CircularProgress />
    </Box>
  );
};

const EventPage: VoidComponent = () => {
  const params = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams<{ tid: string }>();
  const firestore = useFirestore();
  const [auth, { signInAnonymously }] = useAuthContext();
  const currentUid = () => auth.uid || "";

  createEffect(() => {
    // uid がない場合は匿名認証で uid を獲得する
    if (!auth.loading && !auth.uid) {
      signInAnonymously();
    }
  });

  const [event] = createResource(() => getEvent(firestore, params.id));
  const [comments, setComments] = createStore<Comment[]>([]);

  // Firestore Realtime Update
  const unsubscribeComments = onSnapshot(commentCollection(firestore, params.id), (snapshot) => {
    setComments(reconcile(snapshot.docs.map((doc) => doc.data())));
    if (isBottom()) {
      scrollToBottom();
    } else {
      setUnread(true);
    }
    updateScrollPosition();
  });
  onCleanup(unsubscribeComments);

  const [talkId, setTalkId] = createSignal(searchParams.tid || "");
  const selectTalkId = (newTalkId: string) => {
    setSearchParams({ tid: newTalkId }, { replace: true });
    setTalkId(newTalkId);
    return resetScrollPosition();
  };

  createEffect(() => {
    if (!event.loading && event() && talkId() == "") {
      setTalkId(event()?.talks[0].id || "");
    }
  });

  const commentsForSelectedTalk = () => {
    return comments
      .filter((c) => c.talkId == talkId())
      .sort((a, b) => compareAsc(a.postedAt, b.postedAt));
  };

  const isEditable = () => {
    if (auth.loading || !auth.account) return false;
    return (
      event()?.createdBy == auth.account.uid ||
      event()?.managers.includes(auth.account.uid || "") ||
      false
    );
  };

  let commentBox!: HTMLDivElement;

  const [isBottom, setIsBottom] = createSignal(false);
  const [unread, setUnread] = createSignal(true);

  const scrollToBottom = () => {
    commentBox.scrollTop = commentBox.scrollHeight - commentBox.clientHeight;
  };

  const updateScrollPosition = () => {
    if (commentBox.clientHeight + commentBox.scrollTop === commentBox.scrollHeight) {
      setIsBottom(true);
      setUnread(false);
    } else {
      setIsBottom(false);
    }
  };

  const resetScrollPosition = () => {
    setIsBottom(false);
    setUnread(true);
    updateScrollPosition();
  };

  return (
    <Box height={"100dvh"} sx={{ display: "flex", flexDirection: "column" }}>
      <Box>
        <EventHeader
          eventId={event()?.id}
          eventName={event()?.name}
          eventHashTag={event()?.hashTag}
          isEditable={isEditable()}
        />
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
              onscroll={updateScrollPosition}
              ref={commentBox}
            >
              <CommentList
                firestore={firestore}
                comments={commentsForSelectedTalk()}
                currentUid={currentUid()}
              />
              <Box
                sx={{
                  textAlign: "center",
                  display: unread() ? "block" : "none",
                  position: "sticky",
                  bottom: "15px",
                  marginTop: "-3em",
                }}
              >
                <Fab variant="extended" onClick={scrollToBottom}>
                  <ArrowDownward />
                  最新のコメントを見る
                </Fab>
              </Box>
            </Box>
            <Box>
              <Container>
                <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                  <FormControl fullWidth variant="filled" size="small">
                    <InputLabel>発表</InputLabel>
                    <Select value={talkId()} onChange={(e) => selectTalkId(e.target.value)}>
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
      <Toaster position="bottom-right" />
    </Box>
  );
};

export default EventPage;
