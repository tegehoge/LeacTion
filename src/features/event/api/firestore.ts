import {
  collection,
  doc,
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  serverTimestamp,
} from "firebase/firestore";
import { Event } from "../types";

/**
 * イベントIDでドキュメントを指定
 * @param firestore Firestore
 * @param id イベントID
 * @returns イベントのFirestoreドキュメント
 */
export const eventDoc = (firestore: Firestore, id: string) =>
  doc(firestore, `events/${id}`).withConverter(EventFirestoreConverter);

/**
 * イベントのFirestoreコレクションを取得
 * @param firestore Firestore
 * @returns イベントのFirestoreコレクション
 */
export const eventCollection = (firestore: Firestore) =>
  collection(firestore, "events").withConverter(EventFirestoreConverter);

/**
 * Firestore上のデータと相互変換するためのコンバーター
 */
const EventFirestoreConverter: FirestoreDataConverter<Event> = {
  toFirestore(event: Event): DocumentData {
    return {
      id: event.id,
      name: event.name,
      date: event.date.toISOString().slice(0, 10), // ex. "2023-04-16"
      url: event.url || null,
      hashTag: event.hashTag || null,
      talks: event.talks,
      administrator: event.administrator,
      collaborators: event.collaborators,
      createdAt: event.createdAt || serverTimestamp(),
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Event {
    const eventData = snapshot.data(options);
    return {
      id: eventData.id,
      name: eventData.name,
      date: new Date(eventData.date),
      url: eventData.url || undefined,
      hashTag: eventData.hashTag || undefined,
      talks: eventData.talks,
      administrator: eventData.administrator,
      collaborators: eventData.collaborators,
      createdAt: eventData.createdAt,
    };
  },
};
