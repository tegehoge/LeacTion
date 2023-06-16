import {
  collection,
  doc,
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { Account } from "../types";

/**
 * Account を参照する Firestore の DocumentReference.
 * Account へのコンバーター付き.
 * @param firestore Firestoreオブジェクト
 * @param uid Authで発行されたUID
 * @returns DocumentReference
 */
export const accountDoc = (firestore: Firestore, uid: string) =>
  doc(firestore, "accounts_v2", uid).withConverter(AccountFirestoreConverter);

export const accountCollection = (firestore: Firestore) =>
  collection(firestore, "accounts_v2").withConverter(AccountFirestoreConverter);

/**
 * Firestore上のデータと相互変換するためのコンバーター
 */
const AccountFirestoreConverter: FirestoreDataConverter<Account> = {
  toFirestore(modelObject: WithFieldValue<Account>): DocumentData {
    return {
      uid: modelObject.uid,
      displayName: modelObject.displayName,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions | undefined
  ): Account {
    const user = snapshot.data(options);
    return {
      uid: user.uid,
      displayName: user.displayName,
    };
  },
};
