import { Firestore, getDoc, getDocs, query, where } from "firebase/firestore";
import { LeactionEvent } from "../types/LeactionEvent";
import { eventCollection, eventDoc } from "./firestore";
import { Account } from "~/features/account/types/Account";

/**
 * イベント情報を取得する
 * @param firestore Firestore
 * @param id イベントID
 * @returns イベント情報(存在しない場合はundefined)
 */
export const getEvent = (firestore: Firestore, id: string): Promise<LeactionEvent | undefined> => {
  const eventRef = eventDoc(firestore, id);
  return getDoc(eventRef).then((eventData) => {
    return eventData.data();
  });
};

/**
 * アカウントに紐付いているイベント情報を取得する
 * @param firestore Firestore
 * @param account 対象のアカウント
 * @returns イベント情報の配列
 */
export const getEventsForAccount = (
  firestore: Firestore,
  account: Account
): Promise<LeactionEvent[]> => {
  const eventQuery = query(
    eventCollection(firestore),
    where("administrator", "==", account.uid)
    /* こうなる予定
    or(
      where("administrator", "==", account.uid),
      where("collabolators", "array-contains", account.uid)
    )*/
  );
  return getDocs(eventQuery).then((eventsSnapshot) => {
    return eventsSnapshot.docs.map((snapshot) => snapshot.data());
  });
};
