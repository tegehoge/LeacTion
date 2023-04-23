import { Firestore, updateDoc } from "firebase/firestore";
import { eventDoc } from "./firestore";
import { Event } from "~/features/event/types/Event";

export const updateEvent = (firestore: Firestore, event: Event) => {
  const eventRef = eventDoc(firestore, event.id);
  return updateDoc(eventRef, event);
};
