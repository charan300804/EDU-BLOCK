'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { useUser, useAuth as useFirebaseAuth } from '@/firebase/provider';
import { Role } from '@/lib/types';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export function useAuth() {
  const { user, isUserLoading } = useUser();
  const auth = useFirebaseAuth();
  const firestore = useFirestore();

  const signUp = async (email: string, password: string, displayName: string, role: Role) => {
    if (!auth) throw new Error("Auth service not available");
    // This creates the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const createdUser = userCredential.user;

    // This adds the displayName to the Firebase Auth user profile
    await updateProfile(createdUser, { 
      displayName: displayName,
    });
    
    // This part does not create a document in a `users` collection.
    // The registration page and dashboard pages handle creating documents
    // in the specific role collections (`employers`, `principals`, etc.).

    return userCredential;
  };

  const signIn = (email: string, password: string) => {
    if (!auth) throw new Error("Auth service not available");
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = () => {
    if (!auth) throw new Error("Auth service not available");
    return firebaseSignOut(auth);
  };

  return {
    user,
    isUserLoading,
    auth,
    signUp,
    signIn,
    signOut,
  };
}
