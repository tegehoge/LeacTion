import {
  collection,
  doc,
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";
import { LeactionEvent } from "../types/LeactionEvent";

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
const EventFirestoreConverter: FirestoreDataConverter<LeactionEvent> = {
  toFirestore(event: LeactionEvent): DocumentData {
    return {
      id: event.id,
      name: event.name,
      date: event.date.toLocaleDateString(),
      url: event.url,
      hashTag: event.hashTag,
      talks: event.talks,
      administrator: event.administrator,
      collaborators: event.collaborators,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): LeactionEvent {
    const eventData = snapshot.data(options);
    return {
      id: eventData.id,
      name: eventData.name,
      date: new Date(eventData.date),
      url: eventData.url,
      hashTag: eventData.hashTag,
      talks: eventData.talks,
      administrator: eventData.administrator,
      collaborators: eventData.collaborators,
    };
  },
};
