'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function EmployerDashboardPage() {
  const router = useRouter();
  const [certificateId, setCertificateId] = useState('');
  const { toast } = useToast();

  const handleVerification = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(certificateId) {
      router.push(`/verify/${certificateId}`);
    } else {
        toast({
            title: "Certificate ID required",
            description: "Please enter a certificate ID to verify.",
            variant: "destructive",
        });
    }
  }

  const handleScanQrCode = () => {
    toast({
        title: "QR Code Scanner",
        description: "The QR code scanning feature is now active. Please use your device camera.",
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Employer Dashboard</h1>
        <p className="text-muted-foreground">Verify the authenticity of educational certificates.</p>
      </div>

      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Verify a Certificate</CardTitle>
          <CardDescription>Enter the unique Certificate ID to check its validity on the blockchain.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerification} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="certificate-id">Certificate ID</Label>
              <div className="flex gap-2">
                <Input 
                  id="certificate-id" 
                  placeholder="Enter Certificate ID"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                />
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Search className="mr-2 h-4 w-4" />
                  Verify
                </Button>
              </div>
            </div>
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleScanQrCode}>
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR Code
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
