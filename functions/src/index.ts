import { initializeApp } from "firebase-admin/app";
import { getFirestore, WriteResult, FieldValue, QuerySnapshot } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { config, https } from "firebase-functions";
import * as express from "express";
import * as bcrypt from "bcrypt";
import * as jssha256 from "js-sha256";
import * as fs from "fs";

import {
  EventRequestWithPassword,
  EventPasswordRequest,
  CommentRequest,
  CommentLikeRequest,
  CommentDeleteRequest,
  CommentResponse,
  Event, Comments
} from "./types";

const firebaseConfig = config() ? config().firebase : {};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const app = express();
const api = express.Router();

app.use(express.json());

/**
 * イベントの取得
 * @param eventId イベントID
 * @returns 
 */
const fetchEvent = (eventId: string): Promise<Event> => {
  return firestore
    .doc(`events/${eventId}`)
    .get().then((eventSnapshot) => {
      const event = eventSnapshot.data() as Event;
      return Promise.resolve(event);
    })
}
/**
 * イベントのアーカイブ状態の取得
 * @param eventId 
 * @returns 
 */
const eventIsArchived = (eventId: string): Promise<boolean> => {
  return fetchEvent(eventId).then((event) => {
    return event.isArchived || false;
  })
}

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

  return eventIsArchived(eventId).then((isArchived: boolean) => {
    if (isArchived) {
      storage.bucket().file(`archives/${eventId}.json`).createReadStream()
        .on("error", (error) => {
          console.error(error);
          res.status(500);
        })
        .on("data", (data) => {
          // console.dir({ data });
          res.set("Cache-Control", "public, max-age=86400, s-maxage=86400");
          res.send(data);
        });
    } else {
      firestore.collection(`comments-${eventId}`).stream()
        .on("error", (error) => {
          console.error(error);
          res.status(500);
        })
        .on("data", (snapshot) => {
          // console.dir({ snapshot });
          comments.push(snapshot.data());
        })
        .on("end", () => {
          res.set("Cache-Control", "public, max-age=1, s-maxage=1");
          res.json(comments);
        });
    }
  })
});

api.post("/event/:eventId/verify", async (req, res) => {
  const eventId = req.params["eventId"];
  const { password } = req.body as EventPasswordRequest;

  return firestore
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
        res.json({ message: "invalid password" });
      }
    })
    .catch((e) => {
      console.error(e);
      res.status(400);
      res.json({ message: "failed" });
    });
});

const archiveEvent = (event: Event): Promise<boolean> => {
  console.log(`Archiving event id=${event.id}`);
  // eventId のコメント一覧を取得
  const fetchComments = firestore.collection(`comments-${event.id}`).get();

  const uploadCommentsToStorage = (commentsSnapshot: QuerySnapshot) => {
    const comments = commentsSnapshot.docs.map(doc => doc.data()) as Comments;

    // 一時ファイルに保存
    const tmpFolderPath = fs.mkdtempSync("archive");
    const tmpFilePath = `${tmpFolderPath}/${event.id}.json`;
    fs.writeFileSync(tmpFilePath, JSON.stringify(comments))

    // storage に保存
    const bucket = storage.bucket();
    return bucket.upload(tmpFilePath, { destination: `archives/${event.id}.json` })
  }

  // isArchived = true
  const updateEvent = () => {
    return firestore.doc(`events/${event.id}`).update({ isArchived: true });
  }

  // コメントをfirestoreから削除
  const removeComments = () => {
    return firestore.collection(`comments-${event.id}`).get().then((commentsSnapshot: QuerySnapshot) => {
      return commentsSnapshot.docs.forEach(doc => doc.ref.delete());
    })
  }

  return fetchComments
    .then(uploadCommentsToStorage)
    .then(updateEvent)
    .then(removeComments)
    .then(() => { return true; })
    .catch((e) => {
      console.error(e);
      return false;
    });
}

/**
 * イベント編集ページから手動でアーカイブを実行するためのエンドポイント
 * 
 * path-param:
 *   eventId: イベントID
 * body:
 *   password: 管理用パスワード
 */
api.post("/event/:eventId/archive", async (req, res) => {
  const eventId = req.params["eventId"];
  const { password } = req.body as EventPasswordRequest;

  return Promise.all([
    firestore.doc(`event-secrets/${eventId}`).get(),
    firestore.doc(`events/${eventId}`).get()
  ])
    .then(([secretSnapshot, eventSnapshot]) => {
      const { hashedPassword } = secretSnapshot.data() as { hashedPassword: string };
      const event = eventSnapshot.data() as Event;
      if (!bcrypt.compare(password, hashedPassword)) {
        res.status(401).json({ message: "invalid password" });
        return;
      }
      if (event.isArchived || false) {
        res.status(200).json({ message: "already archived" });
        return;
      }
      return archiveEvent(event);
    })
    .then((result) => {
      if (result) {
        res.json({ message: "ok" });
        return;
      } else {
        res.status(400).json({ message: "failed to archive event" });
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

  return eventIsArchived(eventId).then((isArchived) => {
    if (isArchived) {
      res.status(400).json({ message: "This event is already archived." });
      return;
    } else {
      return firestore
        .doc(`comments-${eventId}/${comment.id}`)
        .create(comment)
        .then(() => res.json({ message: "ok" }))
        .catch((e) => {
          console.error(e);
          res.status(404);
          res.json({ message: "not found" });
        });
    }
  });

});

api.post("/event/:eventId/comment/:commentId/like", (req, res) => {
  const eventId = req.params["eventId"];
  const commentId = req.params["commentId"];
  const likeReq = req.body as CommentLikeRequest;

  const arrayUpdate = likeReq.remove
    ? FieldValue.arrayRemove
    : FieldValue.arrayUnion;

  return eventIsArchived(eventId).then((isArchived) => {
    if (isArchived) {
      res.status(400).json({ message: "This event is already archived." });
      return;
    } else {
      return firestore.doc(`comments-${eventId}/${commentId}`)
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
    }
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

  return eventIsArchived(eventId).then((isArchived) => {
    if (isArchived) {
      res.status(400).json({ message: "This event is already archived." });
      return;
    } else {
      return firestore
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
    }
  });
});

app.use("/api", api);

exports.app = https.onRequest(app);

// 定期的に開催日を過ぎたイベントをアーカイブする
/*
exports.scheduledArchiveEvent = functions.pubsub.schedule("0 12 * * * ").timeZone("Asia/Tokyo").onRun((context) => {
  console.log("Checking events to be archived...");
  return firestore.collection("events").where("isArchived", "!=", true).get().then((querySnapshot) => {
    return querySnapshot.docs.forEach((eventSnapshot) => {
      const event = eventSnapshot.data() as Event;
      console.dir({ event });
      if (dayjs(event.dateOfEvent).add(8, "day").isBefore(dayjs())) {
        return archiveEvent(event);
      }
      return;
    })
  })
});
*/
