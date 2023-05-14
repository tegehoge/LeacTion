import { useNavigate, useSearchParams } from "@solidjs/router";
import { Box, Container, Typography } from "@suid/material";
import { Show, VoidComponent, createEffect } from "solid-js";
import googleSignInFocusImg from "~/assets/btn_google_signin_dark_focus_web.png";
import googleSignInNormalImg from "~/assets/btn_google_signin_dark_normal_web.png";
import googleSignInPressedImg from "~/assets/btn_google_signin_dark_pressed_web.png";
import { useAuthContext } from "~/providers/AuthProvider";

const LoginPage: VoidComponent = () => {
  const navigate = useNavigate();
  const [{ callback }] = useSearchParams<{ callback?: string }>();
  const callbackPath = callback || "/mypage";

  const [auth, { signInWithPopup }] = useAuthContext();

  const loginAndRedirect = () => {
    signInWithPopup()
      .then((_) => {
        return navigate(callbackPath);
      })
      .catch((e) => console.log(e));
  };

  createEffect(() => {
    if (!auth.loading && auth.account) {
      navigate(callbackPath, { replace: true });
    }
  });

  return (
    <Container sx={{ textAlign: "center" }}>
      <Show when={!auth.loading}>
        <Box sx={{ margin: "20px" }}>
          <Typography variant="h6">
            イベントの作成・管理を行うには
            <br />
            Googleアカウントでログインしてください
          </Typography>
        </Box>
        <Box>
          <img
            src={googleSignInNormalImg}
            onClick={loginAndRedirect}
            onMouseOver={(e) => (e.currentTarget.src = googleSignInFocusImg)}
            onMouseLeave={(e) => (e.currentTarget.src = googleSignInNormalImg)}
            onMouseDown={(e) => (e.currentTarget.src = googleSignInPressedImg)}
            onMouseUp={(e) => (e.currentTarget.src = googleSignInNormalImg)}
          />
        </Box>
      </Show>
    </Container>
  );
};

export default LoginPage;
