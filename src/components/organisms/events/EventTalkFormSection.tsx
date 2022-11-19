import AddCircle from "@suid/icons-material/AddCircle";
import Delete from "@suid/icons-material/Delete";
import FormatLineSpacing from "@suid/icons-material/FormatLineSpacing";
import { Box, Grid, IconButton, TextField, Typography } from "@suid/material";
import { red } from "@suid/material/colors";
import { dndzone as dndZoneDirective, SOURCES, TRIGGERS } from "solid-dnd-directive";
import { VoidComponent, For, createSignal } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";

import { SecondaryButton } from "~/components/atoms/buttons";
import type {
  MouseDownEvent,
  TouchStartEvent,
  ConsiderEvent,
  FinalizeEvent,
} from "~/types/dndDirective";
import type { Event } from "~/types/event";
import type { Talk } from "~/types/talk";

export type Props = {
  handleInputEvent: (id: string, key: "title" | "speakerName", value: string) => void;
  talks: Talk[];
  setEventStore: SetStoreFunction<Event>;
  onClickAdd: () => void;
  onClickDelete: (id: string) => void;
};

export const EventTalkFormSection: VoidComponent<Props> = (props) => {
  // @ref: https://github.com/isaacHagoel/solid-dnd-directive/issues/6#issuecomment-1034672267
  // @ref: https://codesandbox.io/s/dnd-drag-handles-57btm?file=/src/App.jsx
  const [isDragDisabled, setIsDragDisabled] = createSignal(false);
  const dndzone = dndZoneDirective;

  const onConsider = (e: ConsiderEvent) => {
    const {
      items: newItems,
      info: { source, trigger },
    } = e.detail;

    props.setEventStore("talks", newItems);

    // Ensure dragging is stopped on drag finish via keyboard
    if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
      setIsDragDisabled(true);
    }
  };

  const onFinalize = (e: FinalizeEvent) => {
    const {
      items: newItems,
      info: { source },
    } = e.detail;

    props.setEventStore("talks", newItems);

    // Ensure dragging is stopped on drag finish via pointer (mouse, touch)
    if (source === SOURCES.POINTER) {
      setIsDragDisabled(true);
    }
  };

  // ドラッグ&ドロップ時のスタイル調整で使用
  const startDrag = (e: MouseDownEvent | TouchStartEvent) => {
    // preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
    e.preventDefault();
  };

  return (
    <>
      <Box marginBottom="16px">
        <Typography variant="subtitle2" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
          イベントの発表順 (順序を変更できます)
        </Typography>
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "16px",
          }}
          use:dndzone={{
            items: () => props.talks,
            dragDisabled: isDragDisabled(),
            dropTargetStyle: {},
          }}
          on:consider={(e) => onConsider(e)}
          on:finalize={(e) => onFinalize(e)}
        >
          <For each={props.talks}>
            {(talk) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  outlineColor: `rgba(255, 255, 255, .0);`,
                }}
                component="form"
                tabIndex={isDragDisabled() ? 0 : -1}
              >
                <div on:mousedown={(e) => startDrag(e)} on:touchstart={(e) => startDrag(e)}>
                  <IconButton disableRipple sx={{ cursor: "grab" }}>
                    <FormatLineSpacing />
                  </IconButton>
                </div>

                <Grid container spacing={1}>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      name="speakerName"
                      value={talk.speakerName}
                      required
                      placeholder="発表者名"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) =>
                        props.handleInputEvent(talk.id, "speakerName", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      value={talk.title}
                      required
                      placeholder="発表タイトル"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      onChange={(e) => props.handleInputEvent(talk.id, "title", e.target.value)}
                    />
                  </Grid>
                </Grid>
                <IconButton onClick={() => props.onClickDelete(talk.id)}>
                  <Delete sx={{ color: red[300] }} />
                </IconButton>
              </Box>
            )}
          </For>
        </div>
      </Box>
      <SecondaryButton
        onClick={() => props.onClickAdd()}
        fullWidth={true}
        startIcon={<AddCircle />}
      >
        発表枠の追加
      </SecondaryButton>
    </>
  );
};
