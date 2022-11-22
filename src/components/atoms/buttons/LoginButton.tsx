import { useNavigate } from "@solidjs/router";
import Button from "@suid/material/Button";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ParentComponent } from "solid-js";
import { useFirebaseApp } from "~/firebase/FirebaseProvider";

type Props = {
  redirectPath: string;
};

export const LoginButton: ParentComponent<Props> = (props) => {
  const navigate = useNavigate();
  const app = useFirebaseApp();
  const signIn = () =>
    signInWithPopup(getAuth(app), new GoogleAuthProvider())
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
