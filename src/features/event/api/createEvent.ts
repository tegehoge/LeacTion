import { Firestore, setDoc } from "firebase/firestore";
import { eventDoc } from "./firestore";
import { LeactionEvent } from "~/features/event/types/LeactionEvent";

export const createEvent = (firestore: Firestore, event: LeactionEvent) => {
  const eventRef = eventDoc(firestore, event.id);
  return setDoc(eventRef, event);
};
