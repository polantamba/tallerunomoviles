import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBNWGplkcPiFJk_opakAprO7zryCzNOPPI",
  authDomain: "tallerunomoviles.firebaseapp.com",
  databaseURL: "https://tallerunomoviles-default-rtdb.firebaseio.com",
  projectId: "tallerunomoviles",
  storageBucket: "tallerunomoviles.firebasestorage.app",
  messagingSenderId: "412096318476",
  appId: "1:412096318476:web:461f0056814e1127a2b229"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getDatabase(app);

export let usuarioActual: any = null;

export const setUsuarioActual = (user: any) => {
    usuarioActual = user;
};