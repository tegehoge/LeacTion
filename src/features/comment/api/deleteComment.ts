import { Firestore, deleteDoc } from "firebase/firestore";
import { commentDoc } from "./firestoreConversion";

export const deleteComment = (firestore: Firestore, eventId: string, commentId: string) => {
  const docRef = commentDoc(firestore, eventId, commentId);
  return deleteDoc(docRef);
};
