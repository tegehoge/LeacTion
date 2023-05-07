import { NavLink, useNavigate, useParams } from "@solidjs/router";
import { Box, Button, CircularProgress, Typography } from "@suid/material";
import { Match, Show, Switch, VoidComponent, createEffect, createResource } from "solid-js";
import { getEvent } from "~/features/event/api";
import { createEventManagerRequests } from "~/features/event/api/createEventManagerRequest";
import { useAuthContext } from "~/providers/AuthProvider";
import { useFirestore } from "~/providers/FirebaseProvider";

const EventManagerRequest: VoidComponent = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const auth = useAuthContext();
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
    <Box textAlign="center">
      <Show when={isManager() === false} fallback={<CircularProgress />}>
        <Switch>
          <Match when={isManagerRequested()}>
            <Box sx={{ margin: "20px" }}>
              <Typography variant="h6">管理者リクエストを送信しました</Typography>
            </Box>
            <Box>
              管理者リクエストが行われたことは現在の管理者へ通知されませんので、イベントの管理者に直接ご連絡ください。
            </Box>
            <Box sx={{ margin: "20px" }}>
              <NavLink href={`/event/${eventId}`}>イベントページに戻る</NavLink>
            </Box>
          </Match>
          <Match when={!isManagerRequested()}>
            <Box sx={{ margin: "20px" }}>
              <Typography variant="h6">管理者リクエスト</Typography>
            </Box>
            <Box>
              <Typography>
                <span>{auth.account?.displayName}</span> としてイベント 「
                <span>{event()?.name}</span>」 の管理権限をリクエストしますか？
              </Typography>
            </Box>
            <Box sx={{ margin: "20px" }}>
              <Button variant="contained" color="primary" onClick={sendRequest}>
                リクエストする
              </Button>
            </Box>
          </Match>
        </Switch>
      </Show>
    </Box>
  );
};

export default EventManagerRequest;
