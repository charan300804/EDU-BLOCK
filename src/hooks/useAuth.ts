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

// This is a conceptual function.
// Deleting a user requires admin privileges and should be done via a secure backend,
// like a Cloud Function, not directly from the client.
async function deleteUserOnClient(userId: string) {
    console.warn(
      `Attempting to 'delete' user ${userId}. In a real app, this MUST be a secure backend call.`
    );
    // This is a placeholder. Client-side SDK cannot delete other users.
    // We simulate it being successful for the UI flow.
    return Promise.resolve();
}

export function useAuth() {
  const { user, isUserLoading } = useUser();
  const auth = useFirebaseAuth();

  const signUp = async (email: string, password: string, displayName: string, role: Role) => {
    if (!auth) throw new Error("Auth service not available");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const createdUser = userCredential.user;

    await updateProfile(createdUser, { 
      displayName: displayName,
    });
    
    // The calling components (e.g., registration pages) are responsible
    // for creating the user document in the corresponding Firestore collection.

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

  const deleteUserAccount = async (userId: string) => {
      // This is a conceptual function call for the demo.
      // In a real application, you would trigger a Cloud Function here.
      return deleteUserOnClient(userId);
  }

  return {
    user,
    isUserLoading,
    auth,
    signUp,
    signIn,
    signOut,
    deleteUserAccount, // Exposing the conceptual deletion function
  };
}
