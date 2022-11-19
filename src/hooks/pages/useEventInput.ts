import { createMutation } from "@tanstack/solid-query";
import { nanoid } from "nanoid";
import { createSignal, createEffect, createMemo, JSX } from "solid-js";
import { createStore, produce } from "solid-js/store";
import toast from "solid-toast";

import { saveEvent } from "~/repository";
import type { Event } from "~/types/event";

export const useEventInput = () => {
  const [isValid, setIsValid] = createSignal(false);
  const saveEventMutation = createMutation(
    () => saveEvent(eventStore, eventPasswordStore.password),
    {
      onSuccess() {
        toast.success("イベント登録しました");
      },
      onError() {
        toast.error("登録に失敗しました");
      },
    }
  );

  const [eventStore, setEventStore] = createStore<Event>({
    id: nanoid(8),
    name: "",
    dateOfEvent: "",
    externalUrl: "",
    hashtag: "",
    talks: [...Array(3)].map(() => ({
      id: nanoid(),
      title: "",
      speakerName: "",
    })),
  });

  const [eventPasswordStore, setEventPasswordStore] = createStore({
    password: "",
    passwordConfirm: "",
  });

  const onChangeEvent = (
    key: "name" | "dateOfEvent" | "externalUrl" | "hashtag",
    value: string
  ): void => {
    setEventStore(key, value);
  };

  const onChangeEventPassword = (key: "password" | "passwordConfirm", value: string): void => {
    setEventPasswordStore(key, value);
  };

  const onClickAddTalkItem = (): void => {
    setEventStore(
      "talks",
      produce((event) => {
        event.push({
          id: nanoid(),
          title: "",
          speakerName: "",
        });
      })
    );
  };

  const onInputTalkListItem = (id: string, key: "title" | "speakerName", value: string): void => {
    setEventStore(
      "talks",
      (talk) => talk.id === id,
      key,
      () => value
    );
  };

  // Form関連
  createEffect(() => {
    // イベント作成ボタンのStatusを制御する
    // イベント発表者が一つでも入力されたらバリデーション通過とする
    const isSetPresentationList = eventStore.talks.some(
      ({ title, speakerName }) => title && speakerName
    );

    if (
      !eventStore.name ||
      !eventStore.dateOfEvent ||
      !isSetPresentationList ||
      !eventPasswordStore.password ||
      !eventPasswordStore.passwordConfirm ||
      !!passwordErrorMessage()
    ) {
      setIsValid(true);
      return;
    }

    setIsValid(false);
  });

  const passwordErrorMessage = createMemo(() => {
    if (eventPasswordStore.password !== eventPasswordStore.passwordConfirm) {
      return "パスワードが一致していません";
    }

    return undefined;
  });

  const onSubmitSaveEvent: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (event) => {
    event.preventDefault();

    saveEventMutation.mutate();
  };

  return {
    eventStore,
    setEventStore,
    eventPasswordStore,
    onChangeEvent,
    onChangeEventPassword,
    onClickAddTalkItem,
    onInputTalkListItem,
    isValid,
    passwordErrorMessage,
    onSubmitSaveEvent,
    saveEventMutation,
  } as const;
};
