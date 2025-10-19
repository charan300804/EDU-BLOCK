import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PlusCircle, UserPlus } from "lucide-react";

export default function PrincipalDashboardPage() {
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><PlusCircle className="h-5 w-5"/> Issue a New Certificate</CardTitle>
              <CardDescription>Fill in the details to issue a new certificate to a student.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-id">Student ID</Label>
                <Input id="student-id" placeholder="e.g., STU12345" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert-title">Certificate Title</Label>
                <Input id="cert-title" placeholder="e.g., B.Tech Computer Science" />
              </div>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Generate Hash & Issue Certificate
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create-student">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5" />Create a New Student Account</CardTitle>
              <CardDescription>This will generate login credentials for the student.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-name">Student Full Name</Label>
                <Input id="student-name" placeholder="e.g., John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-email">Student Email</Label>
                <Input id="student-email" type="email" placeholder="e.g., john.doe@example.com" />
              </div>
              <Button className="w-full">Create Student</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
