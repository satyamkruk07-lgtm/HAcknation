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
import { ArrowRight, Github, QrCode, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useAuth, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { SubmittedProject } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { useAdminStatus } from '@/hooks/useAdminStatus';


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
            <CardFooter className="flex justify-end">
                <Skeleton className="h-9 w-32" />
            </CardFooter>
        </Card>
    )
}

function QRCodeGenerator() {
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const publicUrl = `${window.location.origin}/judging`;
      setUrl(publicUrl);
    }
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

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return query(collection(firestore, 'projects'), orderBy('submissionDate', 'desc'));
  }, [firestore, isAdmin]);

  const { data: projects, isLoading: areProjectsLoading } = useCollection<SubmittedProject>(projectsQuery);

  const isContentLoading = areProjectsLoading || isLoading;
  
  if (isContentLoading || !isAdmin) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

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
                <CardFooter className="flex justify-end">
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
