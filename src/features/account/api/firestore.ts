import {
  doc,
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { Account } from "../hooks/useAccount";

/**
 * Account を参照する Firestore の DocumentReference.
 * Account へのコンバーター付き.
 * @param firestore Firestoreオブジェクト
 * @param uid Authで発行されたUID
 * @returns DocumentReference
 */
export const accountDoc = (firestore: Firestore, uid: string) =>
  doc(firestore, `accounts/${uid}`).withConverter(AccountFirestoreConverter);

/**
 * Firestore上のデータと相互変換するためのコンバーター
 */
export const AccountFirestoreConverter: FirestoreDataConverter<Account> = {
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
