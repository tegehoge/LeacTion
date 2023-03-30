import { Firestore, setDoc } from "firebase/firestore";
import { Account } from "../types/Account";
import { accountDoc } from "./firestore";

export const updateAccount = (firestore: Firestore, account: Account): Promise<void> => {
  const accountDocRef = accountDoc(firestore, account.uid);
  return setDoc(accountDocRef, account);
};
