/* @refresh reload */
import { render } from "solid-js/web";

import App from "./App";
import { AuthProvider } from "./firebase/AuthProvider";
import { FirebaseProvider } from "~/firebase/FirebaseProvider";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || "",
  appId: import.meta.env.VITE_APP_ID,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || "",
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  projectId: import.meta.env.VITE_PROJECT_ID || "leaction",
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID || "",
};

render(
  () => (
    <FirebaseProvider config={firebaseConfig}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </FirebaseProvider>
  ),
  document.getElementById("root") as HTMLElement
);
