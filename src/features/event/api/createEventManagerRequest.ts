import { Firestore, arrayUnion, updateDoc } from "firebase/firestore";
import { eventDoc } from "./firestore";

export const createEventManagerRequests = (
  firestore: Firestore,
  eventId: string,
  accountUid: string
) => {
  const eventRef = eventDoc(firestore, eventId);
  return updateDoc(eventRef, { managerRequests: arrayUnion(accountUid) });
};
