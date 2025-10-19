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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { 
      displayName: displayName,
      photoURL: role, // Using photoURL to store role as a workaround
    });
    
    // Create a user profile document in Firestore
    if (firestore) {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: role,
      });
    }

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
