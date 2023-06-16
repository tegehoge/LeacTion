import { useNavigate } from "@solidjs/router";
import { Edit, Event, Logout, Person } from "@suid/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@suid/material";
import { VoidComponent, createSignal, untrack } from "solid-js";
import toast, { Toaster } from "solid-toast";
import { Account } from "../types";

type Props = {
  account: Account;
  updateDisplayName: (displayName: string) => Promise<void>;
  signOut: () => void;
};

export const AccountMenuButton: VoidComponent<Props> = (props) => {
  const navigate = useNavigate();
  const navigateToMypage = () => {
    handleAccountMenuClose();
    navigate("/mypage");
  };

  const [menuAnchorEl, setMenuAnchorEl] = createSignal<Element | null>(null);
  const accountMenuOpen = () => Boolean(menuAnchorEl());
  const handleAccountMenuOpen = (el: { currentTarget: Element }) =>
    setMenuAnchorEl(el.currentTarget);
  const handleAccountMenuClose = () => setMenuAnchorEl(null);

  const [dialogOpen, setDialogOpen] = createSignal(false);
  const openDialog = () => {
    handleAccountMenuClose();
    setDialogOpen(true);
  };
  const [displayNameInput, setDisplayNameInput] = createSignal<string>(
    untrack(() => props.account.displayName)
  );
  const sendDisplayName = (newDisplayName: string) => {
    toast.promise(
      props.updateDisplayName(newDisplayName).then(() => setDialogOpen(false)),
      {
        loading: "表示名を更新中",
        success: "表示名を更新しました",
        error: "表示名の更新に失敗しました",
      }
    );
  };
  return (
    <>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<Person />}
        sx={{ textTransform: "none" }}
        onClick={handleAccountMenuOpen}
      >
        {props.account.displayName}
      </Button>
      <Menu
        open={accountMenuOpen()}
        anchorEl={menuAnchorEl()}
        onBackdropClick={handleAccountMenuClose}
      >
        <MenuItem onClick={navigateToMypage}>
          <ListItemIcon>
            <Event />
          </ListItemIcon>
          <ListItemText>管理中のイベント一覧</ListItemText>
        </MenuItem>
        <MenuItem onClick={openDialog}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>表示名の変更</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => props.signOut()}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>
            <Typography>ログアウト</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
      <Dialog open={dialogOpen()} onBackdropClick={() => setDialogOpen(false)} maxWidth="md">
        <DialogTitle>アカウント表示名の変更</DialogTitle>
        <DialogContent>
          <DialogContentText>
            イベントの管理権限リクエスト時にこの名前が表示されます。
            <br />
            ※変更してもGoogleアカウントには影響しません。
          </DialogContentText>
          <TextField
            fullWidth
            value={displayNameInput()}
            onChange={(_, value) => setDisplayNameInput(value)}
          />
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setDialogOpen(false)}>
            キャンセル
          </Button>
          <Button
            disabled={displayNameInput().length === 0}
            onClick={() => sendDisplayName(displayNameInput())}
          >
            変更する
          </Button>
        </DialogActions>
      </Dialog>
      <Toaster position="top-center" />
    </>
  );
};
