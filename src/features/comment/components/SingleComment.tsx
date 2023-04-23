import { Box, Paper } from "@suid/material";
import { Firestore } from "firebase/firestore";
import { VoidComponent } from "solid-js";

import { Comment } from "../types";
import { DeleteComment } from "./DeleteComment";
import { LikeComment } from "./LikeComment";

type SingleCommentProps = {
  firestore: Firestore;
  comment: Comment;
  currentUid: string;
};

export const SingleComment: VoidComponent<SingleCommentProps> = (props) => {
  return (
    <Paper
      sx={{ display: "flex", padding: ["0.3rem", "0.5rem"], alignItems: "flex-start" }}
      title={props.comment.postedAt.toLocaleString()}
    >
      <Box flexGrow={1}>{props.comment.content}</Box>
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
    </Paper>
  );
};
