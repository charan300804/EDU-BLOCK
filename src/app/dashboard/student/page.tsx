'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, Calendar, User, Award, AlertTriangle, Percent, GraduationCap, Phone } from "lucide-react";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { useMemo } from "react";

const statusConfig = {
    approved: { variant: "default", text: "Approved", icon: <Award className="h-10 w-10 text-primary"/> },
    pending: { variant: "secondary", text: "Pending Approval", icon: <Award className="h-10 w-10 text-muted-foreground"/> },
    rejected: { variant: "destructive", text: "Rejected", icon: <AlertTriangle className="h-10 w-10 text-destructive"/> },
} as const;


export default function StudentDashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const certificatesQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'certificates'), where('studentId', '==', user.uid));
    }, [user, firestore]);

    const { data: certificates, isLoading } = useCollection<any>(certificatesQuery);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Certificates</h1>
        <p className="text-muted-foreground">Here are all the certificates that have been issued to you.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {isLoading && <p>Loading certificates...</p>}
        {certificates && certificates.length === 0 && (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>No Certificates Issued</CardTitle>
                    <CardDescription>You do not have any certificates yet. Once your principal issues one and it's approved, it will appear here.</CardDescription>
                </CardHeader>
            </Card>
        )}
        {certificates && certificates.map((cert) => {
            const config = statusConfig[cert.status as keyof typeof statusConfig] || statusConfig.pending;
            return (
              <Card key={cert.id} className="flex flex-col">
                <CardHeader className="flex-row gap-4 items-start">
                    <div className="flex-shrink-0">
                        {config.icon}
                    </div>
                    <div>
                        <CardTitle className="font-headline text-xl">{cert.title}</CardTitle>
                        <CardDescription>Issued for {cert.branch}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                    <div>
                        <div className="text-sm text-muted-foreground space-y-2">
                            <div className="flex items-center gap-2"><User className="h-4 w-4" /><span>Roll Number: {cert.rollNumber}</span></div>
                            <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /><span>Passing Year: {cert.passingYear}</span></div>
                            <div className="flex items-center gap-2"><Percent className="h-4 w-4" /><span>Percentage: {cert.passingPercentage}%</span></div>
                            <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>Contact: {cert.mobileNumber}</span></div>
                            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>Issued: {cert.timestamp ? new Date(cert.timestamp.seconds * 1000).toLocaleDateString() : 'N/A'}</span></div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground gap-2 mt-4 pt-4 border-t">
                            <Fingerprint className="h-4 w-4" />
                            <span className="font-mono text-xs truncate">Hash: {cert.hash}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 border-t pt-4">
                        <Badge variant={config.variant as any}>{config.text}</Badge>
                    </div>
                </CardContent>
              </Card>
            )
        })}
      </div>
    </div>
  );
}
