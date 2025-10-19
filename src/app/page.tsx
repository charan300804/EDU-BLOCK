
'use client';
import { LoginTabs } from "@/components/login-tabs";
import { Logo } from "@/components/icons/logo";
import { useUser, useFirestore } from "@/firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    if (isUserLoading || !firestore) {
      return;
    }

    if (!user) {
      setIsRoleLoading(false);
      return;
    }

    const getRoleAndRedirect = async () => {
      let userRole: Role = 'student'; // Default role
      try {
        // Check admins collection
        let userDoc = await getDoc(doc(firestore, "admins", user.uid));
        if (userDoc.exists()) {
          userRole = 'admin';
        } else {
          // Check principals collection
          userDoc = await getDoc(doc(firestore, "principals", user.uid));
          if (userDoc.exists()) {
            userRole = 'principal';
          } else {
            // Check employers collection
            userDoc = await getDoc(doc(firestore, "employers", user.uid));
            if (userDoc.exists()) {
              userRole = 'employer';
            } else {
              // Check students collection last
              userDoc = await getDoc(doc(firestore, "students", user.uid));
              if (userDoc.exists()) {
                userRole = 'student';
              }
            }
          }
        }
        router.push(`/dashboard`);
      } catch (error) {
        console.error("Error fetching user role, defaulting to student.", error);
        router.push('/dashboard/student');
      }
    };
    
    getRoleAndRedirect();

  }, [user, isUserLoading, router, firestore]);

  if (isUserLoading || user || isRoleLoading) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <Logo className="h-12 w-12 text-primary animate-pulse" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <Logo className="h-12 w-12 text-primary" />
            <div className="text-center">
                <h1 className="font-headline text-3xl font-bold text-foreground">EduBlock</h1>
                <p className="text-muted-foreground">Secure Certificate Verification on the Blockchain</p>
            </div>
        </div>
        <LoginTabs />
      </div>
    </main>
  );
}
