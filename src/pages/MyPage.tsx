import { NavLink, useNavigate } from "@solidjs/router";
import { AddCircle, Logout } from "@suid/icons-material";
import { TextField, Typography } from "@suid/material";
import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
import CircularProgress from "@suid/material/CircularProgress";
import Container from "@suid/material/Container";
import { getFirestore } from "firebase/firestore";
import { createEffect, createSignal, Show, VoidComponent } from "solid-js";
import toast, { Toaster } from "solid-toast";
import { updateAccountDisplayName } from "~/features/account/api/updateAccount";
import { EventList } from "~/features/event/components/EventList";
import { useAuthContext } from "~/providers/AuthProvider";
import { useFirebaseApp } from "~/providers/FirebaseProvider";

const MyPage: VoidComponent = () => {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const firestore = getFirestore(useFirebaseApp());
  const [displayNameInput, setDisplayNameInput] = createSignal<string>("");

  createEffect(() => {
    if (!auth.loading) {
      const currentAccount = auth.account;
      if (currentAccount) {
        setDisplayNameInput(currentAccount.displayName);
      } else {
        navigate("/");
      }
    }
  });
  const sendDisplayName = () => {
    if (auth.account) {
      toast.promise(updateAccountDisplayName(firestore, auth.account, displayNameInput()), {
        loading: "表示名を変更中…",
        success: "表示名を変更しました",
        error: "表示名の変更に失敗しました",
      });
    }
  };
  const signOutToTop = () => {
    auth.signOut().then(() => navigate("/"));
  };
  const loadingComponent = (
    <Box textAlign="center" margin="5em auto">
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Show when={!auth.loading} fallback={loadingComponent}>
        <Box sx={{ margin: "20px", textAlign: "center" }}>
          <Typography variant="h6">マイページ</Typography>
        </Box>

        <Box
          sx={{
            paddingBottom: "5px",
            marginTop: "30px",
            borderBottom: "1px solid gray",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" flexGrow={1}>
            アカウント管理
          </Typography>
          <Box>
            <Button
              variant="contained"
              size="small"
              color="error"
              startIcon={<Logout />}
              onClick={signOutToTop}
            >
              ログアウト
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: "flex", marginTop: "20px" }}>
          <Box flexGrow={1}>
            <TextField
              fullWidth
              label="アカウントの表示名"
              size="small"
              value={displayNameInput()}
              onChange={(_, value) => setDisplayNameInput(value)}
            />
          </Box>
          <Button
            variant="contained"
            size="small"
            disabled={displayNameInput().length === 0}
            sx={{ marginLeft: "10px" }}
            onClick={sendDisplayName}
          >
            表示名を変更する
          </Button>
        </Box>

        <Box
          sx={{
            paddingBottom: "5px",
            marginTop: "5em",
            borderBottom: "1px solid gray",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" flexGrow={1}>
            管理しているイベント
          </Typography>
          <Box>
            <NavLink href="/new">
              <Button variant="contained" size="small" color="success" startIcon={<AddCircle />}>
                新しいイベントを作成する
              </Button>
            </NavLink>
          </Box>
        </Box>

        <Box sx={{ marginTop: "20px", marginBottom: "20px" }}>
          <EventList account={auth.account} />
        </Box>
      </Show>
      <Toaster position="top-center" />
    </Container>
  );
};

export default MyPage;
