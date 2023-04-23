import { Firestore, getDoc, setDoc } from "firebase/firestore";
import { eventDoc } from "./firestore";
import { Event, generateEventId } from "~/features/event/types/Event";

export const createEvent = (firestore: Firestore, event: Event) => {
  const generatedId = regenerateId(firestore, event.id);
  generatedId.then((id) => {
    const eventRef = eventDoc(firestore, id);
    event.id = id;
    return setDoc(eventRef, event);
  });
};

/**
 * 再帰的にランダムなIDを発行し、重複していないものを出力する
 * @param firestore Firestore
 * @param id 新規発行しようとしているID
 * @returns 重複していないID
 */
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
