import { dndzone as dndZoneDirective, SOURCES, TRIGGERS } from "solid-dnd-directive";
import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { produce } from "solid-js/store";

import {
  ConsiderEvent,
  FinalizeEvent,
  MouseDownEvent,
  TouchStartEvent,
} from "~/types/dndDirective";

export const useEvent = () => {
  // @ref: https://github.com/isaacHagoel/solid-dnd-directive/issues/6#issuecomment-1034672267
  // @ref: https://codesandbox.io/s/dnd-drag-handles-57btm?file=/src/App.jsx
  const dndzone = dndZoneDirective;
  const [isDragDisabled, setIsDragDisabled] = createSignal(true);
  const [eventStore, setEventStore] = createStore({
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

  // ドラッグ&ドロップ関係
  // ドラッグスタート
  const handleConsider = (e: ConsiderEvent) => {
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail;

    setEventStore("presentationList", newItems);

    // Ensure dragging is stopped on drag finish via keyboard
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      setIsDragDisabled(true);
    }
  };

  // ドラッグエンド
  const handleFinalize = (e: FinalizeEvent) => {
    const {
      items: newItems,
      info: { source },
    } = e.detail;

    setEventStore("presentationList", newItems);

    // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
    if (source === SOURCES.POINTER) {
      setIsDragDisabled(true);
    }
  };

  // ドラッグ&ドロップ時のスタイル調整で使用
  const startDrag = (e: MouseDownEvent | TouchStartEvent) => {
    // preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
    e.preventDefault();
    setIsDragDisabled(false);
  };

  return {
    eventStore,
    onChangeEventInfo,
    onClickAddPresentationItem,
    onInputPresentationListItem,
    dndzone,
    handleConsider,
    handleFinalize,
    startDrag,
    isDragDisabled,
  };
};
