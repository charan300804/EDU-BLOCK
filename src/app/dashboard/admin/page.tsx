'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, doc, where, getDocs, writeBatch } from "firebase/firestore";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { updateDocumentNonBlocking, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const principalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  schoolName: z.string().min(1, "School name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type PrincipalFormValues = z.infer<typeof principalSchema>;

export default function AdminDashboardPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { auth, signUp, deleteUserAccount } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const principalsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, "principals"));
    }, [firestore]);

    const pendingCertificatesQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, "certificates"), where("status", "==", "pending"));
    }, [firestore]);

    const { data: principals, isLoading: isLoadingPrincipals } = useCollection<any>(principalsQuery);
    const { data: pendingCertificates, isLoading: isLoadingCertificates } = useCollection<any>(pendingCertificatesQuery);

    const form = useForm<PrincipalFormValues>({
        resolver: zodResolver(principalSchema),
        defaultValues: { name: "", email: "", schoolName: "", password: "" },
    });

    async function onSubmit(values: PrincipalFormValues) {
        if(!auth || !firestore) return;
        try {
            const userCredential = await signUp(values.email, values.password, values.name, "principal");

            if (userCredential?.user) {
                const principalData = {
                    name: values.name,
                    email: values.email,
                    schoolName: values.schoolName,
                    status: "Active"
                };
                const principalRef = doc(firestore, "principals", userCredential.user.uid);
                setDocumentNonBlocking(principalRef, principalData, { merge: false });
                
                toast({ title: "Principal Created", description: `Account for ${values.name} has been created.` });
                form.reset();
                setIsDialogOpen(false);
            }
        } catch (error: any) {
            toast({ title: "Creation Failed", description: error.message, variant: "destructive" });
        }
    }

    const handleRevoke = (principalId: string) => {
        if(!firestore) return;
        const principalRef = doc(firestore, 'principals', principalId);
        updateDocumentNonBlocking(principalRef, { status: "Inactive" });
        toast({ title: "Access Revoked", description: "Principal's access has been revoked." });
    }
    
    const handleReinstate = (principalId: string) => {
        if(!firestore) return;
        const principalRef = doc(firestore, 'principals', principalId);
        updateDocumentNonBlocking(principalRef, { status: "Active" });
        toast({ title: "Access Reinstated", description: "Principal's access has been reinstated." });
    }

    const handleDeletePrincipal = async (principalId: string) => {
        if (!firestore || !auth) {
            toast({ title: "Error", description: "System not ready. Please try again.", variant: "destructive" });
            return;
        }
        
        try {
            // Non-blocking UI update, with async operations in background
            deleteDocumentNonBlocking(doc(firestore, "principals", principalId));
            
            const studentsQuery = query(collection(firestore, "students"), where("principalId", "==", principalId));
            const studentsSnapshot = await getDocs(studentsQuery);
            studentsSnapshot.forEach(studentDoc => {
                deleteDocumentNonBlocking(doc(firestore, "students", studentDoc.id));
            });

            const certsQuery = query(collection(firestore, "certificates"), where("principalId", "==", principalId));
            const certsSnapshot = await getDocs(certsQuery);
            certsSnapshot.forEach(certDoc => {
                deleteDocumentNonBlocking(doc(firestore, "certificates", certDoc.id));
            });

            await deleteUserAccount(principalId);
            
            toast({ title: "Principal Deletion Initiated", description: "The principal and their data will be removed shortly." });
            
        } catch (error: any) {
            console.error("Deletion failed:", error);
            toast({ title: "Deletion Failed", description: error.message, variant: "destructive" });
        }
    };

    const handleApproveCertificate = (certificateId: string) => {
        if(!firestore) return;
        const certRef = doc(firestore, 'certificates', certificateId);
        updateDocumentNonBlocking(certRef, { status: "approved" });
        toast({ title: "Certificate Approved", description: "The certificate is now valid." });
    }

    const handleRejectCertificate = (certificateId: string) => {
        if(!firestore) return;
        const certRef = doc(firestore, 'certificates', certificateId);
        updateDocumentNonBlocking(certRef, { status: "rejected" });
        toast({ title: "Certificate Rejected", description: "The certificate has been marked as rejected.", variant: "destructive" });
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage principals, approve certificates, and oversee the system.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Principal
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Principal Account</DialogTitle>
                            <DialogDescription>
                                This will create a new user with principal privileges.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="principal@school.edu" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="schoolName" render={({ field }) => (
                                    <FormItem><FormLabel>School Name</FormLabel><FormControl><Input placeholder="University of Innovation" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem><FormLabel>Temporary Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
                                )}/>
                                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "Creating..." : "Create Principal"}
                                </Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="approve-certificates">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="approve-certificates">Approve Certificates</TabsTrigger>
                    <TabsTrigger value="manage-principals">Manage Principals</TabsTrigger>
                </TabsList>
                <TabsContent value="approve-certificates">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Certificates</CardTitle>
                            <CardDescription>Review and approve or reject certificates issued by principals.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Certificate Title</TableHead>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingCertificates && <TableRow><TableCell colSpan={5} className="text-center">Loading pending certificates...</TableCell></TableRow>}
                                    {!isLoadingCertificates && pendingCertificates?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No pending certificates.</TableCell></TableRow>}
                                    {pendingCertificates?.map((cert) => (
                                        <TableRow key={cert.id}>
                                            <TableCell className="font-medium">{cert.title}</TableCell>
                                            <TableCell>{cert.studentName}</TableCell>
                                            <TableCell>{cert.branch}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{cert.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleApproveCertificate(cert.id)}>
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleRejectCertificate(cert.id)}>
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="manage-principals">
                    <Card>
                        <CardHeader>
                            <CardTitle>Principal Accounts</CardTitle>
                            <CardDescription>A list of all principal accounts in the system.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>School Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingPrincipals && <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>}
                                    {!isLoadingPrincipals && principals?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No principals found.</TableCell></TableRow>}
                                    {principals && principals.map((principal) => (
                                        <TableRow key={principal.id}>
                                            <TableCell className="font-medium">{principal.name}</TableCell>
                                            <TableCell>{principal.schoolName}</TableCell>
                                            <TableCell>{principal.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={principal.status === "Active" ? "default" : "secondary"}>
                                                    {principal.status || "Active"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        {principal.status === "Active" ? (
                                                            <DropdownMenuItem onClick={() => handleRevoke(principal.id)}>Revoke Access</DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem onClick={() => handleReinstate(principal.id)}>Reinstate Access</DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem onSelect={() => handleDeletePrincipal(principal.id)} className="text-destructive">Delete Principal</DropdownMenuItem>
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
            </Tabs>
        </div>
    );
}

    