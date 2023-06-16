import { useLocation, useNavigate } from "@solidjs/router";
import { AddCircle, Person } from "@suid/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@suid/material";
import { formatISO, parseISO } from "date-fns";
import { Firestore } from "firebase/firestore";
import { Suspense, VoidComponent, For, Switch, Match, createResource, untrack } from "solid-js";
import { useCreateEvent } from "../api/createEvent";
import { createEmptyTalk } from "../types";
import { SortableTalkList } from "./SortableTalkList";
import { getAccountsByUid } from "~/features/account/api";
import { Account } from "~/features/account/types";

type CreateEventProps = {
  firestore: Firestore;
  account: Account;
};

export const CreateEvent: VoidComponent<CreateEventProps> = (props) => {
  const navigate = useNavigate();
  const { event, setEvent, sendEventCreate } = useCreateEvent(props);
  const location = useLocation<{ managerIds: string[] }>();
  const [managerAccounts] = createResource(location.state?.managerIds || [], (ids) => {
    if (ids.length > 0) {
      return getAccountsByUid(props.firestore, ids);
    } else {
      return Promise.resolve([props.account]);
    }
  });
  const protectedUids = [untrack(() => props.account.uid)];

  const appendTalk = () => {
    setEvent("talks", (talks) => [...talks, createEmptyTalk()]);
  };

  const deleteManager = (uid: string) => {
    return () => {
      setEvent("managers", (prev) => prev.filter((x) => x !== uid));
    };
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
        <Box sx={{ marginBottom: "1em" }}>
          イベント作成者
          <Suspense>
            <Chip label={props.account.displayName} icon={<Person />} />
          </Suspense>
        </Box>
        <Box sx={{ marginBottom: "1em" }}>
          イベント管理者
          <Suspense>
            <Stack
              direction="row"
              spacing={1}
              sx={{ border: "1px solid gray", borderRadius: "10px", padding: "5px" }}
            >
              <For each={managerAccounts()}>
                {(account) => (
                  <Switch>
                    <Match when={protectedUids.includes(account.uid)}>
                      <Chip label={account.displayName} icon={<Person />} />
                    </Match>
                    <Match when={!protectedUids.includes(account.uid)}>
                      <Chip
                        label={account.displayName}
                        icon={<Person />}
                        onDelete={deleteManager(account.uid)}
                      />
                    </Match>
                  </Switch>
                )}
              </For>
            </Stack>
          </Suspense>
        </Box>
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
