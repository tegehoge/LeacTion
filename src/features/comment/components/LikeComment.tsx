import { Firestore } from "firebase/firestore";
import { VoidComponent } from "solid-js";
import { Comment } from "../types";

type LikeCommentProps = {
  firestore: Firestore;
  comment: Comment;
};

export const LikeComment: VoidComponent<LikeCommentProps> = (props) => {
  return <p>Not Implemented.</p>;
};
