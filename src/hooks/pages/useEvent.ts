import { createStore } from "solid-js/store";
import { produce } from "solid-js/store";

export type EventStore = {
  name: string;
  date: Date;
  url: string;
  hashTag: string;
  presentationList: {
    id: number;
    memberName: string;
    title: string;
  }[];
};

export const useEvent = () => {
  const [eventStore, setEventStore] = createStore<EventStore>({
    name: "",
    date: new Date(),
    url: "",
    hashTag: "",
    presentationList: [
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
  });

  const onChangeEventInfo = (
    key: "name" | "date" | "url" | "hashTag",
    value: string | Date
  ): void => {
    setEventStore(key, value);
  };

  const onClickAddPresentationItem = (): void => {
    const nextId = Math.max(...eventStore.presentationList.map((event) => event.id)) + 1;

    setEventStore(
      "presentationList",
      produce((event) => {
        event.push({
          id: nextId,
          memberName: "",
          title: "",
        });
      })
    );
  };

  const onInputPresentationListItem = (
    id: number,
    key: "title" | "memberName",
    value: string
  ): void => {
    setEventStore(
      "presentationList",
      (presentationList) => presentationList.id === id,
      key,
      () => value
    );
  };

  return {
    eventStore,
    onChangeEventInfo,
    onClickAddPresentationItem,
    onInputPresentationListItem,
    setEventStore,
  } as const;
};
