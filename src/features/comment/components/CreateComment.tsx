import { Box, Button, FormControl, Grid, TextField } from "@suid/material";
import { Firestore } from "firebase/firestore";
import { VoidComponent } from "solid-js";
import { useCreateComment } from "../api";

type CreateCommentProps = {
  firestore: Firestore;
  config: {
    eventId: string;
    talkId: string;
    postedBy: string;
  };
};

export const CreateComment: VoidComponent<CreateCommentProps> = (props) => {
  const { content, setContent, sendComment, canSendComment } = useCreateComment(props);
  return (
    <Box>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={10}>
          <TextField
            value={content()}
            multiline
            fullWidth
            size="small"
            variant="outlined"
            onChange={(e) => setContent(e.target.value)}
          />
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <Button
              color="primary"
              variant="contained"
              disabled={!canSendComment()}
              onClick={sendComment}
            >
              送信する
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};
