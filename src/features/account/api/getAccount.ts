import { Firestore, getDoc } from "firebase/firestore";
import { Account } from "../types";
import { accountDoc } from "./firestore";

/**
 * FirestoreからAccountを取得する。
 * @param firestore Firestoreオブジェクト
 * @param uid Firebase Auth で発行されるUID
 * @returns 取得結果。存在しなければ undefined を返す。
 */
export const getAccount = (firestore: Firestore, uid: string): Promise<Account | undefined> => {
  const accountDocRef = accountDoc(firestore, uid);
  return getDoc(accountDocRef).then((value) => {
    return value.data();
  });
};
