'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useUser, useDoc, useMemoFirebase, useAuth } from '@/firebase';
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
import { useAdminStatus } from '@/hooks/useAdminStatus';

export default function SubmitClient() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isLoading = isUserLoading || isAdminLoading;

  useEffect(() => {
    if (!isLoading) {
      if (!user || !isAdmin) {
        router.push('/');
      }
    }
  }, [user, isAdmin, isLoading, router]);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserAccount>(userDocRef);

  const [projectName, setProjectName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [description, setDescription] = useState('');
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

    if (!user || !isAdmin) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be an admin to submit a project.',
      });
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
    
    if (!demoUrl) {
        toast({
            variant: 'destructive',
            title: 'Link missing',
            description: 'Please provide a link to your presentation.',
        });
        return;
    }
    
    try {
        new URL(demoUrl);
    } catch (_) {
        toast({
            variant: 'destructive',
            title: 'Invalid URL',
            description: 'Please provide a valid link to your presentation.',
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
        demoUrl: demoUrl,
        submittedBy: user.displayName,
        submissionDate: serverTimestamp(),
      });

      toast({
        title: 'Project Submitted!',
        description: 'Your project has been successfully submitted for judging. Good luck!',
      });
      
      router.push('/dashboard');

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message || 'An unknown error occurred while saving project data.',
      });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const isContentLoading = isLoading || isProfileLoading;

  if (isContentLoading || !user || !isAdmin) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                    <Label htmlFor="project-name">Project Name <span className="text-destructive">*</span></Label>
                    <Input id="project-name" placeholder="e.g., EcoTrack" required value={projectName} onChange={(e) => setProjectName(e.target.value)} disabled={isSubmitting}/>
                </div>
                
                {userProfile?.registrationType === 'team' ? (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="team-name">Team Name <span className="text-destructive">*</span></Label>
                            <Input 
                                id="team-name" 
                                placeholder="The Innovators" 
                                value={teamName} 
                                onChange={(e) => setTeamName(e.target.value)}
                                required 
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="team-members">Team Members <span className="text-destructive">*</span></Label>
                            <Input
                            id="team-members"
                            placeholder="John Doe, Jane Smith..."
                            required
                            value={teamMembers}
                            onChange={(e) => setTeamMembers(e.target.value)}
                            disabled={isSubmitting}
                            />
                            <p className="text-xs text-muted-foreground">
                            Please enter full names, separated by commas.
                            </p>
                        </div>
                    </>
                ) : (
                      <div className="space-y-2">
                        <Label htmlFor="student-name">Your Name <span className="text-destructive">*</span></Label>
                        <Input
                            id="student-name"
                            required
                            value={teamMembers}
                            readOnly
                            className="bg-muted/50"
                            disabled={isSubmitting}
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="description">Project Description <span className="text-destructive">*</span></Label>
                    <Textarea
                    id="description"
                    placeholder="Describe your project in a few sentences."
                    className="min-h-[120px]"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isSubmitting}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="demo-url">Presentation Link <span className="text-destructive">*</span></Label>
                    <Input
                        id="demo-url"
                        placeholder="https://docs.google.com/presentation/..."
                        required
                        value={demoUrl}
                        onChange={(e) => setDemoUrl(e.target.value)}
                        disabled={isSubmitting}
                    />
                     <p className="text-xs text-muted-foreground">
                        Upload your presentation to Google Drive, OneDrive, or Dropbox and paste the shareable link here.
                    </p>
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
