'use client';

import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';

export function Logo() {
  const { user, isUserLoading } = useUser();
  
  // Determine the href based on user state, but only after loading is complete.
  // During server render and initial client hydration, isUserLoading is true, so href will be '/'.
  // This ensures server and client render the same initial HTML.
  const href = !isUserLoading && user ? '/dashboard' : '/';

  return (
    <Link href={href} className="flex items-center space-x-2">
      <Rocket className="h-6 w-6 text-accent" />
      <span className="font-bold font-headline text-lg">HackNation</span>
    </Link>
  );
}
