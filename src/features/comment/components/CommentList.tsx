import { Container } from "@suid/material";
import Stack from "@suid/material/Stack/Stack";
import { Firestore } from "firebase/firestore";
import { For, VoidComponent } from "solid-js";
import { Comment } from "../types";
import { SingleComment } from "./SingleComment";

type Props = {
  firestore: Firestore;
  comments: Comment[];
  currentUid: string;
};

export const CommentList: VoidComponent<Props> = (props: Props) => {
  return (
    <Container>
      <Stack spacing={1}>
        <For each={props.comments}>
          {(comment) => (
            <SingleComment
              firestore={props.firestore}
              comment={comment}
              currentUid={props.currentUid}
            />
          )}
        </For>
      </Stack>
    </Container>
  );
};
