import { Link, useNavigate } from "@solidjs/router";
import AddCircle from "@suid/icons-material/AddCircle";
import Box from "@suid/material/Box";
import Container from "@suid/material/Container";
import Divider from "@suid/material/Divider";
import List from "@suid/material/List";
import ListItem from "@suid/material/ListItem";
import ListItemText from "@suid/material/ListItemText";
import Typography from "@suid/material/Typography";
import { createEffect, For, Match, Switch, VoidComponent } from "solid-js";

import { PrimaryButton, SecondaryButton } from "~/components/atoms/buttons";
import { LargeHeading } from "~/components/atoms/typographies";
import { Loading } from "~/components/organisms/Loading";
import { EventPresentationForm, EventInfoInputGroup } from "~/components/organisms/events";
import { CautionServiceUseModal } from "~/components/organisms/modals";
import { useAuthContext } from "~/firebase/AuthProvider";
import { useModal } from "~/hooks/organisms/useModal";
import { useEventInput } from "~/hooks/pages/useEventInput";

const EventNew: VoidComponent = () => {
  const { isOpen, onClose } = useModal(true);

  const {
    eventStore,
    onChangeEventInfo,
    onClickAddPresentationItem,
    onInputPresentationListItem,
    setEventStore,
  } = useEventInput();

  const navigate = useNavigate();
  const auth = useAuthContext();

  createEffect(() => {
    if (!auth.loading) {
      if (auth.account) {
        setEventStore("administrators", [auth.account]);
      } else {
        navigate("/");
      }
    }
  });

  return (
    <Switch>
      <Match when={auth.loading}>
        <Loading />
      </Match>
      <Match when={auth.account}>
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

              <EventPresentationForm
                handleInputEvent={onInputPresentationListItem}
                presentationList={eventStore.presentationList}
                setEventStore={setEventStore}
              />
            </Box>

            <Box marginBottom="16px">
              <SecondaryButton
                onClick={onClickAddPresentationItem}
                fullWidth={true}
                startIcon={<AddCircle />}
              >
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
              イベント管理者
            </Typography>

            <List>
              <For each={eventStore.administrators}>
                {(administrator, _) => (
                  <ListItem>
                    <ListItemText>{administrator.displayName}</ListItemText>
                  </ListItem>
                )}
              </For>
            </List>

            <Box textAlign="center" marginBottom="32px">
              <Typography>
                <Link href="/terms" target="_blank">
                  利用規約
                </Link>
                に同意して
              </Typography>
              <PrimaryButton onClick={() => console.log(eventStore)}>
                イベントを作成する
              </PrimaryButton>
            </Box>
          </Box>
        </Container>

        <CautionServiceUseModal open={isOpen()} onClose={() => onClose()} />
      </Match>
    </Switch>
  );
};

export default EventNew;
