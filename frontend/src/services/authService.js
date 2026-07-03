import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "./firebase";

// ----------------------
// Login
// ----------------------
export const login = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// ----------------------
// Signup
// ----------------------
export const signup = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

// ----------------------
// Logout
// ----------------------
export const logout = async () => {
  return await signOut(auth);
};

// ----------------------
// Google Login
// ----------------------
const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

// ----------------------
// Password Reset
// ----------------------
export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};