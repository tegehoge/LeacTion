import { getFirestore, setDoc } from "firebase/firestore";
import { Account } from "../hooks/useAccount";
import { accountDoc } from "./firestore";
import { useFirebaseApp } from "~/providers/FirebaseProvider";

export const updateAccount = (account: Account): Promise<void> => {
  const firestore = getFirestore(useFirebaseApp());
  const accountDocRef = accountDoc(firestore, account.uid);
  return setDoc(accountDocRef, account);
};
