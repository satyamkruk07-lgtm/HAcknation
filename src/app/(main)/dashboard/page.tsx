
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Lightbulb,
  Calendar,
  Code,
  Users,
  Clock,
  HeartHandshake,
  Megaphone,
  FileText,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { schedule, sponsors, announcements } from '@/lib/data.tsx';
import { Badge } from '@/components/ui/badge';

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
    name: 'Project Ideas',
    description: 'Get inspired with project ideas.',
    href: '/ai-discussion',
    icon: Lightbulb,
  },
];

const nextEvent = schedule.find((e) => e.id === 2) ?? schedule[0];

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

  return (
    <div className="bg-muted/40 min-h-[calc(100vh-3.5rem)]">
      <div className="container py-12">
        {/* Header */}
        <div className="mb-12">
          <div>
            <h1 className="font-headline text-4xl font-bold">
              Welcome, {user.displayName || 'Hacker'}!
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Your HackNation journey starts here. Let&apos;s get building!
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
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

            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline">
                  <Megaphone className="h-6 w-6 text-accent" />
                  <span>Live Announcements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flow-root">
                    <ul className="-mb-4">
                      {announcements.map((announcement, announcementIdx) => (
                        <li key={announcement.id}>
                          <div className="relative pb-4">
                            {announcementIdx !== announcements.length - 1 ? (
                              <span
                                className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-border"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex items-start space-x-3">
                              <div className="relative">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary ring-4 ring-background">
                                  <Megaphone
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1 py-1">
                                <div className="text-sm text-muted-foreground">
                                  <Badge variant={announcement.type === 'Update' ? 'default' : 'secondary'}>{announcement.type}</Badge>
                                  <span className="ml-2 whitespace-nowrap">
                                    {announcement.time}
                                  </span>
                                </div>
                                <div className="mt-1">
                                  <p className="text-sm text-foreground">
                                    {announcement.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Next Event */}
            {nextEvent && (
              <Card className="bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Clock className="h-6 w-6" />
                    <span>Up Next: {nextEvent.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary-foreground/80">{nextEvent.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <span className="font-semibold">{nextEvent.time}</span>
                    {nextEvent.speaker && (
                      <span className="truncate">- {nextEvent.speaker}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* My Project */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline">
                  <FileText className="h-6 w-6 text-accent" />
                  <span>My Project</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">You have not submitted a project yet. The deadline is approaching!</p>
                <Button asChild className="w-full">
                  <Link href="/submit">Submit Your Project</Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Sponsors */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline">
                    <HeartHandshake className="h-6 w-6 text-accent" />
                    <span>Our Sponsors</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-y-8 gap-x-4 items-center justify-items-center">
                    {sponsors.map((sponsor) => (
                        <div key={sponsor.name} className="flex flex-col items-center justify-center text-center gap-2">
                            {sponsor.icon}
                            <span className="font-semibold text-sm text-muted-foreground">{sponsor.name}</span>
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
