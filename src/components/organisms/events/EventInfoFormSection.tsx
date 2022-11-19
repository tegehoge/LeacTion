import TagIcon from "@suid/icons-material/Tag";
import { Grid, TextField } from "@suid/material";
import { VoidComponent } from "solid-js";

type Props = {
  name: string;
  dateOfEvent: string;
  externalUrl: string;
  hashtag: string;
  onChange: (key: "name" | "dateOfEvent" | "externalUrl" | "hashtag", event: string) => void;
};

export const EventInfoFormSection: VoidComponent<Props> = (props) => {
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
          value={new Date(props.dateOfEvent)}
          onChange={(_, target) => props.onChange("dateOfEvent", target)}
        />
      </Grid>

      <Grid item xs={12} sm={8}>
        <TextField
          label="イベントページのURL"
          type="text"
          placeholder="connpassイベントURLなど(optional)"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          value={props.externalUrl}
          onChange={(_, target) => props.onChange("externalUrl", target)}
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField
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
          value={props.hashtag}
          onChange={(event, target) => props.onChange("hashtag", target)}
        />
      </Grid>
    </Grid>
  );
};
