import { Link } from "@solidjs/router";
import { Box, Container, Divider, Typography } from "@suid/material";
import { VoidComponent } from "solid-js";

import { PrimaryButtonWithLoading } from "~/components/atoms/buttons";
import { LargeHeading } from "~/components/atoms/typographies";
import {
  EventTalkFormSection,
  EventInfoFormSection,
  EventPasswordFormSection,
} from "~/components/organisms/events";
import { CautionServiceUseModal } from "~/components/organisms/modals";
import { useModal } from "~/hooks/organisms/useModal";
import { useEventInput } from "~/hooks/pages/useEventInput";

export const EventNew: VoidComponent = () => {
  const { isOpen, onClose } = useModal(true);

  const {
    eventStore,
    setEventStore,
    eventPasswordStore,
    onChangeEvent,
    onChangeEventPassword,
    onClickAddTalkItem,
    onInputTalkListItem,
    isValid,
    passwordErrorMessage,
    onSubmitSaveEvent,
    saveEventMutation,
  } = useEventInput();

  return (
    <>
      <Box sx={{ textAlign: "center", margin: "20px 0" }}>
        <LargeHeading>新規イベントを登録する</LargeHeading>
      </Box>

      <Container maxWidth="lg">
        <Box component={"form"} onSubmit={onSubmitSaveEvent}>
          <Box marginBottom="24px">
            <EventInfoFormSection
              onChange={onChangeEvent}
              name={eventStore.name}
              externalUrl={eventStore.externalUrl ?? ""}
              dateOfEvent={eventStore.dateOfEvent}
              hashtag={eventStore.hashtag ?? ""}
            />
          </Box>

          <Box marginBottom="16px">
            <EventTalkFormSection
              handleInputEvent={onInputTalkListItem}
              talks={eventStore.talks}
              setEventStore={setEventStore}
              onClick={onClickAddTalkItem}
            />
          </Box>

          <Box marginBottom="16px">
            <Divider />
          </Box>

          <EventPasswordFormSection
            password={eventPasswordStore.password}
            passwordConfirm={eventPasswordStore.passwordConfirm}
            errorMessage={passwordErrorMessage()}
            onChange={onChangeEventPassword}
          />

          <Box textAlign="center" marginBottom="32px">
            <Box marginBottom="16px">
              <Typography>
                <Link href="/terms" target="_blank">
                  利用規約
                </Link>
                に同意して
              </Typography>
            </Box>

            <PrimaryButtonWithLoading
              disabled={isValid()}
              isLoading={saveEventMutation.isLoading}
              type="submit"
            >
              イベントを作成する
            </PrimaryButtonWithLoading>
          </Box>
        </Box>
      </Container>

      <CautionServiceUseModal open={isOpen()} onClose={() => onClose()} />
    </>
  );
};
