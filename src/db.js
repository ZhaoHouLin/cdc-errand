import firebase from 'firebase/app'

import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/database';    // for realtime database
import 'firebase/firestore';   // for cloud firestore
import 'firebase/messaging';   // for cloud messaging
import 'firebase/functions';   // for cloud functions

const firebaseConfig = {
  apiKey: "AIzaSyBRZn3H47fPHowp0Wx9naqJSFKcw84eKlw",
  authDomain: "fifth-legacy-271306.firebaseapp.com",
  projectId: "fifth-legacy-271306",
  storageBucket: "fifth-legacy-271306.appspot.com",
  messagingSenderId: "1004088678198",
  appId: "1:1004088678198:web:f0271595a02fddfc5bc597",
  measurementId: "G-P7HBR1RLGD"
}

firebase
  .initializeApp(firebaseConfig)
  .firestore()
  .settings({ timestampsInSnapshots: true })

export const googleFireStore = firebase.firestore()
export const googleFirebase = firebase