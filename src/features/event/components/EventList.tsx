import { NavLink } from "@solidjs/router";
import Edit from "@suid/icons-material/Edit";
import OpenInNew from "@suid/icons-material/OpenInNew";
import Button from "@suid/material/Button";
import Card from "@suid/material/Card";
import CardActions from "@suid/material/CardActions";
import CardContent from "@suid/material/CardContent";
import CardHeader from "@suid/material/CardHeader";
import Grid from "@suid/material/Grid";
import IconButton from "@suid/material/IconButton";
import Link from "@suid/material/Link";
import Paper from "@suid/material/Paper";
import Typography from "@suid/material/Typography";
import { getFirestore } from "firebase/firestore";
import { Component, createResource, For, Show } from "solid-js";
import { getEventsForAccount } from "../api";
import { Account } from "~/features/account/types";
import { useFirebaseApp } from "~/providers/FirebaseProvider";

type EventListProps = {
  account: Account | null;
};

export const EventList: Component<EventListProps> = (props) => {
  const firestore = getFirestore(useFirebaseApp());
  const [events] = createResource(() =>
    props.account ? getEventsForAccount(firestore, props.account) : Promise.resolve([])
  );

  return (
    <Grid container spacing={1}>
      <For each={events()}>
        {(event, _) => (
          <Grid item xs={12} md={6}>
            <Paper elevation={2}>
              <Card>
                <CardHeader
                  title={event.name}
                  subheader={event.date.toLocaleDateString()}
                  action={
                    <IconButton color="primary" title="編集">
                      <Edit />
                    </IconButton>
                  }
                />
                <CardContent>
                  発表数: {event.talks.length}
                  <Show when={event.url}>
                    <Link href={event.url} target="_blank">
                      <Typography>
                        {event.url}
                        <OpenInNew
                          fontSize="small"
                          color="action"
                          sx={{ verticalAlign: "middle" }}
                        />
                      </Typography>
                    </Link>
                  </Show>
                  <Show when={event.hashTag}>
                    <Typography>#{event.hashTag}</Typography>
                  </Show>
                </CardContent>
                <CardActions sx={{ marginTop: "auto" }}>
                  <NavLink href={`/event/${event.id}`}>
                    <Button variant="contained">イベントのページを見る</Button>
                  </NavLink>
                </CardActions>
              </Card>
            </Paper>
          </Grid>
        )}
      </For>
    </Grid>
  );
};
