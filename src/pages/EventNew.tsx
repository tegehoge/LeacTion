import { Link, useNavigate } from "@solidjs/router";
import AddCircle from "@suid/icons-material/AddCircle";
import Box from "@suid/material/Box";
import Container from "@suid/material/Container";
import Divider from "@suid/material/Divider";
import Skeleton from "@suid/material/Skeleton";
import Typography from "@suid/material/Typography";
import { getFirestore } from "firebase/firestore";
import { createEffect, Match, Switch, VoidComponent } from "solid-js";

import { PrimaryButton, SecondaryButton } from "~/components/buttons";
import { CautionServiceUseModal } from "~/components/modals";
import { LargeHeading } from "~/components/typographies";
import { createEvent } from "~/features/event/api";
import { EventTalksForm, EventInfoInputGroup } from "~/features/event/components";
import { useEventInput } from "~/features/event/hooks/useEventInput";
import { useModal } from "~/hooks/organisms/useModal";
import { useAuthContext } from "~/providers/AuthProvider";
import { useFirebaseApp } from "~/providers/FirebaseProvider";

const EventNew: VoidComponent = () => {
  const { isOpen, onClose } = useModal(true);

  const {
    eventStore,
    onChangeEventInfo,
    onInputTalks,
    appendEmptyTalk,
    removeTalk,
    setEventStore,
    getEvent,
  } = useEventInput();

  const navigate = useNavigate();
  const auth = useAuthContext();

  const firestore = getFirestore(useFirebaseApp());

  createEffect(() => {
    if (!auth.loading) {
      if (auth.account) {
        setEventStore("administrator", auth.account.uid);
      } else {
        navigate("/");
      }
    }
  });

  return (
    <>
      <Box sx={{ textAlign: "center", margin: "20px 0" }}>
        <LargeHeading>新規イベントを登録する</LargeHeading>
      </Box>

      <Container maxWidth="lg">
        <Box component={"div"}>
          <Box marginBottom="24px">
            <EventInfoInputGroup
              onChange={onChangeEventInfo}
              name={eventStore.name}
              url={eventStore.url}
              date={eventStore.date}
              hashTag={eventStore.hashTag}
            />
          </Box>

          <Box marginBottom="16px">
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", marginBottom: "8px" }}>
              イベントの発表順 (順序を変更できます)
            </Typography>

            <EventTalksForm
              talks={eventStore.talks}
              setEventStore={setEventStore}
              handleInputEvent={onInputTalks}
              removeTalkEvent={removeTalk}
            />
          </Box>

          <Box marginBottom="16px">
            <SecondaryButton onClick={appendEmptyTalk} fullWidth={true} startIcon={<AddCircle />}>
              発表枠の追加
            </SecondaryButton>
          </Box>

          <Box marginBottom="16px">
            <Divider />
          </Box>

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ textAlign: "center", marginBottom: "16px" }}
          >
            管理者
          </Typography>
          <Switch>
            <Match when={auth.loading}>
              <Skeleton variant="text" />
            </Match>
            <Match when={auth.account}>{eventStore.administrator}</Match>
          </Switch>

          <Box textAlign="center" marginBottom="32px">
            <Typography>
              <Link href="/terms" target="_blank">
                利用規約
              </Link>
              に同意して
            </Typography>
            <PrimaryButton onClick={() => createEvent(firestore, getEvent())}>
              イベントを作成する
            </PrimaryButton>
          </Box>
        </Box>
      </Container>

      <CautionServiceUseModal open={isOpen()} onClose={() => onClose()} />
    </>
  );
};

export default EventNew;
