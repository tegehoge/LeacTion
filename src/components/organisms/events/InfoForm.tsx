import TagIcon from "@suid/icons-material/Tag";
import Grid from "@suid/material/Grid";
import TextField from "@suid/material/TextField";
import { Component } from "solid-js";

type Props = {
  onChange: (key: "name" | "date" | "url" | "hashTag", value: string) => void;
  event: { name: string; date: string; url: string; hashTag: string };
};

export const InfoForm: Component<Props> = (props) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={8}>
        <TextField
          required
          label="イベント名"
          placeholder="Webナイト宮﨑 vol.1"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={props.event.name}
          onChange={(_, target) => props.onChange("name", target)}
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
          value={props.event.date}
          onChange={(_, target) => props.onChange("date", target)}
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
          value={props.event.url}
          onChange={(_, target) => props.onChange("url", target)}
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
          value={props.event.hashTag}
          onChange={(event, target) => props.onChange("hashTag", target)}
        />
      </Grid>
    </Grid>
  );
};
