import { Delete } from "@suid/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@suid/material";
import { Firestore } from "firebase/firestore";
import { Show, VoidComponent, createSignal } from "solid-js";
import { deleteComment } from "../api";
import { Comment } from "../types";

type DeleteCommentProps = {
  firestore: Firestore;
  comment: Comment;
  currentUid: string;
};

export const DeleteComment: VoidComponent<DeleteCommentProps> = (props) => {
  const [open, setOpen] = createSignal(false);
  const openDeleteConfirm = () => {
    setOpen(true);
  };
  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <Show when={props.comment.postedBy == props.currentUid}>
      <IconButton size="small" title="コメントを削除する" onClick={openDeleteConfirm}>
        <Delete />
      </IconButton>
      <Dialog open={open()} onClose={closeDialog}>
        <DialogTitle>コメントを削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.comment.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>キャンセル</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteComment(props.firestore, props.comment.eventId, props.comment.id)}
          >
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </Show>
  );
};
