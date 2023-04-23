import { Firestore, arrayRemove, arrayUnion, getDoc, updateDoc } from "firebase/firestore";
import { commentDoc } from "./firestoreConversion";

export const likeComment = (
  firestore: Firestore,
  eventId: string,
  commentId: string,
  likedBy: string,
  liked: boolean
) => {
  const docRef = commentDoc(firestore, eventId, commentId);
  return updateDoc(docRef, {
    likedBy: liked ? arrayUnion(likedBy) : arrayRemove(likedBy),
  });
};
