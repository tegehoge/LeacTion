import { useTheme } from "@suid/material";
import Box from "@suid/material/Box";
import Button from "@suid/material/Button";
import Container from "@suid/material/Container";
import Paper from "@suid/material/Paper";
import Stack from "@suid/material/Stack";
import Typography from "@suid/material/Typography";
import { Component } from "solid-js";

import { RouterLink } from "~/components/atoms/links";
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
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: primaryMainColor }}>
              「LeacTion!」は、勉強会やセミナーで発表者と参加者をつなぐ、
              <br />
              オンラインコメントツールです
            </Typography>
          </Paper>
        </Box>

        <Box marginBottom="40px">
          <RouterLink href="/new">
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                fontWeight: "bold",
                letterSpacing: ".1em",
              }}
            >
              イベントを登録する
            </Button>
          </RouterLink>
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
                <Typography variant="subtitle2" paragraph marginBottom={0}>
                  勉強会やセミナーで、スマートフォンやパソコンを使い、リアルタイムに質問やコメントを投稿できるサービスです。
                  <br />
                  オフラインのセミナーや勉強会はもちろん、オンラインイベントやオンライン・オフライン同時開催イベントでも利用できます。
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        <Box marginBottom="40px">
          <Paper elevation={0}>
            <Box marginBottom="40px">
              <Typography variant="subtitle1" fontWeight="bold">
                LeacTion! でイベントが盛り上がる
              </Typography>
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
                <Typography variant="subtitle2">
                  参加者は、イベントページを開くだけですぐにコメントや質問を投稿できます。
                  <br />
                  管理者も、面倒な会員登録やログインは不要。イベントにパスワードを設定するだけで、後から編集も可能です。
                </Typography>
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
                <Typography variant="subtitle2">
                  発表者は「いいね！」ボタンで「自分も気になる！」「自分もそう思う」と意思表明できます。
                  発表中や質問タイムに、特に参加者の関心がある質問・コメントを見つけやすくなります。
                </Typography>
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
                <Typography variant="subtitle2">
                  発表者は「いいね！」ボタンで「自分も気になる！」「自分もそう思う」と意思表明できます。
                  発表中や質問タイムに、特に参加者の関心がある質問・コメントを見つけやすくなります。
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>

        <Box marginBottom="8px">
          <RouterLink href="/new">
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                fontWeight: "bold",
                letterSpacing: ".1em",
              }}
            >
              イベントを登録する
            </Button>
          </RouterLink>
        </Box>
      </Container>
    </BaseLayout>
  );
};

export default Top;
