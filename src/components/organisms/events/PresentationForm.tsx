import Delete from "@suid/icons-material/Delete";
import FormatLineSpacing from "@suid/icons-material/FormatLineSpacing";
import Box from "@suid/material/Box";
import Grid from "@suid/material/Grid";
import IconButton from "@suid/material/IconButton";
import TextField from "@suid/material/TextField";
import { red } from "@suid/material/colors";
import { Component } from "solid-js";

import type { MouseDownEvent, TouchStartEvent } from "~/types/dndDirective";

export type Props = {
  id: number;
  title: string;
  memberName: string;
  isDragDisabled: boolean;
  startDrag: (e: MouseDownEvent | TouchStartEvent) => void;
  handleInputEvent: (id: number, key: "title" | "memberName", value: string) => void;
};

export const PresentationForm: Component<Props> = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        outlineColor: `rgba(255, 255, 255, .0);`,
      }}
      component="form"
      tabIndex={props.isDragDisabled ? 0 : -1}
    >
      <div on:mousedown={(e) => props.startDrag(e)} on:touchstart={(e) => props.startDrag(e)}>
        <IconButton disableRipple sx={{ cursor: "grab" }}>
          <FormatLineSpacing />
        </IconButton>
      </div>

      <Grid container spacing={1}>
        <Grid item xs={12} sm={8}>
          <TextField
            name="memberName"
            value={props.memberName}
            required
            placeholder="発表者名"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => props.handleInputEvent(props.id, "memberName", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            value={props.title}
            required
            placeholder="発表タイトル"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => props.handleInputEvent(props.id, "title", e.target.value)}
          />
        </Grid>
      </Grid>
      <IconButton>
        <Delete sx={{ color: red[300] }} />
      </IconButton>
    </Box>
  );
};
