'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Lightbulb, Sparkles, Send, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { projectIdeas } from '@/lib/data';
import type { ProjectIdea, SubmittedProject } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase, useUser, useAuth } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from 'firebase/auth';

export default function AiDiscussionPage() {
  const ideas: ProjectIdea[] = projectIdeas;
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  const [selectedIdea, setSelectedIdea] = useState<ProjectIdea | null>(null);
  const [takenIdeas, setTakenIdeas] = useState<Set<string>>(new Set());
  const [showTakenAlert, setShowTakenAlert] = useState(false);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      router.push('/login');
    } else if (!user.emailVerified) {
      signOut(auth).then(() => {
        router.push('/login?reason=unverified');
      });
    }
  }, [user, isUserLoading, router, auth]);

  // Fetch all submitted projects to check for taken ideas
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.emailVerified) return null;
    return query(collection(firestore, 'projects'));
  }, [firestore, user?.emailVerified]);

  const { data: submittedProjects, isLoading } = useCollection<SubmittedProject>(projectsQuery);

  useEffect(() => {
    if (submittedProjects) {
      const submittedProjectTitles = new Set(submittedProjects.map(p => p.name.toLowerCase()));
      const newlyTakenIdeas = new Set<string>();

      ideas.forEach(idea => {
        if (submittedProjectTitles.has(idea.title.toLowerCase())) {
          newlyTakenIdeas.add(idea.id);
        }
      });
      
      // Merge with existing taken ideas to handle both states
      setTakenIdeas(prev => new Set([...Array.from(prev), ...Array.from(newlyTakenIdeas)]));
    }
  }, [submittedProjects, ideas]);


  const handleCardClick = (idea: ProjectIdea) => {
    if (takenIdeas.has(idea.id)) {
      setShowTakenAlert(true);
    } else {
      setSelectedIdea(idea);
    }
  };

  const handleTakeIdea = () => {
    if (selectedIdea) {
      setTakenIdeas((prev) => new Set(prev).add(selectedIdea.id));
      const queryParams = new URLSearchParams({
        name: selectedIdea.title,
        description: selectedIdea.description,
      }).toString();
      router.push(`/submit?${queryParams}`);
      setSelectedIdea(null);
    }
  };

  const pageLoading = isLoading || isUserLoading;

  return (
    <>
      <div className="container py-12">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-headline text-3xl font-bold">
              Curated Project Ideas
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Here are some ideas to spark your creativity for the hackathon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageLoading ? (
              Array.from({ length: 9 }).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <div className="flex flex-wrap gap-2 pt-4">
                            <Skeleton className="h-5 w-16" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </CardContent>
                </Card>
              ))
            ) : (
              ideas.map((idea) => {
                const isTaken = takenIdeas.has(idea.id);
                return (
                  <Card
                    key={idea.id}
                    className={cn(
                      'flex flex-col transition-all duration-300 ease-in-out cursor-pointer',
                      isTaken
                        ? 'bg-muted/50 filter grayscale pointer-events-auto'
                        : 'hover:shadow-2xl hover:-translate-y-2'
                    )}
                    onClick={() => handleCardClick(idea)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-start gap-3">
                        {isTaken ? (
                          <Lock className="h-6 w-6 mt-1 text-destructive flex-shrink-0" />
                        ) : (
                          <Lightbulb className="h-6 w-6 mt-1 text-accent flex-shrink-0" />
                        )}
                        <span>{idea.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground">{idea.description}</p>
                    </CardContent>
                    <CardContent>
                      <h4 className="font-semibold text-sm mb-3">
                        Suggested Tech:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {idea.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>

      {selectedIdea && (
        <Dialog
          open={!!selectedIdea}
          onOpenChange={(open) => !open && setSelectedIdea(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">
                {selectedIdea.title}
              </DialogTitle>
              <DialogDescription className="pt-2">
                {selectedIdea.description}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <h4 className="font-semibold text-sm">Suggested Tech:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedIdea.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleTakeIdea}>
                <Send className="mr-2 h-4 w-4" />
                Take this Project Idea
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={showTakenAlert} onOpenChange={setShowTakenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Idea Already Taken</AlertDialogTitle>
            <AlertDialogDescription>
              This project idea has already been chosen by another team. Please select a different one.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowTakenAlert(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
