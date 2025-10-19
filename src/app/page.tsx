import { LoginTabs } from "@/components/login-tabs";
import { Logo } from "@/components/icons/logo";

export default function LoginPage() {
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
