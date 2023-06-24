import { Firestore, collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { Account } from "../types";
import { accountCollection, accountDoc } from "./firestore";

/**
 * FirestoreからAccountを取得する。
 * @param firestore Firestoreオブジェクト
 * @param uid Firebase Auth で発行されるUID
 * @returns 取得結果。存在しなければ undefined を返す。
 */
export const getAccount = (firestore: Firestore, uid: string): Promise<Account | undefined> => {
  const accountDocRef = accountDoc(firestore, uid);
  return getDoc(accountDocRef)
    .then((value) => {
      return value.data();
    })
    .catch((e) => {
      console.error(e);
      return Promise.reject(e);
    });
};

/**
 * UIDのリストでアカウントを取得
 * @param firestore Firestore
 * @param uids 検索するUIDリスト
 * @returns アカウントの一覧
 */
export const getAccountsByUid = (firestore: Firestore, uids: string[]) => {
  const accountsQuery = query(accountCollection(firestore), where("uid", "in", uids));
  return getDocs(accountsQuery).then((accountsSnapshot) => {
    return accountsSnapshot.docs.map((snapshot) => snapshot.data());
  });
};
