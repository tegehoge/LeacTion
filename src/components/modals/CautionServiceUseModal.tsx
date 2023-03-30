import CheckBox from "@suid/icons-material/CheckBox";
import ErrorOutline from "@suid/icons-material/ErrorOutline";
import { useTheme } from "@suid/material";
import Box from "@suid/material/Box";
import Fade from "@suid/material/Fade";
import Link from "@suid/material/Link";
import List from "@suid/material/List";
import ListItem from "@suid/material/ListItem";
import ListItemIcon from "@suid/material/ListItemIcon";
import ListItemText from "@suid/material/ListItemText";
import Modal from "@suid/material/Modal";
import { orange } from "@suid/material/colors";
import { VoidComponent } from "solid-js";

import { PrimaryButton } from "~/components/buttons";
import { LargeHeading } from "~/components/typographies";

export type Props = {
  open: boolean;
  onClose: () => void;
};

export const CautionServiceUseModal: VoidComponent<Props> = (props) => {
  const theme = useTheme();

  return (
    <Modal
      open={props.open}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      closeAfterTransition={true}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxHeight: "90%",
            width: "80vw",
            bgcolor: theme.palette.background.paper,
            padding: "20px",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflowY: "auto",
          }}
        >
          <ErrorOutline sx={{ fontSize: 120, color: orange[200], marginBottom: "16px" }} />

          <LargeHeading textAlign="center">サービス利用に関する注意</LargeHeading>

          <List>
            <ListItem>
              <ListItemIcon>
                <CheckBox />
              </ListItemIcon>
              <ListItemText>
                本サービスへ投稿されたイベント名やコメントは全て一般公開されています。
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
                  Github
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

          <PrimaryButton onClick={() => props.onClose()}>確認しました</PrimaryButton>
        </Box>
      </Fade>
    </Modal>
  );
};
