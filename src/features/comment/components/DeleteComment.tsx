import { Firestore } from "firebase/firestore";
import { VoidComponent } from "solid-js";
import { Comment } from "../types/Comment";

type DeleteCommentProps = {
  firestore: Firestore;
  comment: Comment;
};

export const DeleteComment: VoidComponent<DeleteCommentProps> = (props) => {
  return <p>Not Implemented.</p>;
};
