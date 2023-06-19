import { Box, CircularProgress } from "@suid/material";
import Grid from "@suid/material/Grid";
import { createResource, For, Suspense, VoidComponent } from "solid-js";
import { getEventsForAccount } from "../api";
import EventListItem from "./EventListItem";
import { Account } from "~/features/account/types";
import { useFirestore } from "~/providers/FirebaseProvider";

type EventListProps = {
  account: Account | null;
};

export const EventList: VoidComponent<EventListProps> = (props) => {
  const firestore = useFirestore();
  const [events, { refetch }] = createResource(() =>
    props.account ? getEventsForAccount(firestore, props.account) : Promise.resolve([])
  );

  return (
    <Suspense fallback={<CircularProgress />}>
      <Grid container spacing={1}>
        <For each={events()} fallback={<NoEvents />}>
          {(event, _) => (
            <Grid item xs={12} sm={6} md={4}>
              <EventListItem event={event} refetchEvents={refetch} />
            </Grid>
          )}
        </For>
      </Grid>
    </Suspense>
  );
};

const NoEvents: VoidComponent = () => {
  return (
    <Grid item xs={12}>
      <Box sx={{ textAlign: "center", marginTop: "20px" }}>
        現在管理しているイベントはありません
      </Box>
    </Grid>
  );
};
