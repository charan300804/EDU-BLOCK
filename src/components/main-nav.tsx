'use client';

import { usePathname } from 'next/navigation';
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarFooter } from './ui/sidebar';
import { Logo } from './icons/logo';
import { UserNav } from './user-nav';
import { Home, Shield, School, GraduationCap, Briefcase, UserPlus } from 'lucide-react';
import type { Role } from '@/lib/types';
import Link from 'next/link';
import { useUser } from '@/firebase';

const navItems = {
    admin: [
        { href: "/dashboard/admin", icon: <School />, label: "Manage Principals" },
        { href: "/dashboard/admin/audit", icon: <Shield />, label: "Audit Logs" },
    ],
    principal: [
        { href: "/dashboard/principal", icon: <Home />, label: "Dashboard" },
    ],
    student: [
        { href: "/dashboard/student", icon: <GraduationCap />, label: "My Certificates" },
        { href: "/dashboard/student/career", icon: <Briefcase />, label: "Career Guidance" },
    ],
    employer: [
        { href: "/dashboard/employer", icon: <Home />, label: "Verify Certificate" },
    ]
};

function getRoleFromPath(pathname: string): Role {
    const segment = pathname.split('/')[2];
    if (['admin', 'principal', 'student', 'employer'].includes(segment)) {
        return segment as Role;
    }
    // Fallback or based on user data
    return 'student';
}

export function MainNav() {
    const pathname = usePathname();
    const { user } = useUser();
    
    // Determine role from URL or user data
    const role: Role = getRoleFromPath(pathname);
    
    const currentNavItems = navItems[role] || [];

    if (!user) {
        return null; // Or a loading skeleton
    }

    return (
        <>
            <SidebarHeader className='p-4'>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Logo className="h-8 w-8 text-primary" />
                  <span className="font-headline text-xl font-semibold text-foreground">EduChain</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/dashboard'} tooltip="Overview">
                            <Link href="/dashboard">
                                <Home />
                                <span>Overview</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {currentNavItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                                <Link href={item.href}>
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <UserNav />
            </SidebarFooter>
        </>
    )
}
