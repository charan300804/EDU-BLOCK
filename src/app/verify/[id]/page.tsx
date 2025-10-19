import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle, Fingerprint } from "lucide-react";
import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { Button } from "@/components/ui/button";

// Mock verification function
const verifyCertificate = async (id: string) => {
  if (id === "valid-cert-123") {
    return {
      status: "Valid",
      data: {
        title: "B.Tech CSE",
        studentName: "Alice Johnson",
        issuedBy: "Dr. Evelyn Reed",
        timestamp: "2023-05-20T10:00:00Z",
        hash: "0xabc123...",
      },
    };
  }
  if (id === "tampered-cert-456") {
    return { status: "Tampered", data: null };
  }
  return { status: "Not Found", data: null };
};

const statusConfig = {
    Valid: {
        icon: <CheckCircle className="h-16 w-16 text-green-500" />,
        title: "Certificate is Valid",
        description: "The certificate's integrity has been verified on the blockchain.",
        variant: "default",
        badgeText: "Verified"
    },
    Tampered: {
        icon: <AlertTriangle className="h-16 w-16 text-yellow-500" />,
        title: "Certificate Tampered",
        description: "The certificate's data does not match its blockchain record. It may have been altered.",
        variant: "destructive",
        badgeText: "Tampered"
    },
    "Not Found": {
        icon: <XCircle className="h-16 w-16 text-red-500" />,
        title: "Certificate Not Found",
        description: "No certificate with this ID could be found in our records.",
        variant: "destructive",
        badgeText: "Not Found"
    }
} as const;


export default async function VerificationPage({ params }: { params: { id: string } }) {
  const result = await verifyCertificate(params.id);
  const config = statusConfig[result.status];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-8 flex items-center justify-center gap-4">
            <Link href="/" className="flex items-center gap-2">
                <Logo className="h-8 w-8 text-primary" />
                <span className="font-headline text-2xl font-bold text-foreground">EduChain</span>
            </Link>
        </div>
      <Card className="w-full max-w-lg text-center shadow-2xl">
        <CardHeader>
            <div className="flex justify-center mb-4">{config.icon}</div>
          <CardTitle className="font-headline text-3xl">{config.title}</CardTitle>
          <p className="text-muted-foreground">{config.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex justify-center">
                <Badge variant={config.variant as any} className="text-sm">{config.badgeText}</Badge>
            </div>

          {result.status === "Valid" && result.data && (
            <div className="text-left p-4 border rounded-lg bg-muted/50 space-y-2">
              <p><strong>Certificate Title:</strong> {result.data.title}</p>
              <p><strong>Student:</strong> {result.data.studentName}</p>
              <p><strong>Issued By:</strong> {result.data.issuedBy}</p>
              <p><strong>Issued On:</strong> {new Date(result.data.timestamp).toLocaleDateString()}</p>
              <p className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-muted-foreground" />
                <strong>Blockchain Hash:</strong> 
                <span className="truncate font-mono text-sm">{result.data.hash}</span>
              </p>
            </div>
          )}

          <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/dashboard/employer">Verify Another Certificate</Link>
          </Button>

        </CardContent>
      </Card>
    </main>
  );
}
