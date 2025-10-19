'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle, Fingerprint, Loader2 } from "lucide-react";
import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { Button } from "@/components/ui/button";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { useMemo } from "react";

const statusConfig = {
    approved: {
        icon: <CheckCircle className="h-16 w-16 text-green-500" />,
        title: "Certificate is Valid",
        description: "The certificate's integrity has been verified.",
        variant: "default",
        badgeText: "Verified & Approved"
    },
    pending: {
        icon: <AlertTriangle className="h-16 w-16 text-yellow-500" />,
        title: "Verification Pending",
        description: "This certificate has been issued but is awaiting admin approval.",
        variant: "secondary",
        badgeText: "Pending Approval"
    },
    rejected: {
        icon: <XCircle className="h-16 w-16 text-red-500" />,
        title: "Certificate Rejected",
        description: "This certificate was rejected by an administrator and is not valid.",
        variant: "destructive",
        badgeText: "Rejected"
    },
    "Not Found": {
        icon: <XCircle className="h-16 w-16 text-red-500" />,
        title: "Certificate Not Found",
        description: "No certificate with this ID could be found in our records.",
        variant: "destructive",
        badgeText: "Not Found"
    }
} as const;


export default function VerificationPage({ params }: { params: { id: string } }) {
  const firestore = useFirestore();
  
  const certRef = useMemo(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, "certificates", params.id);
  }, [firestore, params.id]);

  const { data: certificate, isLoading } = useDoc<any>(certRef);

  const getStatus = () => {
    if (isLoading) return null;
    if (certificate) {
        // Return the certificate's actual status
        return certificate.status;
    }
    return "Not Found";
  }

  const status = getStatus();
  const config = status ? statusConfig[status as keyof typeof statusConfig] : null;

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
            <div className="flex justify-center mb-4">
                {isLoading && <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />}
                {config && config.icon}
            </div>
          <CardTitle className="font-headline text-3xl">{isLoading ? 'Verifying...' : config?.title}</CardTitle>
          <p className="text-muted-foreground">{!isLoading && config?.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
            {config && <div className="flex justify-center">
                <Badge variant={config.variant as any} className="text-sm">{config.badgeText}</Badge>
            </div>}

          {status === "approved" && certificate && (
            <div className="text-left p-4 border rounded-lg bg-muted/50 space-y-2">
              <p><strong>Certificate Title:</strong> {certificate.title}</p>
              <p><strong>Student ID:</strong> {certificate.studentId}</p>
              <p><strong>Issued By Principal ID:</strong> {certificate.principalId}</p>
              <p><strong>Issued On:</strong> {certificate.timestamp ? new Date(certificate.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
              <p className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-muted-foreground" />
                <strong>Blockchain Hash:</strong> 
                <span className="truncate font-mono text-sm">{certificate.hash}</span>
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
