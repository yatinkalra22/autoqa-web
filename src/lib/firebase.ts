import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type Auth,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: FirebaseApp | undefined
let auth: Auth | undefined

function getFirebaseAuth(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase auth is only available on the client')
  }
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
  }
  if (!auth) {
    auth = getAuth(app)
  }
  return auth
}

const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('profile')
googleProvider.addScope('email')

export async function signInWithGoogle() {
  const result = await signInWithPopup(getFirebaseAuth(), googleProvider)
  return result.user
}

export async function signOut() {
  await firebaseSignOut(getFirebaseAuth())
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback)
}

export async function getIdToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null
  try {
    const a = getFirebaseAuth()
    const user = a.currentUser
    if (!user) return null
    return user.getIdToken()
  } catch {
    return null
  }
}

export type { User }
