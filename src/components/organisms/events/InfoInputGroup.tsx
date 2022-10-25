import TagIcon from "@suid/icons-material/Tag";
import Grid from "@suid/material/Grid";
import TextField from "@suid/material/TextField";
import { VoidComponent } from "solid-js";

type Props = {
  name: string;
  date: Date;
  url: string;
  hashTag: string;
  onChange: (key: "name" | "date" | "url" | "hashTag", event: string | Date) => void;
};

export const InfoInputGroup: VoidComponent<Props> = (props) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={8}>
        <TextField
          name="name"
          required
          label="イベント名"
          type="text"
          placeholder="Webナイト宮﨑 vol.1"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={props.name}
          onChange={(_, target) => props.onChange("name", target)}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField
          id="date"
          required
          label="開催日"
          type="date"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={props.date}
          // defaultValue={props.date}
          onChange={(_, target) => {
            props.onChange("date", new Date(target));
          }}
        />
      </Grid>

      <Grid item xs={12} sm={8}>
        <TextField
          required
          label="イベントページのURL"
          type="text"
          placeholder="connpassイベントURLなど(optional)"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={props.url}
          onChange={(_, target) => props.onChange("url", target)}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
          required
          label="Twitterハッシュタグ"
          type="text"
          placeholder="Webナイト宮﨑"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: <TagIcon />,
          }}
          value={props.hashTag}
          onChange={(event, target) => props.onChange("hashTag", target)}
        />
      </Grid>
    </Grid>
  );
};
