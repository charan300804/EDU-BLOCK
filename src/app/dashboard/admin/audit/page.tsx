import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield } from "lucide-react";

const auditLogs = [
  { id: 1, timestamp: "2023-10-27 10:00 AM", user: "admin@educhain.com", action: "REVOKE_ACCESS", details: "Revoked access for principal 'principal@school.edu'" },
  { id: 2, timestamp: "2023-10-27 09:45 AM", user: "principal@school.edu", action: "ISSUE_CERTIFICATE", details: "Issued 'B.Tech CSE' to student 'student1@university.com'" },
  { id: 3, timestamp: "2023-10-26 03:20 PM", user: "employer@company.com", action: "VERIFY_CERTIFICATE", details: "Verified certificate ID 'c1e2r3t4'" },
  { id: 4, timestamp: "2023-10-26 01:10 PM", user: "admin@educhain.com", action: "CREATE_PRINCIPAL", details: "Created principal 'new.principal@innovate.edu'" },
  { id: 5, timestamp: "2023-10-25 11:05 AM", user: "principal@school.edu", action: "CREATE_STUDENT", details: "Created student 'new.student@university.com'" },
];

export default function AuditLogPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Audit Logs</h1>
        <p className="text-muted-foreground">Review a log of all important actions taken within the system.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5"/>System Actions</CardTitle>
          <CardDescription>This is a read-only log for security and compliance purposes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
