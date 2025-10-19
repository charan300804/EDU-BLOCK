'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function EmployerDashboardPage() {
  const router = useRouter();
  const [certificateId, setCertificateId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isScanning) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this feature.',
          });
          setIsScanning(false);
        }
      };

      getCameraPermission();

      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      }
    }
  }, [isScanning, toast]);

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
    setIsScanning(prev => !prev);
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
                  disabled={isScanning}
                />
                <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={isScanning}>
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
                {isScanning ? 'Close Scanner' : 'Scan QR Code'}
            </Button>
            {isScanning && (
                <div className="mt-4 p-4 border rounded-md">
                    <video ref={videoRef} className="w-full aspect-video rounded-md bg-black" autoPlay muted />
                    {hasCameraPermission === false && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertTitle>Camera Access Required</AlertTitle>
                            <AlertDescription>
                                Please allow camera access in your browser to use this feature.
                            </AlertDescription>
                        </Alert>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 text-center">QR Code scanning is now active. Point your camera at a QR code.</p>
                </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
