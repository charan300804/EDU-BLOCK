'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useCollection } from "@/firebase/firestore/use-collection";
import { collection, query } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useMemo } from "react";

export default function AdminDashboardPage() {
    const firestore = useFirestore();

    const principalsQuery = useMemo(() => {
        if (!firestore) return null;
        return query(collection(firestore, "principals"));
    }, [firestore]);

    const { data: principals, isLoading } = useCollection<any>(principalsQuery);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage principals and oversee the system.</p>
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Principal
                </Button>
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
                            {isLoading && <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>}
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
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Revoke Access</DropdownMenuItem>
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
