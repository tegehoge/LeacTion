import { useNavigate, useParams } from "@solidjs/router";
import { Box, Typography } from "@suid/material";
import { VoidComponent, createEffect, createResource } from "solid-js";
import { getEvent } from "~/features/event/api";
import { UpdateEvent } from "~/features/event/components";
import { useAuthContext } from "~/providers/AuthProvider";
import { useFirestore } from "~/providers/FirebaseProvider";

const EventEdit: VoidComponent = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const firestore = useFirestore();
  const [auth] = useAuthContext();
  const [event] = createResource(() => getEvent(firestore, eventId));

  const isEditable = () => auth.account && event() && event()?.managers.includes(auth.account?.uid);

  createEffect(() => {
    if (!event.loading && !auth.loading) {
      if (!isEditable()) {
        navigate("/", { replace: true });
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
      {isEditable() && (
        <UpdateEvent firestore={firestore} currentEvent={event()!} account={auth.account!} />
      )}
    </Box>
  );
};

export default EventEdit;
