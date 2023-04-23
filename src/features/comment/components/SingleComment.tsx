import { Paper } from "@suid/material";
import { VoidComponent } from "solid-js";

import { Comment } from "../types";

type SingleCommentProps = {
  comment: Comment;
};

export const SingleComment: VoidComponent<SingleCommentProps> = (props) => {
  return (
    <Paper sx={{ padding: ["0.3rem", "0.5rem"] }} title={props.comment.postedAt.toLocaleString()}>
      {props.comment.content}
    </Paper>
  );
};
