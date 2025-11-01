'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { Button } from './ui/button';

export function MainNav() {
  const pathname = usePathname();
  const routes = [
    { href: '/schedule', label: 'Schedule' },
    { href: '/teams', label: 'Team Up' },
    { href: '/submit', label: 'Submit' },
    { href: '/judging', label: 'Judging' },
  ];

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === route.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Button asChild className='hidden sm:inline-flex'>
          <Link href="/register">Register</Link>
        </Button>
      </div>
    </div>
  );
}
