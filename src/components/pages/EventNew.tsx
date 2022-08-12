import { Link } from "@solidjs/router";
import AddCircle from "@suid/icons-material/AddCircle";
import Delete from "@suid/icons-material/Delete";
import FormatLineSpacing from "@suid/icons-material/FormatLineSpacing";
import TagIcon from "@suid/icons-material/Tag";
import Box from "@suid/material/Box";
import Container from "@suid/material/Container";
import Divider from "@suid/material/Divider";
import FormLabel from "@suid/material/FormLabel";
import Grid from "@suid/material/Grid";
import IconButton from "@suid/material/IconButton";
import TextField from "@suid/material/TextField";
import Typography from "@suid/material/Typography";
import { red } from "@suid/material/colors";
import { Component, createSignal, For } from "solid-js";

import { createStore } from "solid-js/store";
import { PrimaryButton, SecondaryButton } from "~/components/atoms/buttons";
import { CautionServiceUseModal } from "~/components/atoms/modals";
import { useModal } from "~/components/atoms/modals/useModal";
import { LargeHeading } from "~/components/atoms/typographies";
import { EventNewMemberForm } from "~/components/organisms/events";

const EventNew: Component = () => {
  const { isOpen, onClose } = useModal(true);
  const [date, setDate] = createSignal("2020-08-01");
  const [events, setEvents] = createStore([
    {
      memberName: "たなか",
      title: "Laravelについて",
    },
    {
      memberName: "すずき",
      title: "Ruby on Railsについて",
    },
    {
      memberName: "たかはし",
      title: "Next.jsについて",
    },
  ]);

  const addEvent = (): void => {
    setEvents(() => [...events, { memberName: "", title: "" }]);
  };

  return (
    <>
      <Box sx={{ textAlign: "center", margin: "20px 0" }}>
        <LargeHeading>新規イベントを登録する</LargeHeading>
      </Box>

      <Container maxWidth="lg">
        <Box component="form" marginBottom="24px">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <TextField
                required
                label="イベント名"
                placeholder="Webナイト宮﨑 vol.1"
                fullWidth
                value={"test"}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                required
                label="開催日"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                required
                label="イベントページのURL"
                placeholder="connpassイベントURLなど(optional)"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                required
                label="Twitterハッシュタグ"
                placeholder="Webナイト宮﨑"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: <TagIcon fontSize="small" />,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box component="form" marginBottom="16px">
          <FormLabel sx={{ display: "inline-block", marginBottom: "8px" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              イベントの発表順 (順序を変更できます)
            </Typography>
          </FormLabel>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <For each={events}>
              {(event) => <EventNewMemberForm title={event.title} memberName={event.memberName} />}
            </For>
          </Box>
        </Box>

        <Box marginBottom="16px">
          <SecondaryButton onClick={addEvent} fullWidth={true} startIcon={<AddCircle />}>
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
          <Grid container spacing={2} sx={{ flexGrow: 1, justifyContent: "center" }}>
            <Grid item xs={6} sm={4}>
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
            <Grid item xs={6} sm={4}>
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
          <PrimaryButton onClick={() => console.log("test")}>イベントを作成する</PrimaryButton>
        </Box>
      </Container>

      <CautionServiceUseModal open={isOpen()} onClose={() => onClose()} />
    </>
  );
};

export default EventNew;
