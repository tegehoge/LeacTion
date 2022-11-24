import { getAuth, GoogleAuthProvider, User } from "firebase/auth";
import { useAuth } from "solid-firebase";
import { Component, createContext, JSX, useContext } from "solid-js";
import { useFirebaseApp } from "./FirebaseProvider";

export type AuthState = {
  loading: boolean;
  data: User | null;
  error: Error | null;
};

export const useAuthState = (): AuthState => useAuth(getAuth(useFirebaseApp()));

export const signedInWithGoogleProvider = (authState: AuthState): boolean => {
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
