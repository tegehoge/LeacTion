import { nanoid } from "nanoid";
import { createStore } from "solid-js/store";
import { produce } from "solid-js/store";
import { LeactionEvent } from "../types/LeactionEvent";
import { Account } from "~/features/account/types/Account";

type Talk = {
  id: string;
  speakerName: string;
  title: string;
};

const createEmptyTalk = (): Talk => {
  return {
    id: nanoid(),
    speakerName: "",
    title: "",
  };
};

export type EventStore = {
  id: string;
  name: string;
  date: Date;
  url: string;
  hashTag: string;
  talks: Talk[];
  administrator: string;
};

export const createEmptyEvent = (): LeactionEvent => {
  return {
    id: nanoid(8),
    name: "",
    date: new Date(),
    talks: [createEmptyTalk(), createEmptyTalk(), createEmptyTalk()],
    administrator: "",
    collaborators: [],
  };
};

export const useEventInput = (event: LeactionEvent) => {
  const [eventStore, setEventStore] = createStore<EventStore>({
    id: event.id,
    name: event.name,
    date: event.date,
    url: event.url || "",
    hashTag: event.hashTag || "",
    talks: event.talks,
    administrator: event.administrator,
  });

  const onChangeEventInfo = (
    key: "name" | "date" | "url" | "hashTag",
    value: string | Date
  ): void => {
    setEventStore(key, value);
  };

  const appendEmptyTalk = (): void => {
    setEventStore(
      "talks",
      produce((currentTalks) => {
        currentTalks.push(createEmptyTalk());
      })
    );
  };

  const removeTalk = (id: string): void => {
    setEventStore(
      "talks",
      eventStore.talks.filter((talk) => talk.id !== id)
    );
  };

  const onInputTalks = (id: string, key: "title" | "speakerName", value: string): void => {
    setEventStore(
      "talks",
      (talk) => talk.id === id,
      key,
      () => value
    );
  };

  return {
    eventStore,
    onChangeEventInfo,
    onInputTalks,
    appendEmptyTalk,
    removeTalk,
    setEventStore,
  } as const;
};
