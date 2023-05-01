import { useNavigate } from "@solidjs/router";
import { AddCircle, Star } from "@suid/icons-material";
import { Box, Button, Chip, Container, Divider, Grid, TextField, Typography } from "@suid/material";
import { formatISO, parseISO } from "date-fns";
import { Firestore } from "firebase/firestore";
import { For, Suspense, VoidComponent, createResource, untrack } from "solid-js";
import { useUpdateEvent } from "../api";
import { Event, createEmptyTalk, nonEmptyTalk } from "../types";
import { SortableTalkList } from "./SortableTalkList";
import { getAccountsByUid } from "~/features/account/api";

type UpdateEventProps = {
  firestore: Firestore;
  currentEvent: Event;
};

export const UpdateEvent: VoidComponent<UpdateEventProps> = (props) => {
  const navigate = useNavigate();
  // eslint-disable-next-line solid/reactivity
  const { event, setEvent, sendEventUpdate } = useUpdateEvent(props.firestore, props.currentEvent);

  const editorUids = [event.createdBy].concat(event.managers);
  const [accounts] = createResource(editorUids, (uids) => getAccountsByUid(props.firestore, uids));

  // 削除前に確認が必要な発表枠のID
  const currentTalkIds = untrack(() => event.talks.filter(nonEmptyTalk).map((t) => t.id));

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
        <SortableTalkList talks={event.talks} setEvent={setEvent} currentTalkIds={currentTalkIds} />
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
        <Suspense>
          <Chip
            icon={<Star />}
            label={accounts()?.find((account) => event.createdBy)?.displayName}
          />
          <For each={event.managers}>
            {(uid) => <Chip label={accounts()?.find((account) => account.uid)?.displayName} />}
          </For>
        </Suspense>
      </Box>
      <Box textAlign="center">
        <Button
          variant="contained"
          onClick={() => sendEventUpdate().then(() => navigate(`/event/${event.id}`))}
        >
          イベントを保存する
        </Button>
      </Box>
    </Container>
  );
};
