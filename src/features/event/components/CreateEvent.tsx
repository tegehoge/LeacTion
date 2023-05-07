import { useNavigate } from "@solidjs/router";
import { AddCircle, Star } from "@suid/icons-material";
import { Box, Button, Chip, Container, Divider, Grid, TextField, Typography } from "@suid/material";
import { formatISO, parseISO } from "date-fns";
import { Firestore } from "firebase/firestore";
import { VoidComponent } from "solid-js";
import { useCreateEvent } from "../api/createEvent";
import { createEmptyTalk } from "../types";
import { SortableTalkList } from "./SortableTalkList";
import { Account } from "~/features/account/types";

type CreateEventProps = {
  firestore: Firestore;
  account: Account;
};

export const CreateEvent: VoidComponent<CreateEventProps> = (props) => {
  const navigate = useNavigate();
  const { event, setEvent, sendEventCreate } = useCreateEvent(props);

  const appendTalk = () => {
    setEvent("talks", (talks) => [...talks, createEmptyTalk()]);
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <TextField
            label="イベント名"
            value={event.name}
            fullWidth
            onChange={(_, v) => setEvent("name", v)}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            type="date"
            label="イベント開催日"
            fullWidth
            value={formatISO(event.date, { representation: "date" })}
            onChange={(_, v) => setEvent("date", parseISO(v))}
            required
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextField
            label="イベントページのURL"
            fullWidth
            value={event.url || ""}
            onChange={(_, v) => setEvent("url", v)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Twitterハッシュタグ"
            placeholder="Webナイト宮崎"
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ startAdornment: <Typography># </Typography> }}
            value={event.hashTag || ""}
            onChange={(_, v) => setEvent("hashTag", v)}
          />
        </Grid>
      </Grid>
      <Box sx={{ marginTop: "1em", marginBottom: "1em" }}>
        <SortableTalkList talks={event.talks} setEvent={setEvent} currentTalkIds={[]} />
      </Box>
      <Box sx={{ marginTop: "1em", marginBottom: "1em" }}>
        <Button
          fullWidth
          variant="contained"
          color="success"
          startIcon={<AddCircle />}
          onClick={appendTalk}
        >
          発表枠を追加する
        </Button>
      </Box>
      <Divider />

      <Box sx={{ marginTop: "1em", marginBottom: "1em" }}>
        イベント管理者 :
        <Chip icon={<Star />} label={props.account.displayName} />
      </Box>
      <Box textAlign="center">
        利用規約に同意して
        <Button
          variant="contained"
          onClick={() => sendEventCreate().then(() => navigate(`/event/${event.id}`))}
        >
          イベントを作成する
        </Button>
      </Box>
    </Container>
  );
};
