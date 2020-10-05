import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";
import * as express from "express";
import * as bcrypt from "bcrypt";

import {
  EventRequestWithPassword,
  EventPasswordRequest,
  CommentRequest,
  CommentLikeRequest,
} from "./types";

const firebaseConfig = functions.config() ? functions.config().firebase : {};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firestore = firebaseApp.firestore();

const app = express();
const api = express.Router();

app.use(express.json());

api.get("/event/:event_id", (req, res) => {
  const event_id = req.params["event_id"];
  firestore
    .doc(`events/${event_id}`)
    .get()
    .then((snapshot) => {
      res.set("Cache-Control", "public, max-age=300, s-maxage=10");
      res.send(snapshot.data());
    })
    .catch((e) => {
      console.error(e);
      res.status(404);
      res.json({ message: "not found" });
    });
});

api.post("/event", (req, res) => {
  const eventWithPassword = req.body as EventRequestWithPassword;
  const { password, ...event } = eventWithPassword;

  const createNewEvent = (): Promise<any> => {
    const passwordHashing = bcrypt.hash(password, 10);

    const eventSaveTask = firestore.doc(`events/${event.id}`).set(event);
    const passwordSaveTask = passwordHashing.then((hashedPassword) => {
      return firestore.doc(`event-secrets/${event.id}`).set({ hashedPassword });
    });

    return Promise.all([eventSaveTask, passwordSaveTask]);
  };
  const updateEvent = (data: { hashedPassword: string }): Promise<any> => {
    const { hashedPassword } = data;
    return bcrypt.compare(password, hashedPassword).then((isVerified) => {
      if (isVerified) {
        return firestore.doc(`events/${event.id}`).update(event);
      } else {
        return Promise.reject("unauthorized");
      }
    });
  };

  firestore
    .doc(`event-secrets/${event.id}`)
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        return updateEvent(snapshot.data() as { hashedPassword: string });
      } else {
        return createNewEvent();
      }
    })
    .then(() => res.json({ message: "ok" }))
    .catch((e) => {
      console.error(e);
      res.status(400);
      res.json({ message: "failed" });
    });
});

api.get("/event/:event_id/comments", (req, res) => {
  const event_id = req.params["event_id"];
  const comments: object[] = [];
  firestore
    .collection(`comments-${event_id}`)
    .stream()
    .on("data", (snapshot) => {
      comments.push(snapshot.data());
    })
    .on("end", () => {
      res.set("Cache-Control", "public, max-age=5, s-maxage=2");
      res.json(comments);
    });
});

api.post("/event/:event_id/verify", async (req, res) => {
  const event_id = req.params["event_id"];
  const { password } = req.body as EventPasswordRequest;

  firestore
    .doc(`event-secrets/${event_id}`)
    .get()
    .then((snapshot) => {
      const { hashedPassword } = snapshot.data() as { hashedPassword: string };
      return bcrypt.compare(password, hashedPassword);
    })
    .then((result) => {
      if (result) {
        res.json({ message: "ok" });
      } else {
        res.status(401).json({ message: "invalid password" });
      }
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
      res.json({ message: "failed" });
    });
});

api.post("/event/:event_id/comment", (req, res) => {
  const event_id = req.params["event_id"];
  const comment = req.body as CommentRequest;
  firestore
    .doc(`comments-${event_id}/${comment.id}`)
    .create(comment)
    .then(() => res.json({ message: "ok" }))
    .catch((e) => {
      console.error(e);
      res.status(404);
      res.json({ message: "not found" });
    });
});

api.post("/event/:event_id/comment/:comment_id/like", (req, res) => {
  const event_id = req.params["event_id"];
  const comment_id = req.params["comment_id"];
  const likeReq = req.body as CommentLikeRequest;

  const arrayUpdate = likeReq.remove
    ? firebase.firestore.FieldValue.arrayRemove
    : firebase.firestore.FieldValue.arrayUnion;

  const docRef = firestore.doc(`comments-${event_id}/${comment_id}`);
  docRef
    .update({
      likes: arrayUpdate(likeReq.user_id_hashed),
    })
    .then((result) => {
      res.json({ message: "ok" });
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
      res.json({ message: "failed" });
    });
});

app.use("/api", api);

exports.app = functions.https.onRequest(app);
