import { nanoid } from "nanoid";
import { createStore } from "solid-js/store";
import { produce } from "solid-js/store";
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
  administrators: Account[];
};

export const useEventInput = () => {
  const [eventStore, setEventStore] = createStore<EventStore>({
    id: nanoid(8),
    name: "",
    date: new Date(),
    url: "",
    hashTag: "",
    talks: [createEmptyTalk(), createEmptyTalk(), createEmptyTalk()],
    administrators: [],
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
