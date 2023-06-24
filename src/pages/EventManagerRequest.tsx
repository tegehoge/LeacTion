import { NavLink, useNavigate, useParams } from "@solidjs/router";
import { Box, Button, CircularProgress, Container, Typography } from "@suid/material";
import { Match, Show, Switch, VoidComponent, createEffect, createResource } from "solid-js";
import { getEvent } from "~/features/event/api";
import { createEventManagerRequests } from "~/features/event/api/createEventManagerRequest";
import { useAuthContext } from "~/providers/AuthProvider";
import { useFirestore } from "~/providers/FirebaseProvider";

const EventManagerRequest: VoidComponent = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [auth] = useAuthContext();
  const firestore = useFirestore();
  const [event, { refetch }] = createResource(eventId, (id) => getEvent(firestore, id));

  const sendRequest = () => {
    if (!auth.loading && !event.loading && auth.account) {
      createEventManagerRequests(firestore, eventId, auth.account.uid).then(refetch);
    }
  };

  const isManager = () => {
    return auth.account && event()?.managers.includes(auth.account.uid);
  };

  const isManagerRequested = () => {
    return (
      !auth.loading &&
      !event.loading &&
      auth.account &&
      event()?.managerRequests.includes(auth.account.uid)
    );
  };

  createEffect(() => {
    if (!auth.loading) {
      // Googleアカウントを持っていない場合
      if (!auth.account) {
        const callbackPath = `/event/${eventId}/manager-request`;
        return navigate(`/login?callback=${encodeURIComponent(callbackPath)}`, { replace: true });
      }
    }
    if (!event.loading) {
      // eventIdで指定されたイベントが存在しない場合
      if (!event()) {
        return navigate("/", { replace: true });
      }
    }
    // すでに管理者である場合
    if (isManager()) {
      return navigate(`/event/${eventId}/edit`, { replace: true });
    }
  });

  return (
    <Container>
      <Show when={isManager() === false} fallback={<CircularProgress />}>
        <Switch>
          <Match when={!isManagerRequested()}>
            <Box sx={{ margin: "20px", textAlign: "center" }}>
              <Typography variant="h4">共同管理者リクエストを送る</Typography>
            </Box>
            <Box>
              共同管理者は次のことができます。
              <ul>
                <li>イベント名や発表枠の編集</li>
                <li>他の共同管理者リクエストの承認・拒否</li>
                <li>イベントの削除</li>
              </ul>
            </Box>
            <Box>
              <Typography>
                現在の表示名「<span>{auth.account?.displayName}</span>」でイベント 「
                <span>{event()?.name}</span>」 の共同管理者への追加をリクエストしますか？
                <br />
                （アカウントの表示名は右上のボタンから変更できます。他の管理者がわかりやすい名前にしてください。）
              </Typography>
            </Box>
            <Box sx={{ margin: "20px", textAlign: "center" }}>
              <Button variant="contained" color="primary" onClick={sendRequest}>
                共同管理者への追加をリクエストする
              </Button>
            </Box>
          </Match>
          <Match when={isManagerRequested()}>
            <Box sx={{ margin: "20px", textAlign: "center" }}>
              <Typography variant="h4">共同管理者リクエストは送信済みです</Typography>
            </Box>
            <Box>
              共同管理者リクエストが行われたことは、本サービスからは現在の管理者へ通知されません。
              <br />
              現在の管理者に承認いただくようにご自身で直接ご連絡ください。
            </Box>
            <Box sx={{ margin: "20px", textAlign: "center" }}>
              <NavLink href={`/event/${eventId}`}>イベントページに戻る</NavLink>
            </Box>
          </Match>
        </Switch>
      </Show>
    </Container>
  );
};

export default EventManagerRequest;
