'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query, doc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { setDoc } from "firebase/firestore";

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
    const { signUp } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const principalsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, "principals"));
    }, [firestore]);

    const { data: principals, isLoading } = useCollection<any>(principalsQuery);

    const form = useForm<PrincipalFormValues>({
        resolver: zodResolver(principalSchema),
        defaultValues: { name: "", email: "", schoolName: "", password: "" },
    });

    async function onSubmit(values: PrincipalFormValues) {
        try {
            // We use the same signUp function but a different role.
            // In a real app you might have different backend functions or claim setups.
            const userCredential = await signUp(values.email, values.password, values.name, "principal");

            if (userCredential?.user && firestore) {
                const principalData = {
                    name: values.name,
                    email: values.email,
                    schoolName: values.schoolName,
                    status: "Active"
                };
                // Use setDoc to ensure the document ID is the user's UID
                await setDoc(doc(firestore, "principals", userCredential.user.uid), principalData);
                
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

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage principals and oversee the system.</p>
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
                                This will create a new user with principal privileges. They will receive an email to set up their account.
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
                            {isLoading && <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>}
                            {!isLoading && principals?.length === 0 && <TableRow><TableCell colSpan={5} className="text-center">No principals found.</TableCell></TableRow>}
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
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
