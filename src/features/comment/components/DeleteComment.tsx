import { Firestore } from "firebase/firestore";
import { VoidComponent } from "solid-js";
import { Comment } from "../types";

type DeleteCommentProps = {
  firestore: Firestore;
  comment: Comment;
};

export const DeleteComment: VoidComponent<DeleteCommentProps> = (props) => {
  return <p>Not Implemented.</p>;
};
