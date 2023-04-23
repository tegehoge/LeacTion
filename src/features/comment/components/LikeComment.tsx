import { Firestore } from "firebase/firestore";
import { VoidComponent } from "solid-js";
import { LeactionComment } from "../types/LeactionComment";

type LikeCommentProps = {
  firestore: Firestore;
  comment: LeactionComment;
};

export const LikeComment: VoidComponent<LikeCommentProps> = (props) => {
  return <p>Not Implemented.</p>;
};
