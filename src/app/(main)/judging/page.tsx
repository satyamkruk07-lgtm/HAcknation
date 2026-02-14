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
import { ArrowRight, Github, QrCode } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useAuth, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { SubmittedProject } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { signInAnonymously } from 'firebase/auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import QRCode from 'qrcode.react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';


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

function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Ensure this runs only on the client
    // Constructing a "clean" public URL without any session-specific query params.
    const publicUrl = window.location.origin + window.location.pathname;
    setUrl(publicUrl);
  }, []);

  const copyToClipboard = () => {
    // Uses the state 'url' which is the clean public URL.
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: 'URL Copied!', description: 'The judging page URL has been copied to your clipboard.' });
    }, (err) => {
      toast({ variant: 'destructive', title: 'Copy Failed', description: 'Could not copy URL to clipboard.' });
    });
  };

  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <QrCode className="mr-2 h-4 w-4" />
          Generate QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scan to Judge</DialogTitle>
          <DialogDescription>
            Judges can scan this QR code with their mobile devices to open the judging dashboard directly.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4 gap-4">
          <div className="p-4 bg-white rounded-lg border">
            <QRCode value={url} size={256} />
          </div>
          <p className="text-sm text-muted-foreground">Or share the URL below:</p>
          <div className="flex w-full items-center space-x-2">
            <Input value={url} readOnly />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default function JudgingPage() {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // This effect ensures that any visitor to this page who is not already
    // logged in will be seamlessly signed in as an anonymous user. This is crucial
    // for judges who access the page via a QR code.
    if (auth && !isUserLoading && !user) {
      signInAnonymously(auth).catch((error) => {
        // This is a critical error to log if it happens.
        console.error("Critical: Anonymous sign-in failed for judging page:", error);
      });
    }
  }, [auth, isUserLoading, user]);

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('submissionDate', 'desc'));
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<SubmittedProject>(projectsQuery);

  const isContentLoading = isLoading || isUserLoading;

  return (
    <div className="container py-12">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Judging Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Review submissions and provide your feedback.
        </p>
      </div>

       <div className="mb-8 flex justify-center">
           <QRCodeGenerator />
       </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isContentLoading ? (
            Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)
        ) : projects && projects.length > 0 ? (
            projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
                <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>
                    by {(project.teamName || project.teamMembers || project.studentNames || []).join(', ')}
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
