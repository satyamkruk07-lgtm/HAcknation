'use client';

import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Loader2 } from 'lucide-react';
import JudgingForm from './_components/judging-form';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SubmittedProject } from '@/lib/types';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { getAuth, signInAnonymously } from 'firebase/auth';

export default function ProjectJudgingPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    if (!isUserLoading && !user) {
      signInAnonymously(auth).catch((error) => {
        console.error("Anonymous sign-in failed:", error);
      });
    }
  }, [user, isUserLoading]);
  
  const projectRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'projects', id);
  }, [firestore, id]);

  const { data: project, isLoading: isProjectLoading, error } = useDoc<SubmittedProject>(projectRef);
  
  const isContentLoading = isProjectLoading || isUserLoading;

  if (isContentLoading) {
    return (
        <div className="container py-12">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-5 w-full mt-4" />
                    <Skeleton className="h-5 w-5/6" />
                    <div className="mt-6 flex gap-4">
                        <Skeleton className="h-10 w-36" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
                <Skeleton className="h-[400px] w-full" />
            </div>
        </div>
    );
  }
  
  if (!project) {
     return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
            <h1 className="text-2xl font-bold">Project Not Found</h1>
            <p className="text-muted-foreground">This project may have been deleted or the ID is incorrect.</p>
            <Button asChild className="mt-4">
                <a href="/judging">Back to Judging Dashboard</a>
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="font-headline text-4xl font-bold">{project.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            by {(project.teamMembers || project.studentNames || []).join(', ')}
          </p>
          <p className="mt-4">{project.description}</p>
          <div className="mt-6 flex gap-4">
            <Button asChild variant="outline">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          </div>
        </div>
        
        <JudgingForm projectId={id} />
      </div>
    </div>
  );
}
