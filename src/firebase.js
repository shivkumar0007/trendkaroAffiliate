import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyA2N5S0XAdwrzB79k33MXUGWBrDG4naOd0",
  authDomain: "myaffiliatestore-1d585.firebaseapp.com",
  projectId: "myaffiliatestore-1d585",
  storageBucket: "myaffiliatestore-1d585.firebasestorage.app",
  messagingSenderId: "200253047425",
  appId: "1:200253047425:web:98cfead3f01c5cd8f2c380"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
export default app