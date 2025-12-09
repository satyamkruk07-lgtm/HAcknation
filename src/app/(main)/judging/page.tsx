
'use client';

import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github, PlusCircle } from 'lucide-react';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { SubmittedProject } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function ProjectCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="flex-1">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter className="flex justify-between">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-32" />
            </CardFooter>
        </Card>
    )
}

export default function JudgingPage() {
  const { isAdmin } = useAdminStatus();
  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('submissionDate', 'desc'));
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<SubmittedProject>(projectsQuery);

  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold">Judging Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Review submissions and provide your feedback.
        </p>
      </div>

      {isAdmin && (
        <div className="mt-8 flex justify-center">
          <Button asChild>
            <Link href="/submit">
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit a Project
            </Link>
          </Button>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)
        ) : projects && projects.length > 0 ? (
            projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
                <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>
                    by {(project.teamMembers || project.studentNames || []).join(', ')}
                </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-3">{project.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                <Button asChild variant="ghost" size="sm">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                    </a>
                </Button>
                <Button asChild>
                    <Link href={`/judging/${project.id}`}>
                    Judge Project <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                </CardFooter>
            </Card>
            ))
        ) : (
            <div className="col-span-full text-center text-muted-foreground py-10">
                <p>No projects have been submitted yet. Check back later!</p>
            </div>
        )}
      </div>
    </div>
  );
}
