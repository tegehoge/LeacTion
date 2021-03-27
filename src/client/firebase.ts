import firebase from "firebase/app";
import "firebase/firestore";

function createFirestore() {
  // @ts-ignore
  const isProduction = import.meta.env.PROD;
  
  if (!isProduction) {
    return null;
  }

  // @ts-ignore
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

  firebase.initializeApp(firebaseConfig);
  const firestore = firebase.firestore();
  // @ts-ignore
  if (import.meta.env.MODE == "emulator") {
    firestore.useEmulator("localhost", 8080);
  }
  return firestore;
}

const firestore = createFirestore();

export { firestore };
