import { getDoc, getFirestore, setDoc } from "firebase/firestore";
import { Account } from "../hooks/useAccount";
import { accountDoc } from "./firestore";
import { useFirebaseApp } from "~/providers/FirebaseProvider";

export const getAccount = (uid: string): Promise<Account | undefined> => {
  const firestore = getFirestore(useFirebaseApp());
  const accountDocRef = accountDoc(firestore, uid);
  return getDoc(accountDocRef).then((value) => {
    return value.data();
  });
};
