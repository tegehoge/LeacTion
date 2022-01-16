import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

function createFirestore() {
  const isProduction = import.meta.env.PROD;

  if (!isProduction) {
    return null;
  }

  const env = import.meta.env;

  const firebaseConfig = {
    apiKey: env.VITE_API_KEY || "",
    appId: env.VITE_APP_ID,
    authDomain: env.VITE_AUTH_DOMAIN || "",
    databaseURL: env.VITE_DATABASE_URL,
    messagingSenderId: env.VITE_MESSAGING_SENDER_ID,
    projectId: env.VITE_PROJECT_ID || "leaction",
    storageBucket: env.VITE_STORAGE_BUCKET,
    measurementId: env.VITE_MEASUREMENT_ID || "",
  };

  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);
  if (import.meta.env.MODE == "emulator") {
    connectFirestoreEmulator(firestore, "localhost", 8080);
  }
  return firestore;
}

const firestore = createFirestore();

export { firestore, createFirestore };
