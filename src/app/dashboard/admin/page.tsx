import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const principals = [
    { id: "p1", name: "Dr. Evelyn Reed", schoolName: "Oakridge International", email: "e.reed@oakridge.edu", status: "Active" },
    { id: "p2", name: "Mr. Samuel Chen", schoolName: "Maplewood High", email: "s.chen@maplewood.edu", status: "Active" },
    { id: "p3", name: "Ms. Aisha Khan", schoolName: "Lakeside Academy", email: "a.khan@lakeside.edu", status: "Inactive" },
];


export default function AdminDashboardPage() {
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
                        {principals.map((principal) => (
                            <TableRow key={principal.id}>
                                <TableCell className="font-medium">{principal.name}</TableCell>
                                <TableCell>{principal.schoolName}</TableCell>
                                <TableCell>{principal.email}</TableCell>
                                <TableCell>
                                    <Badge variant={principal.status === "Active" ? "default" : "secondary"}>
                                        {principal.status}
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
