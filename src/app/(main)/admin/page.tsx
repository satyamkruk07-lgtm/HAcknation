'use client';

import { useState } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Github, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { UserAccount, SubmittedProject } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

function CreateAnnouncementForm() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'Info' | 'Update'>('Info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to create an announcement.',
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
      const announcementsCollection = collection(firestore, 'announcements');
      await addDoc(announcementsCollection, {
        title,
        content,
        type,
        timestamp: serverTimestamp(),
      });

      toast({
        title: 'Announcement Created!',
        description: 'The new announcement has been published.',
      });

      setTitle('');
      setContent('');
      setType('Info');
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

  return (
    <form onSubmit={handleSubmit}>
      <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Create Announcement
          </CardTitle>
          <CardDescription>
            Publish a new announcement to all participants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Workshop Location Change"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Describe the announcement in detail."
                className="min-h-[120px]"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                onValueChange={(value: 'Info' | 'Update') => setType(value)}
                defaultValue={type}
              >
                <SelectTrigger id="type" className="w-[180px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Info">Info</SelectItem>
                  <SelectItem value="Update">Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSubmitting ? 'Publishing...' : 'Publish Announcement'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

function UserManagementTab() {
  const firestore = useFirestore();
  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('registrationDate', 'desc'));
  }, [firestore]);

  const { data: users, isLoading } = useCollection<UserAccount>(usersQuery);

  return (
    <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">User Management</CardTitle>
        <CardDescription>View and manage registered users.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Registered On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.registrationDate
                      ? format(new Date(user.registrationDate), 'PP')
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ProjectManagementTab() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [projectToDelete, setProjectToDelete] = useState<SubmittedProject | null>(null);

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('submissionDate', 'desc'));
  }, [firestore]);

  const { data: projects, isLoading, error } = useCollection<SubmittedProject>(projectsQuery);

  const handleDeleteProject = async () => {
    if (!firestore || !projectToDelete) return;

    try {
      await deleteDoc(doc(firestore, 'projects', projectToDelete.id));
      toast({
        title: 'Project Deleted',
        description: `"${projectToDelete.name}" has been removed.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: error.message || 'An unknown error occurred.',
      });
    } finally {
      setProjectToDelete(null);
    }
  };


  return (
    <>
      <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
          <CardDescription>View and manage all project submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Submitted On</TableHead>
                <TableHead>Links</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : projects && projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{(project.studentNames || project.teamMembers || []).join(', ')}</TableCell>
                    <TableCell>
                      {project.submissionDate
                        ? format(new Date(project.submissionDate.seconds * 1000), 'PPp')
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button asChild variant="outline" size="icon">
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /></a>
                      </Button>
                      <Button asChild variant="outline" size="icon">
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                      </Button>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button variant="destructive" size="icon" onClick={() => setProjectToDelete(project)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No projects submitted yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              "{projectToDelete?.name}" from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive hover:bg-destructive/90">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function AdminPage() {
  return (
    <div className="bg-muted/40 min-h-[calc(100vh-3.5rem)]">
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="font-headline text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your HackNation event from here.
          </p>
        </div>

        <Tabs defaultValue="announcements" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-background/50 border shadow-inner">
            <TabsTrigger value="announcements" className="data-[state=active]:shadow-inner">Announcements</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:shadow-inner">Users</TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:shadow-inner">Projects</TabsTrigger>
          </TabsList>
          <TabsContent value="announcements" className="mt-6">
            <CreateAnnouncementForm />
          </TabsContent>
          <TabsContent value="users" className="mt-6">
            <UserManagementTab />
          </TabsContent>
          <TabsContent value="projects" className="mt-6">
            <ProjectManagementTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
