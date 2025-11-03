'use client';

import Link from 'next/link';
import { useUser } from '@/firebase';
import { Rocket } from 'lucide-react';

export function Logo() {
  const { user, isUserLoading } = useUser();
  
  // Determine the href based on user state, but only after loading is complete.
  // During server render and initial client hydration, isUserLoading is true, so href will be '/'.
  // This ensures server and client render the same initial HTML.
  const href = !isUserLoading && user ? '/dashboard' : '/';

  return (
    <Link href={href} className="flex items-center space-x-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Rocket className="h-5 w-5 text-accent" />
      </div>
      <span className="font-bold font-headline text-lg">HackNation</span>
    </Link>
  );
}
