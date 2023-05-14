import { ManageAccounts, Person, Logout } from "@suid/icons-material";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
  DialogContentText,
} from "@suid/material";
import { VoidComponent, createSignal, untrack } from "solid-js";
import toast from "solid-toast";
import { updateAccountDisplayName } from "../api";
import { Account } from "../types";
import { useAuthContext } from "~/providers/AuthProvider";
import { useFirestore } from "~/providers/FirebaseProvider";

type AccountMenuProps = {
  account: Account;
  signOut: () => void;
};

export const AccountMenu: VoidComponent<AccountMenuProps> = (props) => {
  const firestore = useFirestore();
  const [auth, { updateDisplayName }] = useAuthContext();

  const [menuAnchorEl, setMenuAnchorEl] = createSignal<Element | null>(null);
  const accountMenuOpen = () => Boolean(menuAnchorEl());
  const handleAccountMenuOpen = (el: { currentTarget: Element }) =>
    setMenuAnchorEl(el.currentTarget);
  const handleAccountMenuClose = () => setMenuAnchorEl(null);

  const [dialogOpen, setDialogOpen] = createSignal(false);
  const [displayNameInput, setDisplayNameInput] = createSignal<string>(
    untrack(() => props.account.displayName)
  );

  const sendDisplayName = (newDisplayName: string) => {
    toast.promise(
      updateDisplayName(newDisplayName).then(() => setDialogOpen(false)),
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
        startIcon={<ManageAccounts />}
        size="large"
        onClick={handleAccountMenuOpen}
      >
        アカウント管理
      </Button>
      <Menu
        open={accountMenuOpen()}
        anchorEl={menuAnchorEl()}
        onBackdropClick={handleAccountMenuClose}
      >
        <MenuItem onClick={() => setDialogOpen(true)}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText>表示名の変更</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => props.signOut()}>
          <ListItemIcon>
            <Logout color="error" />
          </ListItemIcon>
          <ListItemText>
            <Typography color="error">ログアウト</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
      <Dialog open={dialogOpen()} onBackdropClick={() => setDialogOpen(false)} maxWidth="md">
        <DialogTitle>アカウント表示名の変更</DialogTitle>
        <DialogContent>
          <DialogContentText>
            LeacTion!内の表示名を変更できます。（Googleアカウントには影響しません）
          </DialogContentText>
          <TextField
            fullWidth
            value={displayNameInput()}
            onChange={(_, value) => setDisplayNameInput(value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={displayNameInput().length === 0}
            onClick={() => sendDisplayName(displayNameInput())}
          >
            変更する
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
