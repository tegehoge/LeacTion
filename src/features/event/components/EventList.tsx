import Grid from "@suid/material/Grid";
import { Component, createResource, For } from "solid-js";
import { getEventsForAccount } from "../api";
import EventListItem from "./EventListItem";
import { Account } from "~/features/account/types";
import { useFirestore } from "~/providers/FirebaseProvider";

type EventListProps = {
  account: Account | null;
};

export const EventList: Component<EventListProps> = (props) => {
  const firestore = useFirestore();
  const [events, { refetch }] = createResource(() =>
    props.account ? getEventsForAccount(firestore, props.account) : Promise.resolve([])
  );

  return (
    <Grid container spacing={1}>
      <For each={events()}>
        {(event, _) => (
          <Grid item xs={12} sm={6} md={4}>
            <EventListItem event={event} refetchEvents={refetch} />
          </Grid>
        )}
      </For>
    </Grid>
  );
};
