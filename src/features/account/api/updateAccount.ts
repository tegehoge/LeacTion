import { Firestore, updateDoc } from "firebase/firestore";
import { Account } from "../types";
import { accountDoc } from "./firestore";

export const updateAccountDisplayName = (
  firestore: Firestore,
  account: Account,
  displayName: string
): Promise<void> => {
  const accountDocRef = accountDoc(firestore, account.uid);
  return updateDoc(accountDocRef, { displayName: displayName });
};
