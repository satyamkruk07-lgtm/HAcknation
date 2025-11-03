'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail } from 'lucide-react';
import type { UserAccount } from '@/lib/types';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

function ProfileCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className='space-y-2'>
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-14" />
                </div>
            </CardContent>
            <CardFooter>
                <Skeleton className="h-10 w-full" />
            </CardFooter>
        </Card>
    )
}

export default function TeamsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  const usersCollectionQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'users'), orderBy('registrationDate', 'desc'));
  }, [firestore, user]);

  const { data: teamProfiles, isLoading } = useCollection<UserAccount>(usersCollectionQuery);

  const sortedProfiles = useMemo(() => {
    if (!teamProfiles) return null;

    let profiles = [...teamProfiles];
    
    // Define the special profiles
    const kalyaniProfile = profiles.find(p => p.email === 'kalyanikri1111@gmail.com');
    const satyamProfile = profiles.find(p => p.email === 'frgtpeople@gmail.com');

    // Filter out the special profiles from the main list
    profiles = profiles.filter(p => p.id !== kalyaniProfile?.id && p.id !== satyamProfile?.id);
    
    // Filter out other specific users
    profiles = profiles.filter(profile => {
        const namesToFilter = ['priyanshu singh', 'djlnac', 'grace'];
        if (profile.name && namesToFilter.includes(profile.name.toLowerCase())) {
            return false;
        }
        return true;
    });

    const finalSortedList = [];
    if (kalyaniProfile) finalSortedList.push(kalyaniProfile);
    if (satyamProfile) finalSortedList.push(satyamProfile);
    finalSortedList.push(...profiles);

    return finalSortedList;
  }, [teamProfiles]);

  if (isUserLoading || isLoading || !user) {
    return (
        <div className="container py-12">
            <div className="text-center">
                <h1 className="font-headline text-4xl font-bold">Find Your Team</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                Connect with other hackers and build your dream team.
                </p>
            </div>
            <div className="mt-12">
                <h2 className="mb-6 font-headline text-2xl font-bold">
                Looking for a Team
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({length: 6}).map((_, i) => <ProfileCardSkeleton key={i} />)}
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold">Find Your Team</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Connect with other hackers and build your dream team.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 font-headline text-2xl font-bold">
          Looking for a Team
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProfiles && sortedProfiles.map((profile) => {
            let imageUrl;
            if (profile.email === 'frgtpeople@gmail.com') {
                imageUrl = 'https://images.unsplash.com/photo-1748636271716-472728fdb86f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyMHx8c3RhdHVlJTIwb2YlMjBsaWJ8ZW58MHx8fHwxNzYyMDI4MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080';
            } else if (profile.email === 'kalyanikri1111@gmail.com') {
                 imageUrl = 'https://images.unsplash.com/photo-1748636271716-472728fdb86f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyMHx8c3RhdHVlJTIwb2YlMjBsaWJ8ZW58MHx8fHwxNzYyMDI4MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080';
            } else {
                imageUrl = profile.photoURL || `https://picsum.photos/seed/${profile.id}/200/200`;
            }

            return (
              <Card key={profile.id} className="flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Image
                    src={imageUrl}
                    alt={profile.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                    data-ai-hint="person portrait"
                  />
                  <div>
                    <CardTitle>{profile.name}</CardTitle>
                    <CardDescription>{profile.college || 'Hacker'}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className='text-sm text-muted-foreground line-clamp-2 min-h-[40px]'>{profile.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {(profile.skills || []).map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <a href={`mailto:${profile.email}`}>
                      <Mail className="mr-2 h-4 w-4" /> Connect
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
