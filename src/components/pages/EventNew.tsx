import { Link } from "@solidjs/router";
import AddCircle from "@suid/icons-material/AddCircle";
import Box from "@suid/material/Box";
import Container from "@suid/material/Container";
import Divider from "@suid/material/Divider";
import Grid from "@suid/material/Grid";
import TextField from "@suid/material/TextField";
import Typography from "@suid/material/Typography";
import { For, VoidComponent } from "solid-js";

import { PrimaryButton, SecondaryButton } from "~/components/atoms/buttons";
import { LargeHeading } from "~/components/atoms/typographies";
import { EventPresentationForm, EventInfoInputGroup } from "~/components/organisms/events";
import { CautionServiceUseModal } from "~/components/organisms/modals";
import { useModal } from "~/hooks/organisms/useModal";
import { useEventInput } from "~/hooks/pages/useEventInput";

export const EventNew: VoidComponent = () => {
  const { isOpen, onClose } = useModal(true);

  const {
    eventStore,
    onChangeEventInfo,
    onClickAddPresentationItem,
    onInputPresentationListItem,
    setEventStore,
  } = useEventInput();

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
            編集用パスワードの設定
          </Typography>

          <Box component="form" marginBottom="32px">
            <Grid container spacing={3} sx={{ flexGrow: 1, justifyContent: "center" }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="管理者パスワード"
                  type="password"
                  required
                  placeholder="パスワード"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="管理者パスワード (確認用)"
                  type="password"
                  required
                  placeholder="パスワード (確認用)"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  autoComplete="off"
                />
              </Grid>
            </Grid>
          </Box>

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
    </>
  );
};
