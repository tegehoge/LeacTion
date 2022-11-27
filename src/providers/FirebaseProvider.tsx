import type { FirebaseApp, FirebaseOptions } from "firebase/app";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { Component, JSX, useContext } from "solid-js";
import { createContext } from "solid-js";

export const FirebaseContext = createContext<FirebaseApp>();

interface Props {
  config: FirebaseOptions;
  children: JSX.Element;
}

export const useFirebaseApp = () => {
  const ctx = useContext(FirebaseContext);

  if (!ctx) throw new Error("useFirebaseApp must be used within a <FirebaseProvider />");

  return ctx;
};

/**
 * オリジナルのFirebaseProviderをベースにエミュレーターにアクセスする分岐を追加したもの
 * @param props
 * @returns
 */
export const FirebaseProvider: Component<Props> = (props) => {
  // eslint-disable-next-line solid/reactivity
  const app = initializeApp(props.config);

  if (import.meta.env.MODE == "emulator") {
    connectAuthEmulator(getAuth(app), "http://localhost:9099");
    connectFirestoreEmulator(getFirestore(app), "localhost", 8080);
  }

  return <FirebaseContext.Provider value={app}>{props.children}</FirebaseContext.Provider>;
};
