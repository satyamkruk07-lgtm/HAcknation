'use client';

import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Loader2, FileText } from 'lucide-react';
import JudgingForm from './_components/judging-form';
import { useDoc, useFirestore, useMemoFirebase, useUser, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { SubmittedProject } from '@/lib/types';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminStatus } from '@/hooks/useAdminStatus';

export default function ProjectJudgingPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const router = useRouter();

  const isLoading = isUserLoading || isAdminLoading;

  useEffect(() => {
    if (!isLoading) {
      if (!user || !isAdmin) {
        router.push('/');
      }
    }
  }, [user, isAdmin, isLoading, router]);

  const projectRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'projects', id);
  }, [firestore, id]);

  const { data: project, isLoading: isProjectLoading, error } = useDoc<SubmittedProject>(projectRef);
  
  const isContentLoading = isProjectLoading || isLoading;

  if (isContentLoading || !isAdmin) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
            <Button asChild variant="outline" disabled={!project.demoUrl}>
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <FileText className="mr-2 h-4 w-4" />
                View Presentation
              </a>
            </Button>
          </div>
        </div>
        
        <JudgingForm projectId={id} />
      </div>
    </div>
  );
}
