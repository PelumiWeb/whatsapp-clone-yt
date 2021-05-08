import firebase from 'firebase'
const firebaseConfig = {
  apiKey: "AIzaSyBxHuBEP4X9Y_Q8cr8HPPvq9SNv7OMdQpI",
  authDomain: "whatsap-clone-yt.firebaseapp.com",
  projectId: "whatsap-clone-yt",
  storageBucket: "whatsap-clone-yt.appspot.com",
  messagingSenderId: "640852447142",
  appId: "1:640852447142:web:e77e73296537ea7be10967",
  measurementId: "G-00TWEGQT8S"
};
  const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

const db = app.firestore()
const auth = app.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export {auth, db, provider}