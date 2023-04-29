import { createStore } from "solid-js/store";
import { produce } from "solid-js/store";
import { Event, createEmptyEvent, createEmptyTalk } from "../types";

type Talk = {
  id: string;
  speakerName: string;
  title: string;
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

export const useEventInput = (event: Event = createEmptyEvent()) => {
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

  const getEvent = (): Event => {
    return {
      id: eventStore.id,
      name: eventStore.name.trim(),
      date: eventStore.date,
      url: eventStore.url.trim() || undefined,
      hashTag: eventStore.hashTag.trim() || undefined,
      talks: eventStore.talks
        .map((talk) => {
          return { id: talk.id, speakerName: talk.speakerName.trim(), title: talk.title.trim() };
        })
        .filter((talk) => !(talk.speakerName == "" && talk.title == "")),
      administrator: eventStore.administrator,
      collaborators: [],
    };
  };

  return {
    eventStore,
    onChangeEventInfo,
    onInputTalks,
    appendEmptyTalk,
    removeTalk,
    setEventStore,
    getEvent,
  } as const;
};
