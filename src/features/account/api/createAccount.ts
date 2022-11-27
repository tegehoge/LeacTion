import { Firestore, setDoc } from "firebase/firestore";
import { Account } from "../hooks/useAccount";
import { accountDoc } from "./firestore";

export const createAccount = (firestore: Firestore, account: Account): Promise<void> => {
  const accountDocRef = accountDoc(firestore, account.uid);
  return setDoc(accountDocRef, account);
};
