"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import type { Role } from "@/lib/types";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export function LoginTabs() {
  return (
    <Tabs defaultValue="student" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="student">Student</TabsTrigger>
        <TabsTrigger value="principal">Principal</TabsTrigger>
        <TabsTrigger value="employer">Employer</TabsTrigger>
        <TabsTrigger value="admin">Admin</TabsTrigger>
      </TabsList>
      <TabsContent value="student">
        <LoginForm role="student" />
      </TabsContent>
      <TabsContent value="principal">
        <LoginForm role="principal" />
      </TabsContent>
      <TabsContent value="employer">
        <LoginForm role="employer" />
      </TabsContent>
      <TabsContent value="admin">
        <LoginForm role="admin" />
      </TabsContent>
    </Tabs>
  );
}

function LoginForm({ role }: { role: Role }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(`Logging in as ${role}...`, values);
    // Simulate successful login and redirect
    const dashboardPath = role === 'student' ? '/dashboard/student' : `/dashboard/${role}`;
    router.push(dashboardPath);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline capitalize">{role} Login</CardTitle>
        <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Log In
            </Button>
            {role === 'employer' && (
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="underline text-primary">
                        Register here
                    </Link>
                </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
