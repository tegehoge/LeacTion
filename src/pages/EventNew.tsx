import { useNavigate } from "@solidjs/router";
import { CheckBox } from "@suid/icons-material";
import { Box, Container, Link, List, ListItem, ListItemIcon, ListItemText } from "@suid/material";
import { createEffect, Show, VoidComponent } from "solid-js";

import { LargeHeading } from "~/components/typographies";
import { CreateEvent } from "~/features/event/components";
import { useAuthContext } from "~/providers/AuthProvider";
import { useFirestore } from "~/providers/FirebaseProvider";

const EventNew: VoidComponent = () => {
  const navigate = useNavigate();
  const [auth] = useAuthContext();

  const firestore = useFirestore();

  createEffect(() => {
    if (!auth.loading) {
      if (!auth.account) {
        const callbackPath = "/new";
        navigate(`/login?callback=${encodeURIComponent(callbackPath)}`, { replace: true });
      }
    }
  });

  return (
    <>
      <Box sx={{ textAlign: "center", margin: "20px 0" }}>
        <LargeHeading>新規イベントを登録する</LargeHeading>
      </Box>
      <Container sx={{ marginBottom: "20px" }}>
        <Box sx={{ padding: "1em", backgroundColor: "lightgray" }}>
          以下のことに注意してLeacTion!をご利用ください。
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckBox />
              </ListItemIcon>
              <ListItemText>
                本サービスへ投稿されたイベント名やコメントは全て一般公開されます。
                <br />
                他の利用者を不快にさせるコメントや公開してはならない情報は書き込まないようにイベント参加者へ注意喚起をお願いします。
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckBox />
              </ListItemIcon>
              <ListItemText>
                個別のサポートは行っておりません。不具合報告・要望などは
                <Link
                  underline="none"
                  href="https://github.com/tegehoge/LeacTion/issues/new"
                  target="_blank"
                >
                  Githubのissues
                </Link>
                へ投稿してください。
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckBox />
              </ListItemIcon>
              <ListItemText>
                予告なくサービスの変更や停止を行う場合があります。予めご了承ください。
              </ListItemText>
            </ListItem>
          </List>
        </Box>
      </Container>
      <Show when={auth.account}>
        <CreateEvent firestore={firestore} account={auth.account!} />
      </Show>
    </>
  );
};

export default EventNew;
