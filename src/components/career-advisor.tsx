"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getCareerAdvice } from "@/app/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import { Briefcase, Lightbulb, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const initialState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Send className="mr-2 h-4 w-4" />
      )}
      Get Advice
    </Button>
  );
}

export function CareerAdvisor({ certificates }: { certificates: string[] }) {
  const [state, formAction] = useFormState(getCareerAdvice, initialState);
  const [selectedCert, setSelectedCert] = useState(certificates[0] || "");
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.error) {
      const errorMessage = typeof state.error === 'string' ? state.error : 'An error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2"><Lightbulb className="text-yellow-400" /> AI Career Advisor</CardTitle>
        <CardDescription>
          Get personalized job and learning path suggestions based on your
          certificates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full">
              <Label htmlFor="certificate-select">Select a Certificate</Label>
              <Select name="certificateTitle" value={selectedCert} onValueChange={setSelectedCert}>
                <SelectTrigger id="certificate-select">
                  <SelectValue placeholder="Select a certificate" />
                </SelectTrigger>
                <SelectContent>
                  {certificates.map((cert) => (
                    <SelectItem key={cert} value={cert}>
                      {cert}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <SubmitButton />
          </div>
        </form>

        {state.data && (
          <div className="mt-6 grid gap-6 md:grid-cols-2 animate-in fade-in-50">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" /> Suggested Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                  {state.data.jobSuggestions.map((job, i) => (
                    <li key={i}>{job}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb className="h-5 w-5" /> Learning Paths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc pl-5">
                  {state.data.learningPathSuggestions.map((path, i) => (
                    <li key={i}>{path}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
