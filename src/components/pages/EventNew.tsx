import { Link } from "@solidjs/router";
import AddCircle from "@suid/icons-material/AddCircle";
import Box from "@suid/material/Box";
import Container from "@suid/material/Container";
import Divider from "@suid/material/Divider";
import Grid from "@suid/material/Grid";
import TextField from "@suid/material/TextField";
import Typography from "@suid/material/Typography";
import { dndzone as dndZoneDirective, SOURCES, TRIGGERS } from "solid-dnd-directive";
import { Component, createSignal, For } from "solid-js";

import { PrimaryButton, SecondaryButton } from "~/components/atoms/buttons";
import { CautionServiceUseModal } from "~/components/atoms/modals";
import { useModal } from "~/components/atoms/modals/useModal";
import { LargeHeading } from "~/components/atoms/typographies";
import { PresentationForm, InfoInputGroup } from "~/components/organisms/events";
import { useEvent } from "~/hooks/useEvent";
import {
  ConsiderEvent,
  FinalizeEvent,
  MouseDownEvent,
  TouchStartEvent,
} from "~/types/dndDirective";

export const EventNew: Component = () => {
  // @ref: https://github.com/isaacHagoel/solid-dnd-directive/issues/6#issuecomment-1034672267
  // @ref: https://codesandbox.io/s/dnd-drag-handles-57btm?file=/src/App.jsx
  const dndzone = dndZoneDirective;
  const { isOpen, onClose } = useModal(false);
  const [dragDisabled, setDragDisabled] = createSignal(true);
  const {
    eventStore,
    onChangeEventInfo,
    onClickAddPresentationItem,
    onInputPresentationListItem,
    setEventStore,
  } = useEvent();

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

  return (
    <>
      <Box sx={{ textAlign: "center", margin: "20px 0" }}>
        <LargeHeading>新規イベントを登録する</LargeHeading>
      </Box>

      <Container maxWidth="lg">
        <Box component={"div"}>
          <Box marginBottom="24px">
            <InfoInputGroup
              onChange={onChangeEventInfo}
              name={eventStore.name}
              url={eventStore.url}
              date={eventStore.date}
              hashTag={eventStore.hashTag}
            />
          </Box>

          <Box marginBottom="16px">
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
              イベントの発表順 (順序を変更できます)
            </Typography>

            {/*NOTE: ここはdivタグでないとドラッグ&ドロップが使用ができない*/}
            <div
              style={{
                display: "flex",
                "flex-direction": "column",
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
                    handleInputEvent={onInputPresentationListItem}
                  />
                )}
              </For>
            </div>
          </Box>

          <Box marginBottom="16px">
            <SecondaryButton
              onClick={onClickAddPresentationItem}
              fullWidth={true}
              startIcon={<AddCircle />}
            >
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
