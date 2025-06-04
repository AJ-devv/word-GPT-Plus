// src/firebase.ts
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCT3zYCQ-1zJntLk89u_Hn14cgyJE0sQdw",
  authDomain: "lawwordaddin1.firebaseapp.com",
  projectId: "lawwordaddin1",
  storageBucket: "lawwordaddin1.appspot.com",
  messagingSenderId: "129850337921",
  appId: "1:129850337921:web:4663fe459e29804cec3b80"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
