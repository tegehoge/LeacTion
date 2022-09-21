import { Link } from "@solidjs/router";
import AddCircle from "@suid/icons-material/AddCircle";
import Box from "@suid/material/Box";
import Container from "@suid/material/Container";
import Divider from "@suid/material/Divider";
import Grid from "@suid/material/Grid";
import TextField from "@suid/material/TextField";
import Typography from "@suid/material/Typography";
import { dndzone as dndZoneDirective, TRIGGERS, SOURCES } from "solid-dnd-directive";
import { Component, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";

import { PrimaryButton, SecondaryButton } from "~/components/atoms/buttons";
import { CautionServiceUseModal } from "~/components/atoms/modals";
import { useModal } from "~/components/atoms/modals/useModal";
import { LargeHeading } from "~/components/atoms/typographies";
import { PresentationForm, InfoForm } from "~/components/organisms/events";

import {
  ConsiderEvent,
  FinalizeEvent,
  MouseDownEvent,
  TouchStartEvent,
} from "~/types/dndDirective";

export const EventNew: Component = () => {
  // @ref: https://github.com/isaacHagoel/solid-dnd-directive/issues/6
  // @ref: https://codesandbox.io/s/dnd-drag-handles-57btm?file=/src/App.jsx
  const dndzone = dndZoneDirective;
  const { isOpen, onClose } = useModal(false);
  const [dragDisabled, setDragDisabled] = createSignal(true);
  const [eventStore, setEventStore] = createStore({
    name: "",
    date: "",
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

  const handleInputPresentationListItem = (
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

  const addEvent = (): void => {
    const nextId = Math.max(...eventStore.presentationList.map((event) => event.id)) + 1;

    setEventStore("presentationList", (eventList) => [
      ...eventList,
      { id: nextId, memberName: "", title: "" },
    ]);
  };

  // ドラッグスタート
  const handleConsider = (e: ConsiderEvent) => {
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail;

    setEventStore("presentationList", newItems);

    // Ensure dragging is stopped on drag finish via keyboard
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      setDragDisabled(true);
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
      setDragDisabled(true);
    }
  };

  const startDrag = (e: MouseDownEvent | TouchStartEvent) => {
    // preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
    e.preventDefault();
    setDragDisabled(false);
  };

  const onChange = (key: "name" | "date" | "url" | "hashTag", value: string): void => {
    setEventStore(key, value);
  };

  return (
    <>
      <Box sx={{ textAlign: "center", margin: "20px 0" }}>
        <LargeHeading>新規イベントを登録する</LargeHeading>
      </Box>

      <Container maxWidth="lg">
        <Box component={"form"}>
          <Box marginBottom="24px">
            <InfoForm onChange={onChange} event={eventStore} />
          </Box>

          <Box marginBottom="16px">
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
              イベントの発表順 (順序を変更できます)
            </Typography>

            <Box
              component={"div"}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
              use:dndzone={{
                items: () => eventStore.presentationList,
                dragDisabled,
                dropTargetStyle: {},
              }}
              on:consider={handleConsider}
              on:finalize={handleFinalize}
            >
              <For each={eventStore.presentationList}>
                {(event, index) => (
                  <PresentationForm
                    title={event.title}
                    memberName={event.memberName}
                    dragDisabled={dragDisabled()}
                    startDrag={startDrag}
                    id={event.id}
                    handleInputEvent={handleInputPresentationListItem}
                  />
                )}
              </For>
            </Box>
          </Box>

          <Box marginBottom="16px">
            <SecondaryButton onClick={addEvent} fullWidth={true} startIcon={<AddCircle />}>
              発表枠の追加
            </SecondaryButton>
          </Box>

          <Box marginBottom="16px">
            <Divider />
          </Box>

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ textAlign: "center", marginBottom: "16px" }}
          >
            編集用パスワードの設定
          </Typography>

          <Box component="form" marginBottom="32px">
            <Grid container spacing={3} sx={{ flexGrow: 1, justifyContent: "center" }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="管理者パスワード"
                  type="password"
                  required
                  placeholder="パスワード"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="管理者パスワード (確認用)"
                  type="password"
                  required
                  placeholder="パスワード (確認用)"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  autoComplete="off"
                />
              </Grid>
            </Grid>
          </Box>

          <Box textAlign="center" marginBottom="32px">
            <Typography>
              <Link href="/terms" target="_blank">
                利用規約
              </Link>
              に同意して
            </Typography>
            <PrimaryButton onClick={() => console.log(eventStore)}>
              イベントを作成する
            </PrimaryButton>
          </Box>
        </Box>
      </Container>

      <CautionServiceUseModal open={isOpen()} onClose={() => onClose()} />
    </>
  );
};
