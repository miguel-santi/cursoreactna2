import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD4kAvrkvQiTulroySZIh129-mntxg4XvI",
  authDomain: "tenedores-def31.firebaseapp.com",
  databaseURL: "https://tenedores-def31.firebaseio.com",
  projectId: "tenedores-def31",
  storageBucket: "tenedores-def31.appspot.com",
  messagingSenderId: "995491529033",
  appId: "1:995491529033:web:df22daad1ab84e1cc5da98"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
