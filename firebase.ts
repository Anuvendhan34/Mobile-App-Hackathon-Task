// firebase.ts
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCfaQoQnhTxY1nO51CtcMArMVqCVyllmQU",
  authDomain: "mobile-todo-app-237c2.firebaseapp.com",
  projectId: "mobile-todo-app-237c2",
  storageBucket: "mobile-todo-app-237c2.appspot.com",
  messagingSenderId: "292601260400",
  appId: "1:292601260400:web:4072a52343b68bd9d007b5", // ⬅️ You still need to get this from Firebase Console → Project Settings → General
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
