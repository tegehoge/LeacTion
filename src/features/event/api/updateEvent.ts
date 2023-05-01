import { Firestore, setDoc } from "firebase/firestore";
import { createStore } from "solid-js/store";
import { eventDoc } from "./firestore";
import { Event, trimEvent } from "~/features/event/types";

const updateEvent = (firestore: Firestore, event: Event) => {
  const eventRef = eventDoc(firestore, event.id);
  return setDoc(eventRef, event);
};

export const useUpdateEvent = (firestore: Firestore, currentEvent: Event) => {
  const [event, setEvent] = createStore(currentEvent);

  const sendEventUpdate = () => {
    // TODO: validations
    return updateEvent(firestore, trimEvent(event));
  };

  return {
    event,
    setEvent,
    sendEventUpdate,
  } as const;
};
