import {
  getAuth,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { Firestore } from "firebase/firestore";
import { useAuth } from "solid-firebase";
import { createContext, createEffect, ParentComponent, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { useFirebaseApp, useFirestore } from "./FirebaseProvider";
import { createAccount, getAccount, updateAccountDisplayName } from "~/features/account/api";
import { Account } from "~/features/account/types";

type AuthContextState = {
  loading: boolean;
  uid: string | null; // 匿名アカウントでも uid は発行される
  account: Account | null; // Googleアカウントがある場合にセットされる
};

type AuthContextObject = [
  AuthContextState,
  {
    signInWithPopup: () => Promise<UserCredential>;
    signInAnonymously: () => Promise<UserCredential>;
    signOut: () => Promise<void>;
    updateDisplayName: (displayName: string) => Promise<void>;
  }
];

const AuthContext = createContext<AuthContextObject>();

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

const fetchAccount = (firestore: Firestore, user: User): Promise<Account> => {
  if (!isSignedInWithGoogleProvider(user)) {
    console.debug("Failed to guard.");
    return Promise.reject();
  }
  const authDisplayName = user.displayName || "";
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

export const AuthProvider: ParentComponent = (props) => {
  const auth = getAuth(useFirebaseApp());
  const authState = useAuth(auth);
  const firestore = useFirestore();

  const [state, setState] = createStore<AuthContextState>({
    loading: authState.loading,
    uid: authState.data?.uid || null,
    account: null,
  });

  // 認証情報をセットして完了とする
  const setSignInContext = (uid: string | null = null, account: Account | null = null) => {
    return setState({
      loading: false,
      uid: uid,
      account: account,
    });
  };

  createEffect(() => {
    if (authState.loading) {
      console.debug("Loading auth");
      return setState("loading", true);
    }
    if (authState.data) {
      setState("loading", true);
      const user = authState.data;
      // 匿名アカウント
      if (user.isAnonymous) {
        console.debug("Signed in anonymously");
        return setSignInContext(user.uid);
      }
      // Googleアカウント
      if (isSignedInWithGoogleProvider(user)) {
        return fetchAccount(firestore, user).then((account) => {
          console.debug("Signed in with Google");
          return setSignInContext(account.uid, account);
        });
      }
    }
    // 未ログイン
    console.debug("No credential");
    return setSignInContext();
  });

  const context: AuthContextObject = [
    state,
    {
      signInWithPopup() {
        return signInWithPopup(auth, new GoogleAuthProvider());
      },
      signInAnonymously() {
        return signInAnonymously(auth);
      },
      signOut() {
        return signOut(auth);
      },
      updateDisplayName(displayName: string) {
        if (state.account) {
          return updateAccountDisplayName(firestore, state.account, displayName).then(() => {
            return setState("account", "displayName", displayName);
          });
        }
        return Promise.resolve();
      },
    },
  ];

  return <AuthContext.Provider value={context}>{props.children}</AuthContext.Provider>;
};
