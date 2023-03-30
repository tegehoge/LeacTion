import { createStore } from "solid-js/store";
import { produce } from "solid-js/store";
import { Account } from "~/features/account/types/Account";

export type EventStore = {
  name: string;
  date: Date;
  url: string;
  hashTag: string;
  talks: {
    id: number;
    memberName: string;
    title: string;
  }[];
  administrators: Account[];
};

export const useEventInput = () => {
  const [eventStore, setEventStore] = createStore<EventStore>({
    name: "",
    date: new Date(),
    url: "",
    hashTag: "",
    talks: [
      {
        id: 1,
        memberName: "たなか",
        title: "Laravelについて",
      },
      {
        id: 2,
        memberName: "すずき",
        title: "Ruby on Railsについて",
      },
      {
        id: 3,
        memberName: "たかはし",
        title: "Next.jsについて",
      },
    ],
    administrators: [],
  });

  const onChangeEventInfo = (
    key: "name" | "date" | "url" | "hashTag",
    value: string | Date
  ): void => {
    setEventStore(key, value);
  };

  const appendEmptyTalk = (): void => {
    const nextId = Math.max(...eventStore.talks.map((event) => event.id)) + 1;

    setEventStore(
      "talks",
      produce((event) => {
        event.push({
          id: nextId,
          memberName: "",
          title: "",
        });
      })
    );
  };

  const onInputTalks = (id: number, key: "title" | "memberName", value: string): void => {
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
    appendEmptyTalk,
    onInputTalks,
    setEventStore,
  } as const;
};
