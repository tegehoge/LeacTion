import { useNavigate } from "@solidjs/router";
import Button from "@suid/material/Button";
import { ParentComponent } from "solid-js";
import { useAuthContext } from "~/firebase/AuthProvider";

type Props = {
  redirectPath: string;
};

export const LoginButton: ParentComponent<Props> = (props) => {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const signIn = () =>
    auth
      .signInWithPopup()
      .then((_) => navigate(props.redirectPath))
      .catch((e) => {
        console.error(e);
      });

  return (
    <Button
      variant="contained"
      fullWidth
      size="large"
      sx={{
        fontWeight: "bold",
        letterSpacing: ".1em",
      }}
      onClick={signIn}
    >
      {props.children}
    </Button>
  );
};
