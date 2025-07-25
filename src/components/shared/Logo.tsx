import { GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
};

export function Logo({ className, textClassName, iconClassName }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <GraduationCap className={cn("h-7 w-7 text-primary", iconClassName)} />
      <span className={cn("text-xl font-bold tracking-tight text-foreground", textClassName)}>
        Intern Tech Solutions
      </span>
    </Link>
  );
}
