import { useNavigate } from "@solidjs/router";
import { AddCircle, Delete, DragHandle, Star } from "@suid/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@suid/material";
import {
  DragDropProvider,
  DragDropSensors,
  DragEvent,
  DragEventHandler,
  SortableProvider,
  closestCenter,
  createSortable,
  transformStyle,
  useDragDropContext,
} from "@thisbeyond/solid-dnd";
import { formatISO, parseISO } from "date-fns";
import { Firestore } from "firebase/firestore";
import {
  For,
  Suspense,
  VoidComponent,
  createEffect,
  createResource,
  createSignal,
  untrack,
} from "solid-js";
import { SetStoreFunction, reconcile } from "solid-js/store";
import { useUpdateEvent } from "../api";
import { Event, Talk, createEmptyTalk, nonEmptyTalk } from "../types";
import { getAccountsByUid } from "~/features/account/api";

const SortableTalk = (props: {
  talk: Talk;
  setTalk: (key: "speakerName" | "title", value: string) => void;
  deleteTalk: () => void;
  requireConfirmation: boolean;
}) => {
  const sortable = createSortable(props.talk.id);
  const [state] = useDragDropContext() || [{ active: { draggable: false } }];
  const [open, setOpen] = createSignal(false);
  const closeDialog = () => setOpen(false);

  return (
    <Box
      ref={sortable.ref}
      sx={{
        display: "flex",
        alignItems: "center",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
        ...transformStyle(sortable.transform),
      }}
    >
      <Box>
        <Box
          {...sortable.dragActivators}
          sx={{ paddingRight: "10px", cursor: state.active.draggable ? "grabbing" : "grab" }}
        >
          <DragHandle />
        </Box>
      </Box>
      <Box flexGrow={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="発表者名"
              value={props.talk.speakerName}
              onChange={(_, v) => props.setTalk("speakerName", v)}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="発表タイトル"
              value={props.talk.title}
              onChange={(_, v) => props.setTalk("title", v)}
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <IconButton
          onClick={() => (props.requireConfirmation ? setOpen(true) : props.deleteTalk())}
        >
          <Delete color="error" />
        </IconButton>
      </Box>
      <Dialog open={open()} onClose={closeDialog} maxWidth="lg">
        <DialogTitle>既存の発表枠を削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この発表枠に投稿されているコメントがある場合、削除後は表示できなくなります。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>キャンセル</Button>
          <Button variant="contained" color="error" onClick={() => props.deleteTalk()}>
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

type SortableTalkListProps = {
  talks: Talk[];
  setEvent: SetStoreFunction<Event>;
  currentTalkIds: string[];
};

const SortableTalkList: VoidComponent<SortableTalkListProps> = (props) => {
  const ids = () => props.talks.map((t) => t.id);
  const onDragEnd: DragEventHandler = ({ draggable, droppable }: DragEvent) => {
    if (draggable && droppable) {
      const currentItems = props.talks;
      const fromIndex = currentItems.findIndex((t) => t.id == draggable.id);
      const toIndex = currentItems.findIndex((t) => t.id == droppable.id);
      if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
        const updatedItems = currentItems.slice();
        const pickedItems = updatedItems.splice(fromIndex, 1);
        updatedItems.splice(toIndex, 0, ...pickedItems);
        props.setEvent("talks", reconcile(updatedItems));
      }
    }
  };
  const setTalk = (index: number) => {
    return (key: "speakerName" | "title", value: string) => {
      return props.setEvent("talks", index, key, value);
    };
  };
  const deleteTalk = (talkId: string) => {
    return () =>
      props.setEvent("talks", (talks) => {
        return talks.filter((t) => t.id !== talkId);
      });
  };
  return (
    <>
      <DragDropProvider onDragEnd={onDragEnd} collisionDetector={closestCenter}>
        <DragDropSensors />
        <Box>
          <SortableProvider ids={ids()}>
            <For each={props.talks}>
              {(talk, index) => (
                <SortableTalk
                  talk={talk}
                  setTalk={setTalk(index())}
                  deleteTalk={deleteTalk(talk.id)}
                  requireConfirmation={props.currentTalkIds.includes(talk.id)}
                />
              )}
            </For>
          </SortableProvider>
        </Box>
      </DragDropProvider>
    </>
  );
};

type UpdateEventProps = {
  firestore: Firestore;
  currentEvent: Event;
};

export const UpdateEvent: VoidComponent<UpdateEventProps> = (props) => {
  const navigate = useNavigate();
  // eslint-disable-next-line solid/reactivity
  const { event, setEvent, sendEventUpdate } = useUpdateEvent(props.firestore, props.currentEvent);

  const editorUids = [event.administrator].concat(event.collaborators);
  const [accounts] = createResource(editorUids, (uids) => getAccountsByUid(props.firestore, uids));

  // 削除前に確認が必要な発表枠のID
  const currentTalkIds = untrack(() => event.talks.filter(nonEmptyTalk).map((t) => t.id));

  const appendTalk = () => {
    setEvent("talks", (talks) => [...talks, createEmptyTalk()]);
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <TextField
            label="イベント名"
            value={event.name}
            fullWidth
            onChange={(_, v) => setEvent("name", v)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            type="date"
            label="イベント開催日"
            fullWidth
            value={formatISO(event.date, { representation: "date" })}
            onChange={(_, v) => setEvent("date", parseISO(v))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            label="イベントページのURL"
            fullWidth
            value={event.url || ""}
            onChange={(_, v) => setEvent("url", v)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Twitterハッシュタグ"
            placeholder="Webナイト宮崎"
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: <Typography># </Typography> }}
            value={event.hashTag || ""}
            onChange={(_, v) => setEvent("hashTag", v)}
          />
        </Grid>
      </Grid>
      <Box sx={{ marginTop: "1em", marginBottom: "1em" }}>
        <SortableTalkList talks={event.talks} setEvent={setEvent} currentTalkIds={currentTalkIds} />
      </Box>
      <Box sx={{ marginTop: "1em", marginBottom: "1em" }}>
        <Button
          fullWidth
          variant="contained"
          color="success"
          startIcon={<AddCircle />}
          onClick={appendTalk}
        >
          発表枠を追加する
        </Button>
      </Box>
      <Divider />

      <Box sx={{ marginTop: "1em", marginBottom: "1em" }}>
        イベント管理者 :
        <Suspense>
          <Chip
            icon={<Star />}
            label={accounts()?.find((account) => event.administrator)?.displayName}
          />
          <For each={event.collaborators}>
            {(uid) => <Chip label={accounts()?.find((account) => account.uid)?.displayName} />}
          </For>
        </Suspense>
      </Box>
      <Box textAlign="center">
        <Button
          variant="contained"
          onClick={() => sendEventUpdate().then(() => navigate(`/event/${event.id}`))}
        >
          イベントを保存する
        </Button>
      </Box>
    </Container>
  );
};
