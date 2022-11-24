import { getAuth, GoogleAuthProvider, User } from "firebase/auth";
import { Firestore, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "solid-firebase";
import { useFirebaseApp } from "./FirebaseProvider";
import { Account, accountDoc } from "~/models/Account";

export type AuthState = {
  loading: boolean;
  data: User | null;
  error: Error | null;
};

export const useAuthState = (): AuthState => useAuth(getAuth(useFirebaseApp()));

const signedInWithGoogleProvider = (authState: AuthState): boolean => {
  if (authState.loading) return true; // 認証情報の読込中は判定を保留
  if (
    authState.data?.providerData.some(
      (userInfo) => userInfo.providerId === GoogleAuthProvider.PROVIDER_ID
    )
  ) {
    return true;
  }
  return false;
};

export const checkSignedInWithGoogle = (
  authState: AuthState,
  firestore: Firestore
): Promise<Account> => {
  if (authState.loading) return Promise.reject("loading authentication data.");
  if (!signedInWithGoogleProvider(authState)) {
    return Promise.reject("Forbidden.");
  }
  if (authState.data) {
    const user = authState.data;
    const authDisplayName = user.displayName || "";
    const accountDocRef = accountDoc(firestore, user.uid);
    return getDoc(accountDocRef).then((snapshot) => {
      if (!snapshot.exists()) {
        const initialAccount = {
          uid: user.uid,
          displayName: authDisplayName,
        };
        setDoc(accountDocRef, initialAccount);
        return initialAccount;
      } else {
        return snapshot.data();
      }
    });
  }
  return Promise.reject();
};
