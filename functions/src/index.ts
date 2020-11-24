import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";
import * as express from "express";
import * as bcrypt from "bcrypt";
import * as jssha256 from "js-sha256";
import { WriteResult } from "@google-cloud/firestore";

import {
  EventRequestWithPassword,
  EventPasswordRequest,
  CommentRequest,
  CommentLikeRequest,
  CommentDeleteRequest,
  CommentResponse,
} from "./types";

const firebaseConfig = functions.config() ? functions.config().firebase : {};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firestore = firebaseApp.firestore();

const app = express();
const api = express.Router();

app.use(express.json());

api.get("/event/:eventId", (req, res) => {
  const eventId = req.params["eventId"];
  firestore
    .doc(`events/${eventId}`)
    .get()
    .then((snapshot) => {
      res.set("Cache-Control", "public, max-age=5, s-maxage=5");
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

  const createNewEvent = (): Promise<WriteResult> => {
    const passwordHashing = bcrypt.hash(password, 10);

    const eventSaveTask = firestore.doc(`events/${event.id}`).set(event);
    const passwordSaveTask = passwordHashing.then((hashedPassword) => {
      return firestore.doc(`event-secrets/${event.id}`).set({ hashedPassword });
    });

    return Promise.all([eventSaveTask, passwordSaveTask]).then(result => result[0]);
  };
  const updateEvent = (data: { hashedPassword: string }): Promise<WriteResult> => {
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

api.get("/event/:eventId/comments", (req, res) => {
  const eventId = req.params["eventId"];
  const comments: CommentResponse[] = [];
  firestore
    .collection(`comments-${eventId}`)
    .stream()
    .on("data", (snapshot) => {
      comments.push(snapshot.data());
    })
    .on("end", () => {
      res.set("Cache-Control", "public, max-age=1, s-maxage=1");
      res.json(comments);
    });
});

api.post("/event/:eventId/verify", async (req, res) => {
  const eventId = req.params["eventId"];
  const { password } = req.body as EventPasswordRequest;

  firestore
    .doc(`event-secrets/${eventId}`)
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

api.post("/event/:eventId/comment", (req, res) => {
  const eventId = req.params["eventId"];
  const comment = req.body as CommentRequest;
  firestore
    .doc(`comments-${eventId}/${comment.id}`)
    .create(comment)
    .then(() => res.json({ message: "ok" }))
    .catch((e) => {
      console.error(e);
      res.status(404);
      res.json({ message: "not found" });
    });
});

api.post("/event/:eventId/comment/:commentId/like", (req, res) => {
  const eventId = req.params["eventId"];
  const commentId = req.params["commentId"];
  const likeReq = req.body as CommentLikeRequest;

  const arrayUpdate = likeReq.remove
    ? firebase.firestore.FieldValue.arrayRemove
    : firebase.firestore.FieldValue.arrayUnion;

  const docRef = firestore.doc(`comments-${eventId}/${commentId}`);
  docRef
    .update({
      likes: arrayUpdate(likeReq.userIdHashed),
    })
    .then(() => {
      res.json({ message: "ok" });
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
      res.json({ message: "failed" });
    });
});

api.post("/event/:eventId/comment/:commentId/delete", (req, res) => {
  const eventId = req.params["eventId"];
  const commentId = req.params["commentId"];
  const deleteReq = req.body as CommentDeleteRequest;

  const deleteComment = (data: { userIdHashed: string }): Promise<WriteResult> => {
    const { userIdHashed } = data;
    if (userIdHashed === jssha256.sha256(deleteReq.userId)) {
      return firestore.doc(`comments-${eventId}/${commentId}`).delete();
    } else {
      return Promise.reject("unauthorized");
    }
  };

  firestore
    .doc(`comments-${eventId}/${commentId}`)
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        return deleteComment(snapshot.data() as { userIdHashed: string });
      } else {
        return Promise.reject("not found");
      }
    })
    .then(() => res.json({ message: "ok" }))
    .catch((e) => {
      console.error(e);
      res.status(403);
      res.json({ message: "failed" });
    });
});

app.use("/api", api);

exports.app = functions.https.onRequest(app);
