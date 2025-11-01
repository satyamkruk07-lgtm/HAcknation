
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Calendar,
  Code,
  GanttChartSquare,
  Users,
  Clock,
  UserCheck,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { schedule } from '@/lib/data.tsx';

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
    name: 'Submit Project',
    description: 'Submit your project for judging.',
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

const nextEvent = schedule.find(
  (e) => new Date(e.time.replace('Day 1 - ', '')) > new Date() || schedule[1]
);

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
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <Skeleton className="h-48 w-full md:col-span-2" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  const profileCompletion = 75; // Dummy data

  return (
    <div className="bg-muted/40 min-h-[calc(100vh-3.5rem)]">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-headline text-4xl font-bold">
            Welcome, {user.displayName || 'Hacker'}!
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Your HackTrack journey starts here. Let&apos;s get building!
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Next Event */}
            {nextEvent && (
              <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Clock className="h-7 w-7" />
                    <span>Up Next: {nextEvent.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/80">{nextEvent.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <span className="font-semibold">{nextEvent.time}</span>
                    {nextEvent.speaker && (
                      <span>- Speaker: {nextEvent.speaker}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div>
              <h2 className="mb-4 font-headline text-2xl font-bold">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {features.map((feature) => (
                  <Link href={feature.href} key={feature.name}>
                    <Card className="group h-full transition-all hover:border-accent hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                              <feature.icon className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">
                                {feature.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {feature.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="mt-1 h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline">
                  <UserCheck className="h-6 w-6 text-accent" />
                  <span>Your Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Profile Completion</span>
                    <span>{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} />
                  <p className="text-xs text-muted-foreground mt-2">
                    Complete your profile to find better teammates!
                  </p>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/teams">Complete Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
