import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Fingerprint, Calendar, User, Award } from "lucide-react";
import { CareerAdvisor } from "@/components/career-advisor";

const certificates = [
  {
    id: "cert-1",
    title: "B.Tech Computer Science",
    issuedBy: "Dr. Evelyn Reed",
    timestamp: "2023-05-20T10:00:00Z",
    hash: "0xabf34...",
    studentId: "STU-001"
  },
  {
    id: "cert-2",
    title: "Advanced Blockchain Development",
    issuedBy: "Dr. Evelyn Reed",
    timestamp: "2023-06-15T14:30:00Z",
    hash: "0xcdf56...",
    studentId: "STU-001"
  }
];

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Certificates</h1>
        <p className="text-muted-foreground">Here are all the certificates that have been issued to you.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {certificates.map((cert) => (
          <Card key={cert.id} className="flex flex-col">
            <CardHeader className="flex-row gap-4 items-start">
                <div className="flex-shrink-0">
                    <Award className="h-10 w-10 text-primary"/>
                </div>
                <div>
                    <CardTitle className="font-headline text-xl">{cert.title}</CardTitle>
                    <CardDescription>Issued by {cert.issuedBy}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                <div>
                    <div className="flex items-center text-sm text-muted-foreground gap-2 mb-1">
                        <User className="h-4 w-4" />
                        <span>Student ID: {cert.studentId}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Issued on: {new Date(cert.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground gap-2 mt-2">
                        <Fingerprint className="h-4 w-4" />
                        <span className="font-mono text-xs">Hash: {cert.hash}</span>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4 border-t pt-4">
                    <Badge variant="default">Verified</Badge>
                    <div className="p-2 border rounded-lg bg-background cursor-pointer hover:bg-muted">
                        <QrCode className="h-6 w-6 text-muted-foreground" />
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CareerAdvisor certificates={certificates.map(c => c.title)} />
    </div>
  );
}
