import { useTheme } from "@suid/material";
import Box from "@suid/material/Box";
import Container from "@suid/material/Container";
import Paper from "@suid/material/Paper";
import Stack from "@suid/material/Stack";
import Typography from "@suid/material/Typography";
import { VoidComponent } from "solid-js";

// @ref: https://ja.vitejs.dev/guide/assets.html#importing-asset-as-url
import baloonUrl from "~/assets/baloon.png";
import { MediumSizeTextParagraph } from "~/components/typographies";
import { LargeSizeText } from "~/components/typographies";
import { LoginButton } from "~/features/account/components/LoginButton";

const Top: VoidComponent = () => {
  const theme = useTheme();
  const { light: primaryLightColor, main: primaryMainColor } = theme.palette.primary;
  const textColor = theme.palette.grey[700];

  return (
    <Container
      maxWidth="2sm"
      sx={{
        padding: "32px 20px 12px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <Box marginBottom="32px">
        <Paper
          elevation={0}
          sx={{
            padding: "12px",
            border: `2px solid ${primaryMainColor}`,
          }}
        >
          <LargeSizeText color={primaryMainColor}>
            「LeacTion!」は、勉強会やセミナーで発表者と参加者をつなぐ、
            <br />
            オンラインコメントツールです
          </LargeSizeText>
        </Paper>
      </Box>

      <Box marginBottom="40px">
        <LoginButton redirectPath="/mypage" />
      </Box>

      <Box marginBottom="80px">
        <Paper
          elevation={0}
          square={true}
          sx={{
            backgroundColor: primaryLightColor,
            padding: "40px 16px",
            position: "relative",
            width: "100vw",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Stack>
            <Box
              component="img"
              src={baloonUrl}
              alt="コメントアイコン"
              marginX="auto"
              marginBottom="12px"
              width="96px"
            />
            <Typography
              variant="h6"
              marginBottom="40px"
              color={textColor}
              sx={{
                fontWeight: "bold",
              }}
            >
              LeacTion! とは？
            </Typography>
            <Box maxWidth={512} marginX="auto">
              <MediumSizeTextParagraph>
                勉強会やセミナーで、スマートフォンやパソコンを使い、リアルタイムに質問やコメントを投稿できるサービスです。
                <br />
                オフラインのセミナーや勉強会はもちろん、オンラインイベントやオンライン・オフライン同時開催イベントでも利用できます。
              </MediumSizeTextParagraph>
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Box marginBottom="40px">
        <Paper elevation={0}>
          <Box marginBottom="40px">
            <LargeSizeText>LeacTion! でイベントが盛り上がる</LargeSizeText>
            <Typography variant="h5" fontWeight="bold" color={textColor}>
              ３つの理由
            </Typography>
          </Box>
          <Stack spacing={8} maxWidth={512} marginX="auto">
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                marginBottom="16px"
                color={textColor}
                sx={{
                  textDecoration: "underline",
                }}
              >
                参加者はログイン不要！
              </Typography>
              <MediumSizeTextParagraph>
                ログインが必要なのはイベント管理者だけ。
                <br />
                イベントの参加者はイベントページを開くだけですぐにコメントや質問を投稿できます。
              </MediumSizeTextParagraph>
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                marginBottom="16px"
                color={textColor}
                sx={{
                  textDecoration: "underline",
                }}
              >
                質問やコメントに「いいね！」できる
              </Typography>
              <MediumSizeTextParagraph>
                発表者は「いいね！」ボタンで「自分も気になる！」「自分もそう思う」と意思表明できます。
                発表中や質問タイムに、特に参加者の関心がある質問・コメントを見つけやすくなります。
              </MediumSizeTextParagraph>
            </Box>
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                marginBottom="16px"
                color={textColor}
                sx={{
                  textDecoration: "underline",
                }}
              >
                発表枠ごとに、質問やコメントを投稿できる
              </Typography>
              <MediumSizeTextParagraph>
                発表者は「いいね！」ボタンで「自分も気になる！」「自分もそう思う」と意思表明できます。
                発表中や質問タイムに、特に参加者の関心がある質問・コメントを見つけやすくなります。
              </MediumSizeTextParagraph>
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Box marginBottom="8px">
        <LoginButton redirectPath="/mypage" />
      </Box>
    </Container>
  );
};

export default Top;
