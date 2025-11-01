import { Rocket } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Rocket className="h-6 w-6 text-accent" />
      <span className="font-bold font-headline text-lg">HackTrack</span>
    </Link>
  );
}
