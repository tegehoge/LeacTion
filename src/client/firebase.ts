import firebase from "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyApPQv7fGu30oBrRHi-XzlPZ6nejoemTHo",
  appId: "1:254727144997:web:be191479df8739008f61cc",
  authDomain: "leaction.firebaseapp.com",
  databaseURL: "https://leaction.firebaseio.com",
  messagingSenderId: "254727144997",
  projectId: "leaction",
  storageBucket: "leaction.appspot.com",
});

const firestore = firebase.firestore();

// for local emulator
/*
firestore.settings({
  host: "localhost:8080",
  ssl: false,
});
*/

const isProduction = process.env.NODE_ENV === "production";

const mockRef = () => {
  return {
    onSnapshot(f: Function) {
      return;
    },
  };
};

const eventRef = (eventId: string) =>
  isProduction ? firestore.collection("events").doc(eventId) : mockRef();

const commentsRef = (eventId: string) =>
  isProduction ? firestore.collection(`comments-${eventId}`) : mockRef();

export { eventRef, commentsRef };
