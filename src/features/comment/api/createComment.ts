import { Firestore, addDoc, documentId, serverTimestamp } from "firebase/firestore";
import { createSignal } from "solid-js";
import { commentCollection } from "./firestoreConversion";

const createComment = (
  firestore: Firestore,
  eventId: string,
  talkId: string,
  content: string,
  postedBy: string
) => {
  const collectionRef = commentCollection(firestore, eventId);
  return addDoc(collectionRef, {
    id: documentId(),
    content: content,
    postedBy: postedBy,
    postedAt: serverTimestamp(),
    eventId: eventId,
    talkId: talkId,
    likedBy: new Array<string>(),
  });
};

type UseCreateCommentProps = {
  firestore: Firestore;
  config: {
    eventId: string;
    talkId: string;
    postedBy: string;
  };
};

export const useCreateComment = (props: UseCreateCommentProps) => {
  const [content, setContent] = createSignal<string>("");

  const sendComment = () => {
    if (content().trim().length == 0) return Promise.reject();
    return createComment(
      props.firestore,
      props.config.eventId,
      props.config.talkId,
      content(),
      props.config.postedBy
    )
      .then((_) => {
        setContent("");
      })
      .catch((reason) => {
        console.error(reason);
      });
  };

  const canSendComment = () => content().trim().length != 0;

  return { content, setContent, sendComment, canSendComment };
};
