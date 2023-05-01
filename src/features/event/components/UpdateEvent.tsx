import { useNavigate } from "@solidjs/router";
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
import {
  For,
  Match,
  Show,
  Suspense,
  Switch,
  VoidComponent,
  createResource,
  untrack,
} from "solid-js";
import { useUpdateEvent } from "../api";
import { Event, createEmptyTalk, nonEmptyTalk } from "../types";
import { SortableTalkList } from "./SortableTalkList";
import { getAccountsByUid } from "~/features/account/api";
import { Account } from "~/features/account/types";

type UpdateEventProps = {
  firestore: Firestore;
  currentEvent: Event;
  account: Account;
};

export const UpdateEvent: VoidComponent<UpdateEventProps> = (props) => {
  const navigate = useNavigate();
  // eslint-disable-next-line solid/reactivity
  const { event, setEvent, sendEventUpdate } = useUpdateEvent(props.firestore, props.currentEvent);

  const uidsToBeFetched = [event.createdBy].concat(event.managers, event.managerRequests);
  const [accounts] = createResource(uidsToBeFetched, (uids) =>
    getAccountsByUid(props.firestore, uids)
  );
  // 削除できないID(安全のため作成者を削除しない)
  const protectedUids = () => [event.createdBy, props.account.uid];

  // 削除前に確認が必要な発表枠のID
  const currentTalkIds = untrack(() => event.talks.filter(nonEmptyTalk).map((t) => t.id));

  const appendTalk = () => {
    setEvent("talks", (talks) => [...talks, createEmptyTalk()]);
  };

  const deleteManager = (uid: string) => {
    return () => {
      setEvent("managers", (prev) => prev.filter((x) => x !== uid));
    };
  };

  const acceptRequest = (uid: string) => {
    return () => {
      setEvent("managers", (prev) => prev.concat(uid));
      setEvent("managerRequests", (prev) => prev.filter((x) => x !== uid));
    };
  };

  const deleteRequest = (uid: string) => {
    return () => {
      setEvent("managerRequests", (prev) => prev.filter((x) => x !== uid));
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
        <Box sx={{ marginBottom: "1em" }}>
          イベント作成者
          <Suspense>
            <Chip
              label={accounts()?.find((account) => account.uid === event.createdBy)?.displayName}
              icon={<Person />}
            />
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
              <For each={event.managers}>
                {(uid) => (
                  <Switch>
                    <Match when={protectedUids().includes(uid)}>
                      <Chip
                        label={accounts()?.find((account) => account.uid === uid)?.displayName}
                        icon={<Person />}
                      />
                    </Match>
                    <Match when={!protectedUids().includes(uid)}>
                      <Chip
                        label={accounts()?.find((account) => account.uid === uid)?.displayName}
                        icon={<Person />}
                        onDelete={deleteManager(uid)}
                      />
                    </Match>
                  </Switch>
                )}
              </For>
            </Stack>
          </Suspense>
        </Box>
        <Box sx={{ marginBottom: "1em" }}>
          管理者リクエスト
          <Suspense>
            <Show when={event.managerRequests.length > 0} fallback={"なし"}>
              （クリックで承認・削除ができます。）
              <Stack
                direction="row"
                spacing={1}
                sx={{ border: "1px solid gray", borderRadius: "10px", padding: "5px" }}
              >
                <For each={event.managerRequests}>
                  {(uid) => (
                    <Chip
                      label={accounts()?.find((account) => account.uid === uid)?.displayName}
                      icon={<AddCircle />}
                      sx={{ cursor: "copy" }}
                      onClick={acceptRequest(uid)}
                      onDelete={deleteRequest(uid)}
                    />
                  )}
                </For>
              </Stack>
            </Show>
          </Suspense>
        </Box>
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
