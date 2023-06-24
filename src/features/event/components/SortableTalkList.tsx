import { Delete, DragHandle } from "@suid/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@suid/material";
import {
  DragEventHandler,
  DragEvent,
  createSortable,
  transformStyle,
  useDragDropContext,
  DragDropProvider,
  closestCenter,
  DragDropSensors,
  SortableProvider,
} from "@thisbeyond/solid-dnd";
import { For, VoidComponent, createSignal } from "solid-js";
import { SetStoreFunction, reconcile } from "solid-js/store";
import { Talk, Event } from "../types";

type SortableTalkProps = {
  talk: Talk;
  setTalk: (key: "speakerName" | "title", value: string) => void;
  deleteTalk: () => void;
  requireConfirmation: boolean;
};

const SortableTalk: VoidComponent<SortableTalkProps> = (props) => {
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

export const SortableTalkList: VoidComponent<SortableTalkListProps> = (props) => {
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
