import { Firestore, getDoc, setDoc } from "firebase/firestore";
import { eventDoc } from "./firestore";
import { LeactionEvent, generateEventId } from "~/features/event/types/LeactionEvent";

export const createEvent = (firestore: Firestore, event: LeactionEvent) => {
  const generatedId = regenerateId(firestore, event.id);
  generatedId.then((id) => {
    const eventRef = eventDoc(firestore, id);
    event.id = id;
    return setDoc(eventRef, event);
  });
};

const regenerateId = (firestore: Firestore, id: string): Promise<string> => {
  const docRef = eventDoc(firestore, id);
  return getDoc(docRef).then((snapshot) => {
    if (snapshot.exists()) {
      console.debug(`Event ID ${id} is duplicated!`);
      return regenerateId(firestore, generateEventId());
    }
    return id;
  });
};
