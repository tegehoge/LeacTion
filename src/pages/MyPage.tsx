import { NavLink, useNavigate } from "@solidjs/router";
import { AddCircle } from "@suid/icons-material";
import { Typography } from "@suid/material";
import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
import CircularProgress from "@suid/material/CircularProgress";
import Container from "@suid/material/Container";
import { getFirestore } from "firebase/firestore";
import { createEffect, Show, VoidComponent } from "solid-js";
import { Toaster } from "solid-toast";
import { AccountMenu } from "~/features/account/components";
import { EventList } from "~/features/event/components/EventList";
import { useAuthContext } from "~/providers/AuthProvider";
import { useFirebaseApp } from "~/providers/FirebaseProvider";

const MyPage: VoidComponent = () => {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const firestore = getFirestore(useFirebaseApp());

  createEffect(() => {
    if (!auth.loading) {
      if (!auth.account) {
        navigate("/");
      }
    }
  });
  const loadingComponent = (
    <Box textAlign="center" margin="5em auto">
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="lg">
      <Show when={!auth.loading} fallback={loadingComponent}>
        <Box sx={{ margin: "20px", display: "flex" }}>
          <Typography variant="h4" flexGrow={1}>
            マイページ
          </Typography>
          <Box>
            <AccountMenu firestore={firestore} account={auth.account!} signOut={auth.signOut} />
          </Box>
        </Box>

        <Box
          sx={{
            paddingBottom: "5px",
            marginTop: "20px",
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
              <Button variant="contained" color="success" startIcon={<AddCircle />}>
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
