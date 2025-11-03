'use client';

import { useState, useEffect, useRef } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase, useStorage } from '@/firebase';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { collection, addDoc, serverTimestamp, query, orderBy, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
import { ExternalLink, Github, Loader2, Trash2, User as UserIcon, Download, CheckCircle, XCircle, Upload } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { makeAdminAction, removeAdminAction } from '@/lib/actions';
import { useDoc } from '@/firebase/firestore/use-doc';

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
  const { user, isUserLoading } = useUser();
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null; // Only create query if user is an admin
    return query(collection(firestore, 'users'), orderBy('registrationDate', 'desc'));
  }, [firestore, isAdmin]);

  const { data: users, isLoading: isUsersLoading } = useCollection<UserAccount>(usersQuery);
  const isLoading = isUserLoading || isAdminLoading || isUsersLoading;

  const downloadCSV = (data: UserAccount[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data to download.');
      return;
    }
    const headers = ['Name', 'Email', 'College', 'Registration Date', 'Skills', 'Bio', 'Email Verified'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        `"${item.name || ''}"`,
        `"${item.email || ''}"`,
        `"${item.college || ''}"`,
        `"${item.registrationDate ? format(new Date(item.registrationDate), 'PPp') : ''}"`,
        `"${(item.skills || []).join('; ')}"`,
        `"${(item.bio || '').replace(/"/g, '""')}"`,
        `"${item.emailVerified ? 'Yes' : 'No'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const adminEmails = ['kalyanikri1111@gmail.com', 'frgtpeople@gmail.com'];

  return (
    <>
      <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">User Management</CardTitle>
            <CardDescription>View and manage registered users.</CardDescription>
          </div>
          <Button onClick={() => downloadCSV(users || [], 'users.csv')} disabled={!users || users.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
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
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : users && users.length > 0 ? (
                users.map((user) => {
                  const isVerified = user.emailVerified || (user.email && adminEmails.includes(user.email));
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {isVerified ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                            <XCircle className="mr-1 h-3 w-3" />
                            Unverified
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.registrationDate
                          ? format(new Date(user.registrationDate), 'PP')
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {!isAdmin && !isUserLoading ? "You don't have permission to view users." : "No users found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={selectedUser.photoURL || `https://picsum.photos/seed/${selectedUser.id}/200/200`}
                    alt={selectedUser.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                    data-ai-hint="person portrait"
                  />
                  <div>
                    <DialogTitle className="text-2xl">{selectedUser.name}</DialogTitle>
                    <DialogDescription>{selectedUser.email}</DialogDescription>
                  </div>
              </div>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="col-span-3">
                    {selectedUser.emailVerified ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                           <XCircle className="mr-1 h-3 w-3" />
                          Unverified
                        </Badge>
                      )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">College</Label>
                <span className="col-span-3">{selectedUser.college || 'Not provided'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Registered</Label>
                <span className="col-span-3">
                    {selectedUser.registrationDate ? format(new Date(selectedUser.registrationDate), 'PPP') : 'N/A'}
                </span>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                 <Label className="text-right mt-1">Bio</Label>
                 <p className="col-span-3 text-sm text-muted-foreground">{selectedUser.bio || 'Not provided'}</p>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right mt-1">Skills</Label>
                <div className="col-span-3 flex flex-wrap gap-2">
                  {(selectedUser.skills && selectedUser.skills.length > 0) ? (
                    selectedUser.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)
                  ) : (
                    <span className="text-sm text-muted-foreground">No skills listed</span>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
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

  const downloadCSV = (data: SubmittedProject[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data to download.');
      return;
    }
    const headers = ['Project Name', 'Team Members', 'Description', 'GitHub URL', 'Demo URL', 'Submission Date'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        `"${item.name || ''}"`,
        `"${(item.teamMembers || item.studentNames || []).join('; ')}"`,
        `"${(item.description || '').replace(/"/g, '""')}"`,
        `"${item.githubUrl || ''}"`,
        `"${item.demoUrl || ''}"`,
        `"${item.submissionDate ? format(new Date(item.submissionDate.seconds * 1000), 'PPp') : ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <>
      <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Project Management</CardTitle>
            <CardDescription>View and manage all project submissions.</CardDescription>
          </div>
           <Button onClick={() => downloadCSV(projects || [], 'projects.csv')} disabled={!projects || projects.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
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
  const { user, isUserLoading } = useUser();
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const router = useRouter();

  const isLoading = isUserLoading || isAdminLoading;

  useEffect(() => {
    // Only perform actions once everything has loaded
    if (isLoading) {
      return; // Wait until loading is complete
    }

    // If there's no user, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // If there is a user but they are not an admin, redirect to dashboard
    if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [user, isAdmin, isLoading, router]);

  // Show a unified loader while we are determining the user's auth and admin status.
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If after loading, the user is not an admin, render nothing.
  // The useEffect above will handle the redirection.
  if (!isAdmin) {
    return null;
  }
  
  // Only render the admin content if the user is confirmed to be an admin.
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
