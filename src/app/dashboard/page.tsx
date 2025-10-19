'use client';

import { useUser, useFirestore } from "@/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";
import { doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function DashboardRedirectPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait until both user and firestore are available.
    if (isUserLoading || !firestore) {
      return;
    }

    // If there is no user, they should not be on a dashboard page.
    if (!user) {
      router.replace('/');
      return;
    }

    const getRoleAndRedirect = async () => {
      const collections: Role[] = ['admin', 'principal', 'employer', 'student'];
      let userRole: Role | null = null;
      
      try {
        // Check collections in order of privilege to find user's role
        for (const role of collections) {
          const userDoc = await getDoc(doc(firestore, `${role}s`, user.uid));
          if (userDoc.exists()) {
            userRole = role;
            break; // Found the role, no need to check further
          }
        }
        
        if (userRole) {
          router.replace(`/dashboard/${userRole}`);
        } else {
          // If role is not found in any collection, it's an anomaly.
          // Log the issue and redirect to login. A real app might have more robust error handling here.
          console.error("User role not found in any collection. UID:", user.uid);
          router.replace('/'); 
        }
      } catch (error) {
        console.error("Error fetching user role, redirecting to login.", error);
        router.replace('/');
      }
    };
    
    getRoleAndRedirect();

  }, [user, isUserLoading, router, firestore]);

  // Display a loading spinner while the redirect is in progress.
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background p-4">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="mt-4 text-muted-foreground">Loading Your Dashboard...</p>
    </div>
  );
}
