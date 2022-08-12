import Delete from "@suid/icons-material/Delete";
import FormatLineSpacing from "@suid/icons-material/FormatLineSpacing";
import Box from "@suid/material/Box";
import Grid from "@suid/material/Grid";
import IconButton from "@suid/material/IconButton";
import TextField from "@suid/material/TextField";
import { red } from "@suid/material/colors";
import { Component } from "solid-js";

export type Props = {
  title: string;
  memberName: string;
};

const EventNewMemberForm: Component<Props> = (props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }} component="form">
      <IconButton disableRipple sx={{ cursor: "grab" }}>
        <FormatLineSpacing />
      </IconButton>

      <Grid container spacing={1}>
        <Grid item xs={12} sm={8}>
          <TextField
            value={props.memberName}
            required
            placeholder="発表者名"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
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
          />
        </Grid>
      </Grid>
      <IconButton>
        <Delete sx={{ color: red[300] }} />
      </IconButton>
    </Box>
  );
};

export default EventNewMemberForm;
