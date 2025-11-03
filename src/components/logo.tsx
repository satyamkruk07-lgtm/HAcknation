'use client';

import Link from 'next/link';
import { useUser } from '@/firebase';
import Image from 'next/image';

export function Logo() {
  const { user, isUserLoading } = useUser();
  
  // Determine the href based on user state, but only after loading is complete.
  // During server render and initial client hydration, isUserLoading is true, so href will be '/'.
  // This ensures server and client render the same initial HTML.
  const href = !isUserLoading && user ? '/dashboard' : '/';

  return (
    <Link href={href} className="flex items-center space-x-2">
       <Image
          src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHdpdGglMjBib3l8ZW58MHx8fHwxNzE3MDc2MzM4fDA&ixlib=rb-4.1.0&q=80&w=400"
          alt="HackNation Logo"
          width={32}
          height={32}
          className="rounded-full object-cover"
          data-ai-hint="mountain boy"
        />
      <span className="font-bold font-headline text-lg">HackNation</span>
    </Link>
  );
}
