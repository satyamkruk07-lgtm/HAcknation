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
import { Mail, Phone, Users, Loader2 } from 'lucide-react';
import type { UserAccount } from '@/lib/types';
import { useFirestore, useUser, useAuth } from '@/firebase';
import { collection, query, orderBy, getDocs, limit, startAfter, type QueryDocumentSnapshot } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useAdminStatus } from '@/hooks/useAdminStatus';

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
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const router = useRouter();

  // Pagination State
  const [teamProfiles, setTeamProfiles] = useState<UserAccount[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [lastVisibleProfile, setLastVisibleProfile] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  
  const isLoading = isUserLoading || isAdminLoading;

  useEffect(() => {
    if (!isLoading) {
      if (!user || !isAdmin) {
        router.push('/');
      }
    }
  }, [user, isAdmin, isLoading, router]);

  const loadMoreProfiles = useCallback(async () => {
    if (!firestore || !hasMore) return;
    setIsLoadingProfiles(true);

    let q = query(collection(firestore, 'users'), orderBy('registrationDate', 'desc'), limit(9));
    if (lastVisibleProfile) {
        q = query(q, startAfter(lastVisibleProfile));
    }

    try {
        const querySnapshot = await getDocs(q);
        const newProfiles = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as UserAccount));
        
        setTeamProfiles(prev => lastVisibleProfile ? [...prev, ...newProfiles] : newProfiles);
        
        if (querySnapshot.docs.length < 9) {
            setHasMore(false);
        } else {
            setLastVisibleProfile(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }
    } catch(err) {
        const permissionError = new FirestorePermissionError({
            path: 'users',
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
    } finally {
        setIsLoadingProfiles(false);
    }
  }, [firestore, hasMore, lastVisibleProfile]);
  
  useEffect(() => {
    if(user && isAdmin) {
      loadMoreProfiles();
    } else if (!isLoading) {
      setIsLoadingProfiles(false);
    }
  }, [user, isAdmin, isLoading, loadMoreProfiles]);

  const showSkeletons = isLoadingProfiles && teamProfiles.length === 0;

  if (isLoading || !user || !isAdmin) {
     return (
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          Available Hackers
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showSkeletons ? (
             Array.from({length: 6}).map((_, i) => <ProfileCardSkeleton key={i} />)
          ) : teamProfiles.length > 0 ? (
            teamProfiles.map((profile) => {
              const imageUrl = profile.photoURL || `https://picsum.photos/seed/${profile.id}/200/200`;

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
                      <CardDescription>
                        {[profile.department, profile.college].filter(Boolean).join(', ') || 'Hacker'}
                        {profile.mentorName && (
                          <span className="mt-1 block text-xs">
                            Mentor: {profile.mentorName}
                          </span>
                        )}
                      </CardDescription>
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
                    {profile.registrationType === 'team' ? (
                        <Badge variant="outline" className="w-full justify-center">
                           <Users className="mr-2 h-4 w-4" /> Already in a team
                        </Badge>
                    ) : (
                        <div className="flex w-full gap-2">
                            <Button asChild className="w-full">
                            <a href={`mailto:${profile.email}`}>
                                <Mail className="mr-2 h-4 w-4" /> Connect
                            </a>
                            </Button>
                            {profile.phoneNumber && (
                            <Button asChild variant="outline" className="w-full">
                                <a href={`tel:${profile.phoneNumber}`}>
                                    <Phone className="mr-2 h-4 w-4" /> Call
                                </a>
                            </Button>
                            )}
                        </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-10 text-center text-muted-foreground">
              <p>No individual participants are looking for a team right now. Check back later!</p>
            </div>
          )}
        </div>

        {hasMore && (
            <div className="mt-8 flex justify-center">
                <Button onClick={loadMoreProfiles} disabled={isLoadingProfiles}>
                    {isLoadingProfiles && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Load More
                </Button>
            </div>
        )}

      </div>
    </div>
  );
}
