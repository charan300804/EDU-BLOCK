
"use client"

import { usePathname } from 'next/navigation';
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel } from './ui/sidebar';
import { Logo } from './icons/logo';
import { UserNav } from './user-nav';
import { Home, Shield, School, GraduationCap, Briefcase, ChevronDown, UserPlus } from 'lucide-react';
import type { Role } from '@/lib/types';
import Link from 'next/link';

const navItems = {
    admin: [
        { href: "/dashboard/admin", icon: <Home />, label: "Dashboard" },
        { href: "/dashboard/admin", icon: <School />, label: "Manage Principals" },
        { href: "/dashboard/admin", icon: <Shield />, label: "Audit Logs" },
    ],
    principal: [
        { href: "/dashboard/principal", icon: <Home />, label: "Dashboard" },
        { href: "/dashboard/principal", icon: <GraduationCap />, label: "Issue Certificate" },
        { href: "/dashboard/principal", icon: <UserPlus />, label: "Create Student" },
    ],
    student: [
        { href: "/dashboard/student", icon: <Home />, label: "My Certificates" },
        { href: "/dashboard/student", icon: <Briefcase />, label: "Career Guidance" },
    ],
    employer: [
        { href: "/dashboard/employer", icon: <Home />, label: "Verify Certificate" },
    ]
}

export function MainNav() {
    const pathname = usePathname();
    // FIXME: This is a mock role based on URL, replace with real auth state
    const role: Role = (pathname.split('/')[2] as Role) || 'student';
    const currentNavItems = navItems[role] || navItems.student;

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
                    {currentNavItems.map((item) => (
                        <SidebarMenuItem key={item.label}>
                            <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.label}>
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
