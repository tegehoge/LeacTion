import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Paper,
} from "@suid/material";
import { Firestore } from "firebase/firestore";
import { JSX, VoidComponent, createSignal, untrack } from "solid-js";

import { Comment } from "../types";
import { DeleteComment } from "./DeleteComment";
import { LikeComment } from "./LikeComment";

type SingleCommentProps = {
  firestore: Firestore;
  comment: Comment;
  currentUid: string;
};

export const SingleComment: VoidComponent<SingleCommentProps> = (props) => {
  const [linkUrl, setLinkUrl] = createSignal<string | null>(null);
  const closeDialog = () => setLinkUrl(null);
  const open = () => !!linkUrl();
  const openLinkInNewTab = () => {
    const url = linkUrl();
    if (url) {
      window.open(url, "_blank");
      closeDialog();
    }
  };

  const plainTextToHtml = (content: string): JSX.Element[] => {
    const target = untrack(() => content);
    const [first, ...rest] = target.split("\n").map((s) => <span>{s}</span>);
    return rest.reduce<JSX.Element[]>((prev, curr) => prev.concat(<br />, curr), [first]);
  };

  const contentToHtml = (content: string) => {
    const target = untrack(() => content);
    const matches = target.matchAll(/https?:\/\/([\w-]+\.)+[\w:-]+(\/[\w./?%&#=~-]*)?/g);
    const result: JSX.Element[] = [];
    let cursor = 0;
    for (const match of matches) {
      if (match.index !== undefined) {
        if (cursor !== match.index) {
          result.push(...plainTextToHtml(target.slice(cursor, match.index)));
        }
        const url = match[0];
        result.push(
          <Link onClick={() => setLinkUrl(url)} sx={{ cursor: "pointer" }}>
            {url}
          </Link>
        );
        cursor = match.index + url.length;
      }
    }
    result.push(...plainTextToHtml(target.slice(cursor)));
    return result;
  };

  return (
    <Paper
      sx={{ display: "flex", padding: ["0.3rem", "0.5rem"], alignItems: "flex-start" }}
      title={props.comment.postedAt.toLocaleString()}
    >
      <Box flexGrow={1} sx={{ overflowWrap: "anywhere" }}>
        {contentToHtml(props.comment.content)}
      </Box>
      <Box sx={{ marginTop: "-5px", marginBottom: "-5px" }}>
        <DeleteComment
          firestore={props.firestore}
          comment={props.comment}
          currentUid={props.currentUid}
        />
      </Box>
      <Box sx={{ marginTop: "-5px", marginBottom: "-5px" }}>
        <LikeComment
          firestore={props.firestore}
          comment={props.comment}
          currentUid={props.currentUid}
        />
      </Box>
      <Dialog open={open()} maxWidth="lg" onBackdropClick={closeDialog}>
        <DialogTitle>URLの確認</DialogTitle>
        <DialogContent>
          <DialogContentText>
            このURLを開こうとしています。問題ありませんか？
            <br />
            {linkUrl()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>キャンセル</Button>
          <Button variant="outlined" color="warning" onClick={openLinkInNewTab}>
            リンクを開く
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
