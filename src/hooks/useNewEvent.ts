import { createStore } from "solid-js/store";

export const [eventStore, setEventStore] = createStore([
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
]);
