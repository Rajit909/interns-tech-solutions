
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/shared/Logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  BookMarked,
  Briefcase,
  Users,
  BadgeDollarSign,
  LogOut,
  Settings,
  User,
  Rss,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import type { IUser } from "@/models/User";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";


const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/courses", icon: BookMarked, label: "Courses" },
    { href: "/admin/internships", icon: Briefcase, label: "Internships" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/blogs", icon: Rss, label: "Blog" },
    { href: "/admin/subscriptions", icon: BadgeDollarSign, label: "Subscriptions" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { data, error, isLoading } = useSWR('/api/admin/me', fetcher);
  const user: IUser | null = data?.user;
  
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      toast({ title: 'Logged out successfully' });
      router.push('/admin/login');
    } catch (error) {
      toast({ title: 'Logout failed', variant: 'destructive' });
    }
  }

  if (pathname === '/admin/login' || pathname === '/admin/signup') {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon" className="border-r bg-card">
          <SidebarHeader className="p-2">
            <Logo />
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
                {navItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild tooltip={item.label} isActive={pathname.startsWith(item.href)}>
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings" isActive={pathname.startsWith('/admin/settings')}>
                  <Link href="/admin/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col flex-1 min-w-0">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 p-4 backdrop-blur">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                     {isLoading ? (
                      <Skeleton className="h-10 w-10 rounded-full" />
                    ) : error || !user ? (
                      <Avatar>
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarImage src={user.imageUrl} alt={user.name}/>
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      {isLoading || error || !user ? (
                         <div className="flex flex-col space-y-2">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-3 w-[150px]" />
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
