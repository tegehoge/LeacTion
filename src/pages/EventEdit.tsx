import { useNavigate, useParams } from "@solidjs/router";
import { Box, Typography } from "@suid/material";
import { getFirestore } from "firebase/firestore";
import { VoidComponent, createEffect, createResource } from "solid-js";
import { getEvent } from "~/features/event/api";
import { UpdateEvent } from "~/features/event/components";
import { useAuthContext } from "~/providers/AuthProvider";
import { useFirebaseApp } from "~/providers/FirebaseProvider";

const EventEdit: VoidComponent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const firestore = getFirestore(useFirebaseApp());
  const auth = useAuthContext();
  const [event] = createResource(() => getEvent(firestore, eventId));

  const canEdit = () =>
    auth.account &&
    event() &&
    (event()?.administrator == auth.account?.uid ||
      event()?.collaborators.includes(auth.account?.uid));

  createEffect(() => {
    if (!event.loading && !auth.loading) {
      if (!canEdit()) {
        navigate("/");
      }
    }
  });

  return (
    <Box>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          イベントの編集
        </Typography>
      </Box>
      {canEdit() && <UpdateEvent firestore={firestore} currentEvent={event()!} />}
    </Box>
  );
};

export default EventEdit;
