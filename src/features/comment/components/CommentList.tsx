import { Box, Container } from "@suid/material";
import Paper from "@suid/material/Paper/Paper";
import Stack from "@suid/material/Stack/Stack";
import { Firestore } from "firebase/firestore";
import { For, VoidComponent } from "solid-js";
import { LeactionComment } from "../types/LeactionComment";
import { SingleComment } from "./SingleComment";

type Props = {
  firestore: Firestore;
  comments: LeactionComment[];
};

export const CommentList: VoidComponent<Props> = (props: Props) => {
  return (
    <Container>
      <Stack spacing={1}>
        <For each={props.comments}>{(comment) => <SingleComment comment={comment} />}</For>
      </Stack>
    </Container>
  );
};
