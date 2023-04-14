import { Firestore, updateDoc } from "firebase/firestore";
import { eventDoc } from "./firestore";
import { LeactionEvent } from "~/features/event/types/LeactionEvent";

export const updateEvent = (firestore: Firestore, event: LeactionEvent) => {
  const eventRef = eventDoc(firestore, event.id);
  return updateDoc(eventRef, event);
};
