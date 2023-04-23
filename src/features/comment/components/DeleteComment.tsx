import { Firestore } from "firebase/firestore";
import { VoidComponent } from "solid-js";
import { LeactionComment } from "../types/LeactionComment";

type DeleteCommentProps = {
  firestore: Firestore;
  comment: LeactionComment;
};

export const DeleteComment: VoidComponent<DeleteCommentProps> = (props) => {
  return <p>Not Implemented.</p>;
};
