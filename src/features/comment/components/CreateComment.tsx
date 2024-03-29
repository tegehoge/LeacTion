import { Box, Button, FormControl, Grid, TextField } from "@suid/material";
import { Firestore } from "firebase/firestore";
import { VoidComponent } from "solid-js";
import toast from "solid-toast";
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

  const handleSendComment = () => {
    if (canSendComment()) {
      sendComment().then(() => {
        toast.success("コメントを追加しました！");
      });
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.shiftKey && event.key === "Enter") {
      event.preventDefault();
      handleSendComment();
    }
  };

  return (
    <Box>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={9}>
          <TextField
            value={content()}
            multiline
            fullWidth
            size="small"
            variant="outlined"
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <Button
              color="primary"
              variant="contained"
              disabled={!canSendComment()}
              onClick={handleSendComment}
            >
              送信する(Shift+Enter)
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};
