'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle, UserPlus, Fingerprint } from "lucide-react";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";

export default function PrincipalDashboardPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { auth } = useAuth();
  const { toast } = useToast();

  const [studentId, setStudentId] = useState('');
  const [certTitle, setCertTitle] = useState('');

  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');


  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || !studentId || !certTitle) {
      toast({ title: "Missing Information", description: "Please fill out all fields.", variant: "destructive" });
      return;
    }
    const certificateData = {
      title: certTitle,
      studentId: studentId,
      principalId: user.uid,
      timestamp: serverTimestamp(),
      hash: "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      blockchainTxId: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
    };
    await addDoc(collection(firestore, "certificates"), certificateData);
    toast({ title: "Certificate Issued", description: `Certificate "${certTitle}" issued to student ${studentId}.` });
    setStudentId('');
    setCertTitle('');
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || !studentName || !studentEmail || !studentPassword || !auth) {
      toast({ title: "Missing Information", description: "Please fill out all fields.", variant: "destructive" });
      return;
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, studentEmail, studentPassword);
        const studentUser = userCredential.user;

        const studentData = {
            name: studentName,
            email: studentEmail,
            principalId: user.uid
        };

        await setDocumentNonBlocking(doc(firestore, "students", studentUser.uid), studentData, { merge: true });

        toast({ title: "Student Account Created", description: `Account for ${studentName} has been created.` });
        setStudentName('');
        setStudentEmail('');
        setStudentPassword('');
    } catch (error: any) {
        toast({ title: "Error Creating Student", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Principal Dashboard</h1>
        <p className="text-muted-foreground">Manage students and issue certificates for your institution.</p>
      </div>

      <Tabs defaultValue="issue-cert" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="issue-cert">Issue Certificate</TabsTrigger>
          <TabsTrigger value="create-student">Create Student</TabsTrigger>
        </TabsList>
        <TabsContent value="issue-cert">
          <Card>
            <form onSubmit={handleIssueCertificate}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PlusCircle className="h-5 w-5"/> Issue a New Certificate</CardTitle>
                <CardDescription>Fill in the details to issue a new certificate to a student.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-id">Student ID</Label>
                  <Input id="student-id" placeholder="Enter student's user ID" value={studentId} onChange={e => setStudentId(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cert-title">Certificate Title</Label>
                  <Input id="cert-title" placeholder="e.g., B.Tech Computer Science" value={certTitle} onChange={e => setCertTitle(e.target.value)} />
                </div>
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Generate Hash & Issue Certificate
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
                <Button type="submit" className="w-full">Create Student</Button>
              </CardContent>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
