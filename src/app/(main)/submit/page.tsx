'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { UserAccount } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function SubmitPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserAccount>(userDocRef);

  const [projectName, setProjectName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Pre-fill form from URL query parameters
    const name = searchParams.get('name');
    const desc = searchParams.get('description');
    if (name) {
      setProjectName(name);
    }
    if (desc) {
      setDescription(desc);
    }

    if (userProfile) {
      if (userProfile.registrationType === 'team') {
        setTeamName(userProfile.teamName || '');
        setTeamMembers(userProfile.teamMembers?.join(', ') || '');
      } else {
        // Individual user
        setTeamName(''); // Individual submission has no team name
        setTeamMembers(userProfile.name || '');
      }
    } else if (user && !isProfileLoading) {
        // Fallback for individual user if profile isn't filled out
        setTeamName('');
        setTeamMembers(user.displayName || '');
    }
  }, [searchParams, userProfile, user, isProfileLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to submit a project.',
      });
      router.push('/login');
      return;
    }

    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Database connection not found.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const projectsCollection = collection(firestore, 'projects');
      await addDoc(projectsCollection, {
        name: projectName,
        teamName: teamName,
        teamMembers: teamMembers.split(',').map((m) => m.trim()),
        description,
        githubUrl,
        demoUrl,
        submittedBy: user.displayName,
        submissionDate: serverTimestamp(),
      });

      toast({
        title: 'Project Submitted!',
        description: 'Your project has been successfully submitted for judging. Good luck!',
      });

      // Reset form
      setProjectName('');
      setTeamName('');
      setTeamMembers('');
      setDescription('');
      setGithubUrl('');
      setDemoUrl('');
      
      router.push('/dashboard');

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
        <div className="container py-12">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
                <CardFooter>
                    <Skeleton className="h-10 w-36" />
                </CardFooter>
            </Card>
        </div>
    );
  }


  return (
    <div className="container py-12">
        <form onSubmit={handleSubmit}>
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">
                Submit Your Project
                </CardTitle>
                <CardDescription>
                Fill out the form below to submit your project for judging. Good
                luck!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input id="project-name" placeholder="e.g., EcoTrack" required value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                </div>
                
                {userProfile?.registrationType === 'team' ? (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="team-name">Team Name</Label>
                            <Input 
                                id="team-name" 
                                placeholder="The Innovators" 
                                value={teamName} 
                                onChange={(e) => setTeamName(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="team-members">Team Members</Label>
                            <Input
                            id="team-members"
                            placeholder="John Doe, Jane Smith..."
                            required
                            value={teamMembers}
                            onChange={(e) => setTeamMembers(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                            Please enter full names, separated by commas.
                            </p>
                        </div>
                    </>
                ) : (
                      <div className="space-y-2">
                        <Label htmlFor="student-name">Your Name</Label>
                        <Input
                            id="student-name"
                            required
                            value={teamMembers}
                            readOnly
                            className="bg-muted/50"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                    id="description"
                    placeholder="Describe your project in a few sentences."
                    className="min-h-[120px]"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                    <Label htmlFor="github-url">GitHub Repository URL</Label>
                    <Input
                        id="github-url"
                        type="url"
                        placeholder="https://github.com/..."
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="demo-url">Live Demo URL</Label>
                    <Input
                        id="demo-url"
                        type="url"
                        placeholder="https://yourapp.com"
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                    />
                    </div>
                </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Submitting...' : 'Submit for Judging'}
                </Button>
            </CardFooter>
        </Card>
        </form>
    </div>
  );
}
