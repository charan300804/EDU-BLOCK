'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle, UserPlus, Fingerprint, User, MoreVertical } from "lucide-react";
import { useFirestore, useUser, useCollection } from "@/firebase";
import { collection, serverTimestamp, doc, setDoc, addDoc, query, where, getDocs, writeBatch } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const createStudentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rollNumber: z.string().min(1, "Roll number is required"),
  branch: z.string().min(1, "Branch is required"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
});
type CreateStudentFormValues = z.infer<typeof createStudentSchema>;


const issueCertificateSchema = z.object({
  studentId: z.string().min(1, "Please select a student."),
  title: z.string().min(1, "Certificate title is required."),
  passingYear: z.coerce.number().min(1980, "Invalid year.").max(new Date().getFullYear(), "Year cannot be in the future."),
  passingPercentage: z.coerce.number().min(0, "Percentage cannot be negative.").max(100, "Percentage cannot exceed 100."),
});
type IssueCertificateFormValues = z.infer<typeof issueCertificateSchema>;

export default function PrincipalDashboardPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { auth, signUp, deleteUserAccount } = useAuth();
  const { toast } = useToast();

  const studentsQuery = useMemo(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, "students"), where("principalId", "==", user.uid));
  }, [firestore, user]);

  const { data: students, isLoading: isLoadingStudents, refresh: refreshStudents } = useCollection<any>(studentsQuery);

  const studentForm = useForm<CreateStudentFormValues>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: { name: "", email: "", password: "", rollNumber: "", branch: "", mobileNumber: "" },
  });

  const certificateForm = useForm<IssueCertificateFormValues>({
    resolver: zodResolver(issueCertificateSchema),
    defaultValues: { studentId: "", title: "", passingYear: new Date().getFullYear(), passingPercentage: 75.0 },
  });

  const handleIssueCertificate = async (values: IssueCertificateFormValues) => {
    if (!firestore || !user) return;

    const selectedStudent = students?.find(s => s.id === values.studentId);
    if (!selectedStudent) {
        toast({ title: "Student not found", variant: "destructive" });
        return;
    }

    const certificateData = {
      ...values,
      studentName: selectedStudent.name,
      studentEmail: selectedStudent.email,
      rollNumber: selectedStudent.rollNumber,
      branch: selectedStudent.branch,
      mobileNumber: selectedStudent.mobileNumber,
      principalId: user.uid,
      timestamp: serverTimestamp(),
      hash: "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      blockchainTxId: "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
      status: "pending",
    };
    try {
        await addDoc(collection(firestore, "certificates"), certificateData);
        toast({ title: "Certificate Submitted", description: `Your request to issue "${values.title}" has been sent for admin approval.` });
        certificateForm.reset();
    } catch(error: any) {
        toast({ title: "Error Submitting Certificate", description: error.message, variant: "destructive" });
    }
  };

  const handleCreateStudent = async (values: CreateStudentFormValues) => {
    if (!firestore || !user || !auth) return;
    try {
        const userCredential = await signUp(values.email, values.password, values.name, 'student');
        const studentUser = userCredential.user;

        const studentData = {
            name: values.name,
            email: values.email,
            rollNumber: values.rollNumber,
            branch: values.branch,
            mobileNumber: values.mobileNumber,
            principalId: user.uid,
            status: 'active'
        };

        await setDoc(doc(firestore, "students", studentUser.uid), studentData);

        toast({ title: "Student Account Created", description: `Account for ${values.name} has been created.` });
        studentForm.reset();
    } catch (error: any) {
        toast({ title: "Error Creating Student", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteStudent = async (studentId: string, studentEmail: string) => {
      if(!firestore || !auth) return;
      try {
        // Simplified deletion for demo purposes.
        // In production, this would be a transactional Cloud Function.
        const batch = writeBatch(firestore);

        // 1. Delete student document
        const studentRef = doc(firestore, "students", studentId);
        batch.delete(studentRef);

        // 2. Find and delete certificates for this student
        const certsQuery = query(collection(firestore, "certificates"), where("studentId", "==", studentId));
        const certsSnapshot = await getDocs(certsQuery);
        certsSnapshot.forEach(certDoc => {
          batch.delete(doc(firestore, "certificates", certDoc.id));
        });

        await batch.commit();

        // 3. Delete the auth user (conceptual, requires admin privileges)
        await deleteUserAccount(studentId);

        toast({ title: "Student Deleted", description: "The student and all their certificates have been deleted." });
        refreshStudents(); // Refresh the list
      } catch (error: any) {
        console.error("Student deletion error:", error);
        toast({ title: "Deletion Failed", description: error.message, variant: "destructive" });
      }
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
                                <TableHead>Roll Number</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoadingStudents && <TableRow><TableCell colSpan={5} className="text-center">Loading students...</TableCell></TableRow>}
                            {!isLoadingStudents && students?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No students found.</TableCell></TableRow>}
                            {students?.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>{student.name}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell>{student.rollNumber}</TableCell>
                                    <TableCell>{student.branch}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onSelect={() => handleDeleteStudent(student.id, student.email)} className="text-destructive">Delete Student</DropdownMenuItem>
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
            <Form {...certificateForm}>
              <form onSubmit={certificateForm.handleSubmit(handleIssueCertificate)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><PlusCircle className="h-5 w-5"/> Issue a New Certificate</CardTitle>
                  <CardDescription>Fill in the details to submit a new certificate for admin approval.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={certificateForm.control} name="studentId" render={({ field }) => (
                      <FormItem><FormLabel>Student</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select a student" /></SelectTrigger></FormControl>
                              <SelectContent>
                                  {isLoadingStudents && <SelectItem value="loading" disabled>Loading...</SelectItem>}
                                  {students?.map(student => (
                                      <SelectItem key={student.id} value={student.id}>{student.name} ({student.rollNumber})</SelectItem>
                                  ))}
                              </SelectContent>
                          </Select>
                      <FormMessage /></FormItem>
                  )}/>
                  <FormField control={certificateForm.control} name="title" render={({ field }) => (
                      <FormItem><FormLabel>Certificate Title</FormLabel><FormControl><Input placeholder="e.g., B.Tech Computer Science" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={certificateForm.control} name="passingYear" render={({ field }) => (
                        <FormItem><FormLabel>Passing Year</FormLabel><FormControl><Input type="number" placeholder="e.g., 2024" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={certificateForm.control} name="passingPercentage" render={({ field }) => (
                        <FormItem><FormLabel>Passing Percentage</FormLabel><FormControl><Input type="number" step="0.01" placeholder="e.g., 85.5" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                  </div>
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={certificateForm.formState.isSubmitting}>
                    <Fingerprint className="mr-2 h-4 w-4" />
                    Submit for Approval
                  </Button>
                </CardContent>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="create-student">
          <Card>
            <Form {...studentForm}>
              <form onSubmit={studentForm.handleSubmit(handleCreateStudent)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" />Create a New Student Account</CardTitle>
                  <CardDescription>This will generate login credentials for the student.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField control={studentForm.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Student Full Name</FormLabel><FormControl><Input placeholder="e.g., John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={studentForm.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Student Email</FormLabel><FormControl><Input type="email" placeholder="e.g., john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={studentForm.control} name="password" render={({ field }) => (
                      <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                   <FormField control={studentForm.control} name="rollNumber" render={({ field }) => (
                      <FormItem><FormLabel>Roll Number</FormLabel><FormControl><Input placeholder="e.g., A2K20CS001" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                   <FormField control={studentForm.control} name="branch" render={({ field }) => (
                      <FormItem><FormLabel>Branch (Stream)</FormLabel><FormControl><Input placeholder="e.g., Computer Science" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                   <FormField control={studentForm.control} name="mobileNumber" render={({ field }) => (
                      <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input placeholder="e.g., 9876543210" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <Button type="submit" className="w-full" disabled={studentForm.formState.isSubmitting}>Create Student</Button>
                </CardContent>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
