import * as functions from "firebase-functions";
import * as firebase from "firebase-admin";
import * as express from "express";

const firebaseConfig = functions.config() ? functions.config().firebase : {};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firestore = firebaseApp.firestore();

const app = express();
const api = express.Router();

app.use(express.json());

api.get("/event/:id", (req, res) => {
  const event_id = req.params["id"];
  firestore
    .doc(`events/${event_id}`)
    .get()
    .then((snapshot) => {
      res.set("Cache-Control", "public, max-age=300, s-maxage=10");
      res.send(snapshot.data());
    })
    .catch((e) => {
      console.error(e);
      res.status(404).send("");
    });
});

api.post("/event", (req, res) => {
  const event = req.body;

  firestore
    .doc(`events/${event.id}`)
    .set(event)
    .then(() => res.json({ message: "ok" }))
    .catch((e) => {
      console.error(e);
      res.status(400);
    });
});

api.get("/event/:id/comments", (req, res) => {
  const event_id = req.params["id"];
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

api.post("/event/:id/comment", (req, res) => {
  const event_id = req.params["id"];
  const comment = req.body as { id: string };
  firestore
    .doc(`comments-${event_id}/${comment.id}`)
    .set(comment)
    .then(() => res.json({ message: "ok" }))
    .catch((e) => {
      console.error(e);
      res.status(400);
    });
});

app.use("/api", api);

exports.app = functions.https.onRequest(app);
