import { NavLink } from "@solidjs/router";
import { ChatBubble, Edit, InsertLink } from "@suid/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Paper,
  Popover,
  Typography,
} from "@suid/material";
import { VoidComponent, Show, createSignal, For } from "solid-js";
import { Event } from "../types";
import { TwitterIcon } from "~/components/icons";
import { ExternalLink } from "~/components/links";

type EventListItemProps = {
  event: Event;
};
const EventListItem: VoidComponent<EventListItemProps> = (props) => {
  const [talksPopoverAnchorEl, setTalksPopoverAnchorEl] = createSignal<Element | null>(null);
  const talksOpen = () => !!talksPopoverAnchorEl();
  const handleTalksOpen = (event: { currentTarget: Element }) => {
    setTalksPopoverAnchorEl(event.currentTarget);
  };
  const handleTalksClose = () => {
    setTalksPopoverAnchorEl(null);
  };

  return (
    <Paper elevation={2}>
      <Card>
        <CardHeader
          title={props.event.name}
          subheader={props.event.date.toLocaleDateString()}
          action={
            <NavLink href={`/event/${props.event.id}/edit`}>
              <IconButton color="primary" title="編集する">
                <Edit />
              </IconButton>
            </NavLink>
          }
        />
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box flexGrow={1}>
              <Button
                size="small"
                startIcon={<ChatBubble />}
                onMouseEnter={handleTalksOpen}
                onMouseLeave={handleTalksClose}
              >
                {props.event.talks.length}
              </Button>
              <Popover
                open={talksOpen()}
                anchorEl={talksPopoverAnchorEl()}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                sx={{ pointerEvents: "none" }}
              >
                <For each={props.event.talks}>
                  {(talk) => (
                    <Typography sx={{ margin: "1rem" }}>
                      {talk.speakerName} 「{talk.title}」
                    </Typography>
                  )}
                </For>
              </Popover>
            </Box>
            <Show when={props.event.url}>
              <Box>
                <ExternalLink href={props.event.url!}>
                  <IconButton size="small" color="info" title="外部のイベント管理ページを開きます">
                    <InsertLink />
                  </IconButton>
                </ExternalLink>
              </Box>
            </Show>
            <Show when={props.event.hashTag}>
              <Box>
                <ExternalLink href={`https://twitter.com/hashtag/${props.event.hashTag}?f=live`}>
                  <IconButton
                    size="small"
                    color="info"
                    title="Twitterハッシュタグの検索ページを開きます"
                  >
                    <TwitterIcon />
                  </IconButton>
                </ExternalLink>
              </Box>
            </Show>
          </Box>
        </CardContent>
        <CardActions>
          <NavLink href={`/event/${props.event.id}`}>
            <Button variant="outlined">イベントページを開く</Button>
          </NavLink>
        </CardActions>
      </Card>
    </Paper>
  );
};
export default EventListItem;
