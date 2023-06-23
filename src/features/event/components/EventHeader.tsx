import { useNavigate } from "@solidjs/router";
import { AddCircle, Close, ContentCopy, Edit, Menu as MenuIcon, Share } from "@suid/icons-material";
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
} from "@suid/material";
import { VoidComponent, Switch, Match, createSignal, Show } from "solid-js";
import { TwitterIcon } from "~/components/icons";
import { RouterLink } from "~/components/links";

type EventHeaderProps = {
  eventId?: string;
  eventName?: string;
  eventHashTag?: string;
  isEditable: boolean;
};

export const EventHeader: VoidComponent<EventHeaderProps> = (props) => {
  const [anchorEl, setAnchorEl] = createSignal<HTMLElement | null>(null);
  const menuOpen = () => !!anchorEl();
  const [shareDialogOpen, setShareDialogOpen] = createSignal(false);
  const navigate = useNavigate();

  const eventUrl = () => new URL(`/event/${props.eventId}`, location.href).toString();

  const qrcodeUrl = () => {
    const u = new URL("https://api.qrserver.com/v1/create-qr-code/");
    u.searchParams.append("data", eventUrl());
    u.searchParams.append("size", "300x300");
    return u.toString();
  };

  const shareOnTwitter = () => {
    const u = new URL("https://twitter.com/intent/tweet");
    u.searchParams.append("text", `LeacTion!で「${props.eventName}」にリアクションしよう！`);
    u.searchParams.append("url", eventUrl());
    u.searchParams.append(
      "hashtags",
      props.eventHashTag ? `${props.eventHashTag},LeacTion` : "LeacTion"
    );
    window.open(u, "_blank");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(eventUrl());
  };

  return (
    <AppBar position="static" sx={{ padding: 0 }}>
      <Toolbar>
        <Show when={props.eventId} fallback={<Skeleton variant="text" />}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", marginRight: "1em" }}>
              <RouterLink href="/">LeacTion!</RouterLink>
            </Typography>
          </Box>
          <Box flexGrow={1} textAlign="center">
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {props.eventName}
            </Typography>
          </Box>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MenuIcon fontSize="large" sx={{ color: "white" }} />
          </IconButton>
          <Menu open={menuOpen()} anchorEl={anchorEl()} onClose={() => setAnchorEl(null)}>
            <MenuItem
              onClick={() => {
                setShareDialogOpen(true);
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <Share fontSize="small" />
              </ListItemIcon>
              <ListItemText>共有する</ListItemText>
            </MenuItem>
            <Divider />
            <Switch>
              <Match when={!props.isEditable}>
                <MenuItem onClick={() => navigate(`/event/${props.eventId}/manager-request`)}>
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>共同管理者になる</ListItemText>
                </MenuItem>
              </Match>
              <Match when={props.isEditable}>
                <MenuItem onClick={() => navigate(`/event/${props.eventId}/edit`)}>
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>イベントを編集する</ListItemText>
                </MenuItem>
              </Match>
            </Switch>
            <Divider />
            <MenuItem onClick={() => navigate("/new")}>
              <ListItemIcon>
                <AddCircle fontSize="small" />
              </ListItemIcon>
              <ListItemText>新しいイベントを作る</ListItemText>
            </MenuItem>
          </Menu>
        </Show>
      </Toolbar>
      <Dialog
        open={shareDialogOpen()}
        maxWidth="lg"
        onBackdropClick={() => setShareDialogOpen(false)}
      >
        <DialogTitle>
          <Typography variant="h6">イベントを共有する</Typography>
          <IconButton
            onClick={() => setShareDialogOpen(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              textAlign: "center",
              padding: "2em",
              border: "2px solid gray",
              borderRadius: "5%",
            }}
          >
            <img src={qrcodeUrl()} alt="イベントページのQRコード" width={300} height={300} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack gap={1} width="100%">
            <Box>
              <Button
                variant="text"
                fullWidth
                startIcon={<ContentCopy />}
                onClick={copyToClipboard}
              >
                URLをクリップボードにコピー
              </Button>
            </Box>
            <Box>
              <Button
                variant="contained"
                fullWidth
                startIcon={<TwitterIcon />}
                onClick={shareOnTwitter}
              >
                Twitterでツイートする
              </Button>
            </Box>
          </Stack>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};
