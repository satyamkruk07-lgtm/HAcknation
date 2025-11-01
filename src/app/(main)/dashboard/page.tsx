
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { ArrowRight, Calendar, Code, GanttChartSquare, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const features = [
  {
    name: 'Schedule',
    description: 'View the event schedule.',
    href: '/schedule',
    icon: Calendar,
  },
  {
    name: 'Team Up',
    description: 'Find team members.',
    href: '/teams',
    icon: Users,
  },
  {
    name: 'Submit',
    description: 'Submit your project.',
    href: '/submit',
    icon: Code,
  },
  {
    name: 'Judging',
    description: 'Access the judging dashboard.',
    href: '/judging',
    icon: GanttChartSquare,
  },
];

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-6 w-80 mx-auto mt-4" />
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold">
          Welcome, {user.displayName || 'Hacker'}!
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your HackTrack journey starts here.
        </p>
      </div>

      <div className="mt-12 grid max-w-2xl mx-auto gap-6 sm:grid-cols-2">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.name}>
            <Card className="p-6 hover:bg-muted/50 transition-colors h-full">
              <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <feature.icon className="h-5 w-5 text-accent" />
                      {feature.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
