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
  LayoutDashboard,
  BookMarked,
  Briefcase,
  Users,
  BadgeDollarSign,
  LogOut,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const navItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/courses", icon: BookMarked, label: "Courses" },
    { href: "/admin/internships", icon: Briefcase, label: "Internships" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/subscriptions", icon: BadgeDollarSign, label: "Subscriptions" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
                        <SidebarMenuButton asChild tooltip={item.label}>
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
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link href="#">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Logout">
                  <Link href="/">
                    <LogOut />
                    <span>Logout</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 p-4 backdrop-blur">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/40?u=admin" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
