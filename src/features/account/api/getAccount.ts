import { Firestore, getDoc } from "firebase/firestore";
import { Account } from "../hooks/useAccount";
import { accountDoc } from "./firestore";

export const getAccount = (firestore: Firestore, uid: string): Promise<Account | undefined> => {
  const accountDocRef = accountDoc(firestore, uid);
  return getDoc(accountDocRef).then((value) => {
    return value.data();
  });
};
