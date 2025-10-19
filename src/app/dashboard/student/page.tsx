'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Fingerprint, Calendar, User, Award, Download } from "lucide-react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function StudentDashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const certificatesQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'certificates'), where('studentId', '==', user.uid));
    }, [user, firestore]);

    const { data: certificates, isLoading } = useCollection<any>(certificatesQuery);

    const handleDownload = (certTitle: string) => {
        toast({
            title: "Download Initiated",
            description: `Your certificate "${certTitle}" is being prepared for download.`,
        });
        // In a real app, this would trigger a file download.
        // For example, by generating a PDF on the fly or linking to a stored file.
    }

    const handleShowQR = (id: string) => {
        toast({
            title: "Certificate QR Code",
            description: `Share this ID to allow verification: ${id}`,
        });
    }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Certificates</h1>
        <p className="text-muted-foreground">Here are all the certificates that have been issued to you.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {isLoading && <p>Loading certificates...</p>}
        {certificates && certificates.length === 0 && <p>No certificates issued yet.</p>}
        {certificates && certificates.map((cert) => (
          <Card key={cert.id} className="flex flex-col">
            <CardHeader className="flex-row gap-4 items-start">
                <div className="flex-shrink-0">
                    <Award className="h-10 w-10 text-primary"/>
                </div>
                <div>
                    <CardTitle className="font-headline text-xl">{cert.title}</CardTitle>
                    <CardDescription>Issued by Principal ID: {cert.principalId.substring(0, 8)}...</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                <div>
                    <div className="flex items-center text-sm text-muted-foreground gap-2 mb-1">
                        <User className="h-4 w-4" />
                        <span>Student ID: {cert.studentId.substring(0,8)}...</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Issued on: {cert.timestamp ? new Date(cert.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-2 mt-2">
                        <Fingerprint className="h-4 w-4" />
                        <span className="font-mono text-xs truncate">Hash: {cert.hash}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4 border-t pt-4">
                    <Badge variant="default">Verified</Badge>
                    <div className="flex gap-2">
                         <Button variant="ghost" size="icon" onClick={() => handleDownload(cert.title)}>
                            <Download className="h-6 w-6 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleShowQR(cert.id)}>
                            <QrCode className="h-6 w-6 text-muted-foreground" />
                        </Button>
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
