
'use client';

import React from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  MessageSquare,
  Zap,
  Mail,
  Phone,
  GitBranch,
  BookOpen,
  Briefcase,
  Linkedin
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { sponsors, conductors } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import type { Announcement, Conductor } from '@/lib/types';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
    icon: FileText,
  },
  {
    name: 'Project Ideas',
    description: 'Get inspired with project ideas.',
    href: '/ai-discussion',
    icon: Lightbulb,
  },
];

const hackathonTips = [
    {
        icon: Zap,
        title: "Keep Your Idea Simple",
        description: "Focus on a core feature. It's better to have one polished feature than five buggy ones. You only have 48 hours!"
    },
    {
        icon: MessageSquare,
        title: "Communicate with Your Team",
        description: "Talk regularly. Set clear roles. Use tools like Git for code and Discord for communication to stay in sync."
    },
    {
        icon: Lightbulb,
        title: "Don't Be Afraid to Pivot",
        description: "If your initial idea isn't working or you think of something better, it's okay to change direction. Adaptability is key."
    },
    {
        icon: GitBranch,
        title: "Manage Your Time",
        description: "Create a rough schedule. Allocate time for brainstorming, building, debugging, and preparing your presentation."
    }
]


function Countdown() {
    const deadline = new Date('2025-11-13T11:00:00');
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = deadline.getTime() - now.getTime();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };
        
        // Run only on client
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const renderTimeValue = (value: number | undefined) => {
        if (value === undefined || timeLeft === null) {
            return <Skeleton className="h-8 w-12" />;
        }
        return <div className="text-3xl font-bold font-mono">{String(value).padStart(2, '0')}</div>;
    }

    return (
        <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline">
                    <Clock className="h-6 w-6 text-accent" />
                    <span>Submission Deadline</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                        {renderTimeValue(timeLeft?.days)}
                        <div className="text-xs text-muted-foreground">DAYS</div>
                    </div>
                    <div>
                        {renderTimeValue(timeLeft?.hours)}
                        <div className="text-xs text-muted-foreground">HOURS</div>
                    </div>
                    <div>
                        {renderTimeValue(timeLeft?.minutes)}
                        <div className="text-xs text-muted-foreground">MINUTES</div>
                    </div>
                    <div>
                        {renderTimeValue(timeLeft?.seconds)}
                        <div className="text-xs text-muted-foreground">SECONDS</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function AnnouncementSkeleton() {
    return (
        <div className="relative flex items-start space-x-3">
            <div className="relative">
                <Skeleton className="flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-background" />
            </div>
            <div className="min-w-0 flex-1 py-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    )
}

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [selectedConductor, setSelectedConductor] = useState<Conductor | null>(null);

  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'announcements'), orderBy('timestamp', 'desc'), limit(5));
  }, [firestore, user]);

  const { data: announcements, isLoading: areAnnouncementsLoading } = useCollection<Announcement>(announcementsQuery);
  
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

  const topConductor = conductors.find(c => c.name === "Mr. Kumar Satyam");
  const otherConductors = conductors.filter(c => c.name !== "Mr. Kumar Satyam");
  
  const handleConductorSelect = (conductor: Conductor) => {
    setSelectedConductor(conductor);
  };

  return (
    <div className="bg-muted/40 min-h-[calc(100vh-3.5rem)]">
      <div className="container py-12">
        {/* Header with Background */}
        <div className="relative mb-12 border-b pb-8 rounded-lg overflow-hidden">
          <Image
            src="https://tse3.mm.bing.net/th/id/OIP.JnCUQBVNssl3sTwTOt84bgHaE8?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
            alt="Shivalik College Background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative flex justify-start items-center p-8 gap-6">
             <Image
              src="https://shivalikcollege.edu.in/naac/assets/img/shivalik_college_of_eng_logo.jpg"
              alt="Shivalik College Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
            <div className="flex items-end gap-4">
              <h1 className="font-headline text-3xl font-bold text-white">
                Shivalik <br /> College of Engineering
              </h1>
              <Badge variant="destructive" className="text-lg mb-1">NAAC Grade A+</Badge>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-12">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-headline text-2xl font-bold">
              Welcome, {user.displayName || 'Hacker'}!
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Your HackNation journey starts here. Let's get building!
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
                  <Link href={feature.href} key={feature.name} className="group block">
                    <Card className="h-full transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:-translate-y-2">
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
            <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover-translate-y-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline">
                  <Megaphone className="h-6 w-6 text-accent" />
                  <span>Live Announcements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flow-root">
                    <ul className="-mb-4">
                      {areAnnouncementsLoading ? (
                        <>
                            <li className="pb-4"><AnnouncementSkeleton /></li>
                            <li className="pb-4"><AnnouncementSkeleton /></li>
                            <li className="pb-4"><AnnouncementSkeleton /></li>
                        </>
                      ) : announcements && announcements.length > 0 ? (
                        announcements.map((announcement, announcementIdx) => (
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
                                    {announcement.timestamp && (
                                       <span className="ml-2 whitespace-nowrap">
                                        {formatDistanceToNow(new Date(announcement.timestamp.seconds * 1000), { addSuffix: true })}
                                      </span>
                                    )}
                                  </div>
                                  <div className="mt-1">
                                    <p className="text-sm font-semibold text-foreground">
                                      {announcement.title}
                                    </p>
                                    <p className="text-sm text-foreground/80 mt-0.5">
                                      {announcement.content}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))
                      ) : (
                        <li>
                            <p className="text-sm text-muted-foreground text-center py-4">No announcements yet. Check back soon!</p>
                        </li>
                      )}
                    </ul>
                  </div>
              </CardContent>
            </Card>

            {/* Hackathon Tips */}
            <div className="space-y-8">
              <h2 className="mb-4 font-headline text-2xl font-bold">Hackathon Tips</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {hackathonTips.map((tip, index) => (
                  <Card key={index} className="group transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-transform duration-200 group-hover:scale-105 group-active:scale-110 group-active:shadow-lg group-active:shadow-accent/50">
                            <tip.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-base">
                              {tip.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {tip.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <Countdown />
            <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
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
            {/* Our Sponsors */}
            <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline">
                    <HeartHandshake className="h-6 w-6 text-accent" />
                    <span>Our Sponsors</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4 items-center justify-items-center">
                    {sponsors.map((sponsor) => (
                        <div key={sponsor.name} className="flex flex-col items-center justify-center text-center gap-2">
                            {React.cloneElement(sponsor.icon, { className: "h-10 w-10 text-muted-foreground" })}
                            <span className="font-semibold text-sm text-muted-foreground">{sponsor.name}</span>
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>

        {/* Conducted By Section */}
        <div className="mt-12 flex flex-col items-center">
            <h2 className="mb-8 font-headline text-2xl font-bold text-center">Conducted By</h2>
            <div className="flex flex-col items-center gap-6">
                {/* Top row with 1 person */}
                {topConductor && (
                    <div className="flex justify-center">
                        <div key={topConductor.id} className="flex flex-col items-center text-center gap-2">
                            <button 
                                onClick={() => handleConductorSelect(topConductor)} 
                                onTouchEnd={(e) => { e.preventDefault(); handleConductorSelect(topConductor); }}
                                className="rounded-full"
                            >
                                <Image
                                    src={topConductor.imageUrl || `https://picsum.photos/seed/${topConductor.id}/96/96`}
                                    alt={`Portrait of ${topConductor.name}`}
                                    width={96}
                                    height={96}
                                    className="rounded-full border-4 border-background shadow-lg transition-transform hover:scale-105 object-cover h-24 w-24"
                                    data-ai-hint="person portrait"
                                />
                            </button>
                            <div className="mt-2">
                                <h3 className="font-semibold text-base">{topConductor.name}</h3>
                                <p className="text-sm text-muted-foreground">{topConductor.role}</p>
                            </div>
                        </div>
                    </div>
                )}
                {/* Bottom row with the rest */}
                <div className="flex justify-center gap-12 flex-wrap">
                    {otherConductors.map((conductor) => (
                        <div key={conductor.id} className="flex flex-col items-center text-center gap-2">
                             <button 
                                onClick={() => handleConductorSelect(conductor)}
                                onTouchEnd={(e) => { e.preventDefault(); handleConductorSelect(conductor); }}
                                className="rounded-full"
                             >
                                <Image
                                    src={conductor.imageUrl || `https://picsum.photos/seed/${conductor.id}/96/96`}
                                    alt={`Portrait of ${conductor.name}`}
                                    width={96}
                                    height={96}
                                    className="rounded-full border-4 border-background shadow-lg transition-transform hover:scale-105 object-cover h-24 w-24"
                                    data-ai-hint="person portrait"
                                />
                            </button>
                            <div className="mt-2">
                                <h3 className="font-semibold text-base">{conductor.name}</h3>
                                <p className="text-sm text-muted-foreground">{conductor.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
      {selectedConductor && (
        <Dialog open={!!selectedConductor} onOpenChange={(open) => !open && setSelectedConductor(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="items-center text-center">
                <Image
                    src={selectedConductor.imageUrl || `https://picsum.photos/seed/${selectedConductor.id}/96/96`}
                    alt={selectedConductor.name}
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-background shadow-lg object-cover"
                    data-ai-hint="person portrait"
                  />
              <div className='pt-2'>
                <DialogTitle className="text-2xl font-headline">{selectedConductor.name}</DialogTitle>
                <DialogDescription>{selectedConductor.role}</DialogDescription>
              </div>
            </DialogHeader>
            <div className="py-4 grid gap-6">
                <div className='space-y-4'>
                    <h4 className="font-semibold text-center text-muted-foreground text-sm uppercase tracking-wider">Contact</h4>
                    <div className='flex items-center justify-center gap-4'>
                        <Button variant="outline" size="icon" asChild>
                            <a href={`mailto:${selectedConductor.email}`} aria-label="Email">
                                <Mail className="h-5 w-5" />
                            </a>
                        </Button>
                         <Button variant="outline" size="icon" asChild>
                            <a href={selectedConductor.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </Button>
                        {selectedConductor.phone && (
                            <Button variant="outline" size="icon" asChild>
                                <a href={`tel:${selectedConductor.phone}`} aria-label="Call">
                                    <Phone className="h-5 w-5" />
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                <div className='space-y-2 text-center'>
                    <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Qualification</h4>
                    <p className="text-sm flex items-center justify-center gap-2"><BookOpen className="h-4 w-4 text-accent" /> {selectedConductor.qualification}</p>
                </div>

                <div className='space-y-3 text-center'>
                    <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Skills</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {selectedConductor.skills.map(skill => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}


    

    


