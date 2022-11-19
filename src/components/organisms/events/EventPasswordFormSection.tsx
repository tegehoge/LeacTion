import { Box, Grid, TextField, Typography } from "@suid/material";
import { VoidComponent } from "solid-js";

type Props = {
  password: string;
  passwordConfirm: string;
  errorMessage?: string;
  onChange: (key: "password" | "passwordConfirm", value: string) => void;
};

export const EventPasswordFormSection: VoidComponent<Props> = (props) => {
  return (
    <>
      <Typography variant="h6" fontWeight="bold" sx={{ textAlign: "center", marginBottom: "16px" }}>
        編集用パスワードの設定
      </Typography>
      <Box component="form" marginBottom="32px">
        <Grid container spacing={3} sx={{ flexGrow: 1, justifyContent: "center" }}>
          <Grid item xs={12} sm={4}>
            <TextField
              name="password"
              required
              label="管理者パスワード"
              type="password"
              placeholder="パスワード"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              autoComplete="off"
              value={props.password}
              onChange={(_, target) => props.onChange("password", target)}
              error={!!props.errorMessage}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="passwordConfirm"
              value={props.passwordConfirm}
              label="管理者パスワード (確認用)"
              type="password"
              required
              placeholder="パスワード (確認用)"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              autoComplete="off"
              onChange={(_, target) => props.onChange("passwordConfirm", target)}
              error={!!props.errorMessage}
              helperText={props.errorMessage && props.errorMessage}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
