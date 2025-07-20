'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search } from 'lucide-react';

import { Logo } from './Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#courses', label: 'Courses' },
  { href: '/#internships', label: 'Internships' },
  { href: '/#about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <div className="p-4">
                        <Logo />
                    </div>
                    <nav className="grid gap-2 p-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={cn(
                                    "rounded-md p-2 text-lg font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                                    pathname === link.href && "bg-muted text-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
        </div>

        <nav className="hidden flex-1 items-center space-x-6 md:flex">
            {navLinks.map((link) => (
                <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    {link.label}
                </Link>
            ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin/login">Admin Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
