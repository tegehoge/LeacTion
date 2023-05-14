import { NavLink, useNavigate } from "@solidjs/router";
import {
  ChatBubble,
  ContentCopy,
  Delete,
  Edit,
  Forum,
  InsertLink,
  Lock,
  MoreVert,
} from "@suid/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = createSignal<Element | null>(null);
  const menuOpen = () => Boolean(menuAnchorEl());
  const openMenu = (event: { currentTarget: Element }) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const closeMenu = () => setMenuAnchorEl(null);

  const [talksPopoverAnchorEl, setTalksPopoverAnchorEl] = createSignal<Element | null>(null);
  const talksOpen = () => !!talksPopoverAnchorEl();
  const toggleTalksOpen = (event: { currentTarget: Element }) => {
    setTalksPopoverAnchorEl(talksPopoverAnchorEl() ? null : event.currentTarget);
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
            <IconButton color="primary" onClick={openMenu}>
              <MoreVert />
            </IconButton>
          }
        />
        <Menu open={menuOpen()} anchorEl={menuAnchorEl()} onBackdropClick={closeMenu}>
          <MenuItem onClick={() => navigate(`/event/${props.event.id}/edit`)}>
            <ListItemIcon>
              <Edit color="primary" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="primary">編集する</Typography>
            </ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem>
            <ListItemIcon>
              <ContentCopy />
            </ListItemIcon>
            <ListItemText>同じ管理者でイベントを作成する</ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Lock color="warning" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="warning">書き込み禁止にする</Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <Delete color="error" />
            </ListItemIcon>
            <ListItemText>
              <Typography color="error">削除する</Typography>
            </ListItemText>
          </MenuItem>
        </Menu>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box flexGrow={1}>
              <Button size="small" startIcon={<ChatBubble />} onClick={toggleTalksOpen}>
                {props.event.talks.length}
              </Button>
              <Popover
                open={talksOpen()}
                anchorEl={talksPopoverAnchorEl()}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                onClose={handleTalksClose}
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
            <Button variant="outlined" startIcon={<Forum />}>
              イベントページ
            </Button>
          </NavLink>
        </CardActions>
      </Card>
    </Paper>
  );
};
export default EventListItem;
