import { ThumbUp, ThumbUpOutlined } from "@suid/icons-material";
import { Badge, IconButton } from "@suid/material";
import { Firestore } from "firebase/firestore";
import { Match, Switch, VoidComponent } from "solid-js";
import { likeComment } from "../api";
import { Comment } from "../types";

type LikeCommentProps = {
  firestore: Firestore;
  comment: Comment;
  currentUid: string;
};

export const LikeComment: VoidComponent<LikeCommentProps> = (props) => {
  const isMyComment = () => props.comment.postedBy == props.currentUid;
  const isLikedByMe = () => props.comment.likedBy.includes(props.currentUid);

  return (
    <IconButton
      size="small"
      title="いいね！"
      disabled={isMyComment()}
      onClick={() =>
        likeComment(
          props.firestore,
          props.comment.eventId,
          props.comment.id,
          props.currentUid,
          !isLikedByMe()
        )
      }
    >
      <Badge badgeContent={props.comment.likedBy.length}>
        <Switch>
          <Match when={isMyComment()}>
            <ThumbUp color="disabled" />
          </Match>
          <Match when={isLikedByMe()}>
            <ThumbUp color="success" />
          </Match>
          <Match when={!isLikedByMe()}>
            <ThumbUpOutlined />
          </Match>
        </Switch>
      </Badge>
    </IconButton>
  );
};
