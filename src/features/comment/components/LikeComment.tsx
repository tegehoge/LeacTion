import { ThumbUp } from "@suid/icons-material";
import { Badge, IconButton } from "@suid/material";
import { Firestore } from "firebase/firestore";
import { VoidComponent } from "solid-js";
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
  const iconColor = () => {
    if (isMyComment()) return "disabled";
    if (isLikedByMe()) return "success";
    return "inherit";
  };

  return (
    <>
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
          <ThumbUp color={iconColor()} />
        </Badge>
      </IconButton>
    </>
  );
};
