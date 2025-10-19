
import type { Metadata } from "next";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { MainNav } from "@/components/main-nav";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard - EduBlock",
  description: "Manage your EduBlock account.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <SidebarProvider>
        <div className="min-h-screen">
          <Sidebar>
              <Suspense>
                  <MainNav />
              </Suspense>
          </Sidebar>
          <SidebarInset>
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
  );
}
