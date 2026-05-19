import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId)

let auth = null
let db = null

if (firebaseEnabled) {
  const app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const LOCAL_USER_KEY = 'mmm_user'
const LOCAL_DATA_KEY = 'mmm_user_data'

function readLocalUser() {
  try { return JSON.parse(localStorage.getItem(LOCAL_USER_KEY)) } catch { return null }
}
function writeLocalUser(user) { localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user)) }
function readLocalData(uid) {
  try {
    const all = JSON.parse(localStorage.getItem(LOCAL_DATA_KEY)) || {}
    return all[uid] || { favorites: [], history: [], bookings: [], profile: {} }
  } catch { return { favorites: [], history: [], bookings: [], profile: {} } }
}
function writeLocalData(uid, data) {
  const all = JSON.parse(localStorage.getItem(LOCAL_DATA_KEY) || '{}')
  all[uid] = data
  localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(all))
}

export function subscribeToUser(callback) {
  if (firebaseEnabled) {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) return callback(null)
      callback({ uid: user.uid, name: user.displayName || 'Мандрівник', email: user.email, provider: 'firebase' })
    })
  }
  callback(readLocalUser())
  return () => {}
}

export async function registerUser({ name, email, password }) {
  if (firebaseEnabled) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: name })
    await setDoc(doc(db, 'users', cred.user.uid), {
      name, email, favorites: [], history: [], bookings: [], createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    })
    return { uid: cred.user.uid, name, email, provider: 'firebase' }
  }
  await sleep(450)
  const user = { uid: `local-${Date.now()}`, name, email, provider: 'demo-local' }
  writeLocalUser(user)
  writeLocalData(user.uid, { favorites: [], history: [], bookings: [], profile: { name, email } })
  return user
}

export async function loginUser({ email, password }) {
  if (firebaseEnabled) {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return { uid: cred.user.uid, name: cred.user.displayName || 'Мандрівник', email: cred.user.email, provider: 'firebase' }
  }
  await sleep(350)
  const user = { uid: 'demo-user', name: email?.split('@')[0] || 'Марія', email: email || 'demo@mapmymood.app', provider: 'demo-local' }
  writeLocalUser(user)
  if (!readLocalData(user.uid)) writeLocalData(user.uid, { favorites: [], history: [], bookings: [], profile: {} })
  return user
}

export async function logoutUser() {
  if (firebaseEnabled) return signOut(auth)
  localStorage.removeItem(LOCAL_USER_KEY)
}

export async function loadUserData(user) {
  if (!user) return { favorites: [], history: [], bookings: [], profile: {} }
  if (firebaseEnabled) {
    const ref = doc(db, 'users', user.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, { name: user.name, email: user.email, favorites: [], history: [], bookings: [], createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
      return { favorites: [], history: [], bookings: [], profile: { name: user.name, email: user.email } }
    }
    return snap.data()
  }
  return readLocalData(user.uid)
}

export async function saveFavorite(user, tripId, shouldSave) {
  if (!user) return
  if (firebaseEnabled) {
    const ref = doc(db, 'users', user.uid)
    await updateDoc(ref, { favorites: shouldSave ? arrayUnion(tripId) : arrayRemove(tripId), updatedAt: serverTimestamp() })
    return
  }
  const data = readLocalData(user.uid)
  data.favorites = shouldSave ? [...new Set([...(data.favorites || []), tripId])] : (data.favorites || []).filter((id) => id !== tripId)
  writeLocalData(user.uid, data)
}

export async function saveHistory(user, item) {
  if (!user) return
  const entry = { ...item, at: new Date().toISOString() }
  if (firebaseEnabled) {
    await updateDoc(doc(db, 'users', user.uid), { history: arrayUnion(entry), updatedAt: serverTimestamp() })
    return
  }
  const data = readLocalData(user.uid)
  data.history = [entry, ...(data.history || [])].slice(0, 20)
  writeLocalData(user.uid, data)
}

export async function saveBooking(user, booking) {
  if (!user) return
  const entry = { id: `booking-${Date.now()}`, ...booking, status: 'draft', createdAt: new Date().toISOString() }
  if (firebaseEnabled) {
    await updateDoc(doc(db, 'users', user.uid), { bookings: arrayUnion(entry), updatedAt: serverTimestamp() })
    return entry
  }
  const data = readLocalData(user.uid)
  data.bookings = [entry, ...(data.bookings || [])]
  writeLocalData(user.uid, data)
  return entry
}
