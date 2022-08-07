import { useTheme } from "@suid/material";
import Box from "@suid/material/Box";
import Container from "@suid/material/Container";
import Paper from "@suid/material/Paper";
import Stack from "@suid/material/Stack";
import Typography from "@suid/material/Typography";
import { Component } from "solid-js";

import { LargeButtonWithRouterLink } from "~/components/atoms/buttons";
import { MediumSizeTextParagraph } from "~/components/atoms/typographies";
import { LargeSizeText } from "~/components/atoms/typographies";
import { BaseLayout } from "~/components/templates";

const Top: Component = () => {
  const theme = useTheme();
  const { light: primaryLightColor, main: primaryMainColor } = theme.palette.primary;

  return (
    <BaseLayout>
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
          <LargeButtonWithRouterLink href="/new">イベントを登録する</LargeButtonWithRouterLink>
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
                src="/src/assets/baloon.png"
                alt="コメントロゴ"
                marginX="auto"
                marginBottom="12px"
                width="96px"
              />
              <Typography
                variant="h6"
                marginBottom="40px"
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
                <Typography variant="subtitle2" paragraph marginBottom={0} />
              </Box>
            </Stack>
          </Paper>
        </Box>

        <Box marginBottom="40px">
          <Paper elevation={0}>
            <Box marginBottom="40px">
              <LargeSizeText>LeacTion! でイベントが盛り上がる</LargeSizeText>
              <Typography variant="h5" fontWeight="bold">
                ３つの理由
              </Typography>
            </Box>
            <Stack spacing={8} maxWidth={512} marginX="auto">
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  marginBottom="16px"
                  sx={{
                    textDecoration: "underline",
                  }}
                >
                  参加者も管理者もログイン不要！
                </Typography>
                <MediumSizeTextParagraph>
                  参加者は、イベントページを開くだけですぐにコメントや質問を投稿できます。
                  <br />
                  管理者も、面倒な会員登録やログインは不要。イベントにパスワードを設定するだけで、後から編集も可能です。
                </MediumSizeTextParagraph>
              </Box>
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  marginBottom="16px"
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
          <LargeButtonWithRouterLink href="/new">イベントを登録する</LargeButtonWithRouterLink>
        </Box>
      </Container>
    </BaseLayout>
  );
};

export default Top;
