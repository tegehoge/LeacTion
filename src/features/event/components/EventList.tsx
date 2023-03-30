import { NavLink } from "@solidjs/router";
import Edit from "@suid/icons-material/Edit";
import OpenInNew from "@suid/icons-material/OpenInNew";
import Box from "@suid/material/Box";
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
import { collection, DocumentData, getFirestore, orderBy, query, where } from "firebase/firestore";
import { useFirestore } from "solid-firebase";
import { Component, For, Show } from "solid-js";
import { useFirebaseApp } from "~/providers/FirebaseProvider";

type EventListProps = {
  uid: string;
};

type EventInfo = {
  id: string;
  name: string;
  dateOfEvent: string;
  externalUrl?: string;
  hashtag?: string;
  isArchived: boolean;
};

const asEventInfo = (data: DocumentData): EventInfo => {
  return {
    id: data.id,
    name: data.name,
    dateOfEvent: data.dateOfEvent,
    externalUrl: data.externalUrl,
    hashtag: data.hashtag,
    isArchived: data.isArchived || false,
  };
};

export const EventList: Component<EventListProps> = (props) => {
  const firestore = getFirestore(useFirebaseApp());
  const myEvents = useFirestore(
    query(
      collection(firestore, "events"),
      // eslint-disable-next-line solid/reactivity
      where("administrators", "array-contains", props.uid),
      orderBy("dateOfEvent", "desc")
    )
  );

  return (
    <Grid container spacing={1}>
      <For each={myEvents.data?.map(asEventInfo)}>
        {(eventInfo, _) => (
          <Grid item xs={12} md={6}>
            <Paper elevation={2}>
              <Card>
                <CardHeader
                  title={eventInfo.name}
                  subheader={eventInfo.dateOfEvent}
                  action={
                    <IconButton color="primary" title="編集">
                      <Edit />
                    </IconButton>
                  }
                />
                <CardContent>
                  発表数: 5(dummy)
                  <Show when={eventInfo.externalUrl}>
                    <Link href={eventInfo.externalUrl} target="_blank">
                      <Typography>
                        {eventInfo.externalUrl}
                        <OpenInNew
                          fontSize="small"
                          color="action"
                          sx={{ verticalAlign: "middle" }}
                        />
                      </Typography>
                    </Link>
                  </Show>
                  <Show when={eventInfo.hashtag}>
                    <Typography>#{eventInfo.hashtag}</Typography>
                  </Show>
                </CardContent>
                <CardActions sx={{ marginTop: "auto" }}>
                  <Button variant="contained">イベントのページを見る</Button>
                </CardActions>
              </Card>
            </Paper>
          </Grid>
        )}
      </For>
    </Grid>
  );
};
