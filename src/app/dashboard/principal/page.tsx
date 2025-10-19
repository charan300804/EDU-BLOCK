'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle, UserPlus, Fingerprint, User, MoreVertical } from "lucide-react";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, serverTimestamp, doc, setDoc, addDoc, query } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function PrincipalDashboardPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { auth, signUp } = useAuth();
  const { toast } = useToast();

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [certTitle, setCertTitle] = useState('');

  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  const studentsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, "students"));
    // In a multi-principal system, you'd filter by principalId:
    // return query(collection(firestore, "students"), where("principalId", "==", user.uid));
  }, [firestore, user]);

  const { data: students, isLoading: isLoadingStudents } = useCollection<any>(studentsQuery);

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || !selectedStudentId || !certTitle) {
      toast({ title: "Missing Information", description: "Please select a student and enter a certificate title.", variant: "destructive" });
      return;
    }
    const certificateData = {
      title: certTitle,
      studentId: selectedStudentId,
      principalId: user.uid,
      timestamp: serverTimestamp(),
      hash: "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      blockchainTxId: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      status: "pending", // Default status
    };
    try {
        await addDoc(collection(firestore, "certificates"), certificateData);
        toast({ title: "Certificate Submitted", description: `Your request to issue "${certTitle}" has been sent for admin approval.` });
        setSelectedStudentId('');
        setCertTitle('');
    } catch(error: any) {
        toast({ title: "Error Submitting Certificate", description: error.message, variant: "destructive" });
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || !studentName || !studentEmail || !studentPassword || !auth) {
      toast({ title: "Missing Information", description: "Please fill out all fields.", variant: "destructive" });
      return;
    }
    try {
        const userCredential = await signUp(studentEmail, studentPassword, studentName, 'student');
        const studentUser = userCredential.user;

        const studentData = {
            name: studentName,
            email: studentEmail,
            principalId: user.uid,
            status: 'active'
        };

        await setDoc(doc(firestore, "students", studentUser.uid), studentData);

        toast({ title: "Student Account Created", description: `Account for ${studentName} has been created.` });
        setStudentName('');
        setStudentEmail('');
        setStudentPassword('');
    } catch (error: any) {
        toast({ title: "Error Creating Student", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteStudent = (studentId: string) => {
      if(!firestore) return;
      deleteDocumentNonBlocking(doc(firestore, "students", studentId));
      toast({ title: "Student Deleted", description: "The student account has been deleted." });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Principal Dashboard</h1>
        <p className="text-muted-foreground">Manage students and issue certificates for your institution.</p>
      </div>

      <Tabs defaultValue="manage-students" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage-students">Manage Students</TabsTrigger>
          <TabsTrigger value="issue-cert">Issue Certificate</TabsTrigger>
          <TabsTrigger value="create-student">Create Student</TabsTrigger>
        </TabsList>

        <TabsContent value="manage-students">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="h-5 w-5"/> Student Roster</CardTitle>
                    <CardDescription>View and manage all students enrolled under your institution.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingStudents && <TableRow><TableCell colSpan={3} className="text-center">Loading students...</TableCell></TableRow>}
                            {!isLoadingStudents && students?.length === 0 && <TableRow><TableCell colSpan={3} className="text-center">No students found.</TableCell></TableRow>}
                            {students?.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onSelect={() => handleDeleteStudent(student.id)} className="text-destructive">Delete Student</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="issue-cert">
          <Card>
            <form onSubmit={handleIssueCertificate}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PlusCircle className="h-5 w-5"/> Issue a New Certificate</CardTitle>
                <CardDescription>Fill in the details to submit a new certificate for admin approval.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="student-select">Student</Label>
                    <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                        <SelectTrigger id="student-select">
                            <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                        <SelectContent>
                            {isLoadingStudents && <SelectItem value="loading" disabled>Loading...</SelectItem>}
                            {students?.map(student => (
                                <SelectItem key={student.id} value={student.id}>{student.name} ({student.email})</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-title">Certificate Title</Label>
                  <Input id="cert-title" placeholder="e.g., B.Tech Computer Science" value={certTitle} onChange={e => setCertTitle(e.target.value)} />
                </div>
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={!selectedStudentId || !certTitle}>
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Submit for Approval
                </Button>
              </CardContent>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="create-student">
          <Card>
            <form onSubmit={handleCreateStudent}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" />Create a New Student Account</CardTitle>
                <CardDescription>This will generate login credentials for the student.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-name">Student Full Name</Label>
                  <Input id="student-name" placeholder="e.g., John Doe" value={studentName} onChange={e => setStudentName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-email">Student Email</Label>
                  <Input id="student-email" type="email" placeholder="e.g., john.doe@example.com" value={studentEmail} onChange={e => setStudentEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <Input id="student-password" type="password" placeholder="••••••••" value={studentPassword} onChange={e => setStudentPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={!studentName || !studentEmail || !studentPassword}>Create Student</Button>
              </CardContent>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
