import { Link } from "@solidjs/router";
import AddCircle from "@suid/icons-material/AddCircle";
import TagIcon from "@suid/icons-material/Tag";
import Box from "@suid/material/Box";
import Container from "@suid/material/Container";
import Divider from "@suid/material/Divider";
import FormLabel from "@suid/material/FormLabel";
import Grid from "@suid/material/Grid";
import TextField from "@suid/material/TextField";
import Typography from "@suid/material/Typography";
import { dndzone as dndZoneDirective, TRIGGERS, SOURCES } from "solid-dnd-directive";
import { Accessor, Component, createEffect, createSignal, For, JSX } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { PrimaryButton, SecondaryButton } from "~/components/atoms/buttons";
import { CautionServiceUseModal } from "~/components/atoms/modals";
import { useModal } from "~/components/atoms/modals/useModal";
import { LargeHeading } from "~/components/atoms/typographies";
import { EventNewMemberForm } from "~/components/organisms/events";
import {
  ConsiderEvent,
  FinalizeEvent,
  MouseDownEvent,
  TouchStartEvent,
} from "~/types/useCustomeDirective";

export const [eventStore, setEventStore] = createStore({
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

const EventNew: Component = () => {
  // @ref: https://github.com/isaacHagoel/solid-dnd-directive/issues/6
  // @ref: https://codesandbox.io/s/dnd-drag-handles-57btm?file=/src/App.jsx
  const dndzone = dndZoneDirective;
  const { isOpen, onClose } = useModal(false);
  const [date, setDate] = createSignal("2020-08-01");
  const [dragDisabled, setDragDisabled] = createSignal(true);

  // createEffect(() => {
  //   console.log("dragDisabled", dragDisabled());
  // });

  // createEffect(() => {
  //   console.log("eventStore title", eventStore[0].title);
  // });
  //
  // createEffect(() => {
  //   console.log("eventStore memberName", eventStore[0].memberName);
  // });
  // //
  // createEffect(() => {
  //   console.log("eventStore[0]", eventStore[0]);
  // });
  //
  // createEffect(() => {
  //   console.log("eventStore[0]", eventStore[1]);
  // });
  //
  // createEffect(() => {
  //   console.log("eventStore[0]", eventStore[2]);
  // });
  //
  // const handleInputMemberNameEvent = (id: number, value: string): void => {
  //   setEventStore(
  //     (store) => store.id === id,
  //     "memberName",
  //     () => value
  //   );
  // };
  //
  // const handleInputTitleEvent = (id: number, value: string): void => {
  //   setEventStore(
  //     (store) => store.id === id,
  //     "title",
  //     () => value
  //   );
  // };

  const handleInputEvent = (id: number, key: "title" | "memberName", value: string): void => {
    setEventStore(
      "presentationList",
      (presentationList) => presentationList.id === id,
      key,
      () => value
    );
  };

  const addEvent = (): void => {
    const nextId = Math.max(...eventStore.presentationList.map((event) => event.id)) + 1;

    // setEventStore(eventStore.presentationList.length, { id: nextId, memberName: "", title: "" });
  };

  const handleConsider = (e: ConsiderEvent) => {
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail;

    setEventStore(newItems);

    // Ensure dragging is stopped on drag finish via keyboard
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      setDragDisabled(true);
    }
  };

  const handleFinalize = (e: FinalizeEvent) => {
    const {
      items: newItems,
      info: { source },
    } = e.detail;

    setEventStore(newItems);
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
        <Box component="form" marginBottom="24px">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <TextField
                required
                label="イベント名"
                placeholder="Webナイト宮﨑 vol.1"
                fullWidth
                value={"test"}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                label="開催日"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                required
                label="イベントページのURL"
                placeholder="connpassイベントURLなど(optional)"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                required
                label="Twitterハッシュタグ"
                placeholder="Webナイト宮﨑"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: <TagIcon fontSize="small" />,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box component="form" marginBottom="16px">
          <FormLabel sx={{ display: "inline-block", marginBottom: "8px" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              イベントの発表順 (順序を変更できます)
            </Typography>
          </FormLabel>

          <div
            style={{ display: "flex", "flex-direction": "column", gap: "16px" }}
            use:dndzone={{ items: () => eventStore.presentationList, dragDisabled }}
            on:consider={handleConsider}
            on:finalize={handleFinalize}
          >
            <For each={eventStore.presentationList}>
              {(event, index) => (
                <EventNewMemberForm
                  title={event.title}
                  memberName={event.memberName}
                  dragDisabled={dragDisabled()}
                  startDrag={startDrag}
                  id={event.id}
                  handleInputEvent={handleInputEvent}
                />
              )}
            </For>
          </div>
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
          <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: "center" }}>
            <Grid item xs={6} sm={4}>
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
            <Grid item xs={6} sm={4}>
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
          <PrimaryButton onClick={() => console.log("test")}>イベントを作成する</PrimaryButton>
        </Box>
      </Container>

      <CautionServiceUseModal open={isOpen()} onClose={() => onClose()} />
    </>
  );
};

export default EventNew;
