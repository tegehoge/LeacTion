import { Firestore, deleteDoc } from "firebase/firestore";
import { eventDoc } from "./firestore";

export const deleteEvent = (firestore: Firestore, eventId: string) => {
  const eventRef = eventDoc(firestore, eventId);
  return deleteDoc(eventRef);
};
