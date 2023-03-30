import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useAuth } from "solid-firebase";
import { Component, createContext, createEffect, JSX, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { useFirebaseApp } from "./FirebaseProvider";
import { createAccount, getAccount } from "~/features/account/api";
import { Account } from "~/features/account/types/Account";

type AuthContextStore = {
  loading: boolean;
  uid: string | null; // 匿名アカウントでも uid は発行される
  account: Account | null; // Googleアカウントがある場合にセットされる
  signInWithPopup: () => Promise<UserCredential>;
  signInAnonymously: () => Promise<UserCredential>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextStore>();

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useFirebaseApp must be used within a <AuthProvider />");
  return ctx;
};

const isSignedInWithGoogleProvider = (user: User): boolean => {
  return user.providerData.some(
    (userInfo) => userInfo.providerId === GoogleAuthProvider.PROVIDER_ID
  );
};

const fetchAccount = (user: User): Promise<Account> => {
  if (!isSignedInWithGoogleProvider(user)) {
    console.debug("Failed to guard.");
    return Promise.reject();
  }
  const authDisplayName = user.displayName || "";
  const firestore = getFirestore(useFirebaseApp());
  console.debug("Loading account...");
  return getAccount(firestore, user.uid)
    .then((account) => {
      if (!account) {
        const initialAccount = {
          uid: user.uid,
          displayName: authDisplayName,
        };
        createAccount(firestore, initialAccount);
        return initialAccount;
      }
      return account;
    })
    .catch((e) => {
      return Promise.reject(e);
    });
};

interface Props {
  children: JSX.Element;
}

export const AuthProvider: Component<Props> = (props) => {
  const auth = getAuth(useFirebaseApp());
  const authState = useAuth(auth);

  const [context, setContext] = createStore<AuthContextStore>({
    loading: authState.loading,
    uid: authState.data?.uid || null,
    account: null,
    signInWithPopup: () => signInWithPopup(auth, new GoogleAuthProvider()),
    signInAnonymously: () => signInAnonymously(auth),
    signOut: () => signOut(auth),
  });

  // 認証情報をセットして完了とする
  const setSignInContext = (uid: string | null = null, account: Account | null = null) => {
    return setContext(
      produce((ctx) => {
        ctx.loading = false;
        ctx.uid = uid;
        ctx.account = account;
      })
    );
  };

  createEffect(() => {
    if (authState.loading) {
      console.debug("Loading auth");
      return setContext("loading", true);
    }
    if (authState.data) {
      setContext("loading", true);
      const user = authState.data;
      // 匿名アカウント
      if (!isSignedInWithGoogleProvider(user)) {
        console.debug("Signed in anonymously");
        return setSignInContext(user.uid);
      }
      // Googleアカウント
      return fetchAccount(user).then((account) => {
        console.debug("Signed in with Google");
        return setSignInContext(account.uid, account);
      });
    } else {
      // ログアウト
      console.debug("Signed out");
      return setSignInContext();
    }
  });

  return <AuthContext.Provider value={context}>{props.children}</AuthContext.Provider>;
};
