'use client';
import { LoginTabs } from "@/components/login-tabs";
import { Logo } from "@/components/icons/logo";
import { useUser } from "@/firebase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/types";

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
        // This is a simplified role detection.
        // In a real app, you'd get the role from custom claims or Firestore.
        let role: Role = 'student'; // Default role
        if (user.email?.includes('admin')) {
            role = 'admin';
        } else if (user.email?.includes('principal')) {
            role = 'principal';
        } else if (user.photoURL === 'employer') { // using photoURL as a hack for role
            role = 'employer';
        }
        router.push(`/dashboard/${role}`);
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
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
                <h1 className="font-headline text-3xl font-bold text-foreground">EduChain</h1>
                <p className="text-muted-foreground">Secure Certificate Verification on the Blockchain</p>
            </div>
        </div>
        <LoginTabs />
      </div>
    </main>
  );
}
