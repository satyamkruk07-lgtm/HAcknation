
'use client';

import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Loader2 } from 'lucide-react';
import JudgingForm from './_components/judging-form';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SubmittedProject } from '@/lib/types';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectJudgingPage({
  params,
}: {
  params: { id: string };
}) {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  const projectRef = useMemoFirebase(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'projects', params.id);
  }, [firestore, params.id]);

  const { data: project, isLoading, error } = useDoc<SubmittedProject>(projectRef);
  
  if (isLoading || isUserLoading) {
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

  if (!project && !isLoading) {
    notFound();
  }

  if (!project) {
      return null;
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
        
        <JudgingForm />
      </div>
    </div>
  );
}
