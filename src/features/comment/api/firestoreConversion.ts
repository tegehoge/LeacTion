import {
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  collection,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Comment } from "../types/Comment";

/**
 * イベントIDとコメントIDでドキュメントを指定
 * @param firestore Firestore
 * @param eventId イベントID
 * @param id コメントID
 * @returns コメントのFirestoreドキュメント
 */
export const commentDoc = (firestore: Firestore, eventId: string, id: string) =>
  doc(firestore, "events", eventId, "comments", id).withConverter(CommentFirestoreConverter);

/**
 * イベント内のコメントのFirestoreコレクションを取得
 * @param firestore Firestore
 * @param eventId イベントID
 * @returns コメントのFirestoreコレクション
 */
export const commentCollection = (firestore: Firestore, eventId: string) =>
  collection(firestore, "events", eventId, "comments").withConverter(CommentFirestoreConverter);

/**
 * Firestore上のデータと相互変換するためのコンバーター
 */
const CommentFirestoreConverter: FirestoreDataConverter<Comment> = {
  toFirestore(comment: WithFieldValue<Comment>): DocumentData {
    // only for create
    return {
      content: comment.content,
      postedBy: comment.postedBy,
      postedAt: serverTimestamp(),
      eventId: comment.eventId,
      talkId: comment.talkId,
      likedBy: [],
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Comment {
    const commentData = snapshot.data(options);
    return {
      id: snapshot.id,
      content: commentData.content,
      postedBy: commentData.postedBy,
      postedAt: commentData.postedAt?.toDate() || new Date(),
      eventId: commentData.eventId,
      talkId: commentData.talkId,
      likedBy: commentData.likedBy,
    };
  },
};
