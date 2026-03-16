'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { collection, addDoc, serverTimestamp, query, orderBy, doc, deleteDoc, where, getDocs, limit, startAfter, type QueryDocumentSnapshot, updateDoc } from 'firebase/firestore';
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
import { ExternalLink, Github, Loader2, Trash2, Download, Trophy, Eye, Star, UserX, FileText } from 'lucide-react';
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
import type { UserAccount, SubmittedProject, Judgment } from '@/lib/types';
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
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

function toDateSafe(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;

  // Firestore Timestamp (has toDate)
  if (typeof value === 'object' && value !== null && 'toDate' in value) {
    const maybe = value as { toDate?: () => Date };
    if (typeof maybe.toDate === 'function') return maybe.toDate();
  }

  // Timestamp-like object
  if (typeof value === 'object' && value !== null && 'seconds' in value) {
    const maybe = value as { seconds?: number };
    if (typeof maybe.seconds === 'number') return new Date(maybe.seconds * 1000);
  }

  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  return null;
}


function CreateAnnouncementForm() {
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'Info' | 'Update'>('Info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/login');
      return;
    }

    if (!firestore) {
      return;
    }

    setIsSubmitting(true);
    const announcementsCollection = collection(firestore, 'announcements');
    const data = {
        title,
        content,
        type,
        timestamp: serverTimestamp(),
    };

    addDoc(announcementsCollection, data)
        .then(() => {
            setTitle('');
            setContent('');
            setType('Info');
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: 'announcements', // or announcementsCollection.path
                operation: 'create',
                requestResourceData: data,
            });
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
            setIsSubmitting(false);
        });
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

function ParticipantManagementTab() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user: authUser, isUserLoading } = useUser();
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserAccount | null>(null);
  
  // Pagination State
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [lastVisibleUser, setLastVisibleUser] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  // For loading more users on button click
  const loadMoreUsers = useCallback(async () => {
    if (!firestore || !hasMoreUsers) return;
    
    setIsLoadingUsers(true);

    let q = query(collection(firestore, 'users'), orderBy('registrationDate', 'desc'), limit(10));
    if(lastVisibleUser) {
        q = query(q, startAfter(lastVisibleUser))
    }

    try {
      const querySnapshot = await getDocs(q);
      const newUsers = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as UserAccount));
      
      setUsers(prev => lastVisibleUser ? [...prev, ...newUsers] : newUsers);
      
      if (querySnapshot.docs.length < 10) {
        setHasMoreUsers(false);
      } else {
        setLastVisibleUser(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
    } catch(err) {
        const code = (err as any)?.code as string | undefined;
        const message = (err as any)?.message as string | undefined;

        // Firestore frequently throws "failed-precondition" when an index is missing.
        if (code === 'failed-precondition' || (typeof message === 'string' && message.toLowerCase().includes('index'))) {
          toast({
            title: 'Firestore index required',
            description: 'This query needs an index (users ordered by registrationDate). Open the Firebase console link shown in the error details to create the index, then refresh.',
            variant: 'destructive',
          });
          setHasMoreUsers(false);
          return;
        }

        if (code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
              path: 'users',
              operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          return;
        }

        toast({
          title: 'Failed to load users',
          description: typeof message === 'string' ? message : 'Unknown error',
          variant: 'destructive',
        });
    } finally {
      setIsLoadingUsers(false);
    }
  }, [firestore, hasMoreUsers, lastVisibleUser, toast]);
  
  // For the initial load of users
  useEffect(() => {
    if (isAdmin && firestore && users.length === 0) {
      loadMoreUsers();
    } else if (!isAdminLoading && !isAdmin) {
      setUsers([]);
      setIsLoadingUsers(false);
    }
  }, [isAdmin, isAdminLoading, firestore, loadMoreUsers, users.length]);

  const handleDeleteUser = () => {
    if (!firestore || !userToDelete) return;
    setIsDeleting(true);

    const userDocRef = doc(firestore, 'users', userToDelete.id);
    deleteDoc(userDocRef)
        .then(() => {
            setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
            toast({ title: "User Deleted", description: "The user account has been removed from Firestore." });
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => {
            setIsDeleting(false);
            setUserToDelete(null);
        });
  };

  const downloadCSV = (data: UserAccount[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data to download.');
      return;
    }
    const headers = ['Name', 'Team Name', 'Leader Name', 'Team Members', 'Mentor Name', 'Email', 'College', 'Contact No.', 'Skills', 'Bio', 'Registered On'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        `"${item.name || ''}"`,
        `"${item.teamName || ''}"`,
        `"${item.leaderName || ''}"`,
        `"${(item.teamMembers || []).join('; ')}"`,
        `"${item.mentorName || ''}"`,
        `"${item.email || ''}"`,
        `"${item.college || ''}"`,
        `"${item.phoneNumber || ''}"`,
        `"${(item.skills || []).join('; ')}"`,
        `"${(item.bio || '').replace(/"/g, '""')}"`,
        `"${(() => {
          const d = toDateSafe((item as any).registrationDate);
          return d ? format(d, 'PPp') : '';
        })()}"`,
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
  
  const showSkeletons = isLoadingUsers && users.length === 0;

  return (
    <>
      <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Participant Management</CardTitle>
            <CardDescription>View and manage registered participants.</CardDescription>
          </div>
          <Button onClick={() => downloadCSV(users || [], 'participants.csv')} disabled={!users || users.length === 0}>
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
                <TableHead>Registered On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showSkeletons ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="text-right space-x-2">
                        <Skeleton className="h-8 w-20 ml-auto inline-block" />
                        <Skeleton className="h-8 w-8 ml-auto inline-block" />
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length > 0 ? (
                users.map((user) => {
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {(() => {
                          const d = toDateSafe((user as any).registrationDate);
                          return d ? format(d, 'PP') : 'N/A';
                        })()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                          View Details
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => setUserToDelete(user)}>
                            <UserX className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    {!isAdmin && !isUserLoading ? "You don't have permission to view participants." : "No participants found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {hasMoreUsers && (
            <div className="mt-6 flex justify-center">
              <Button onClick={loadMoreUsers} disabled={isLoadingUsers}>
                {isLoadingUsers && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Load More
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="sm:max-w-md">
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
            <div className="grid gap-4 py-2 text-sm">
               <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-semibold">Contact No.</Label>
                <span className="col-span-2">{selectedUser.phoneNumber || 'Not provided'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-semibold">College</Label>
                <span className="col-span-2">{selectedUser.college || 'Not provided'}</span>
              </div>
               <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-semibold">Department</Label>
                <span className="col-span-2">{selectedUser.department || 'Not provided'}</span>
              </div>
               <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-semibold">Mentor</Label>
                <span className="col-span-2">{selectedUser.mentorName || 'Not provided'}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="text-right font-semibold">Registered</Label>
                <span className="col-span-2">
                    {(() => {
                      const d = toDateSafe((selectedUser as any).registrationDate);
                      return d ? format(d, 'PPP') : 'N/A';
                    })()}
                </span>
              </div>
              <div className="grid grid-cols-3 items-start gap-4">
                 <Label className="text-right font-semibold mt-1">Bio</Label>
                 <p className="col-span-2 text-muted-foreground">{selectedUser.bio || 'Not provided'}</p>
              </div>
              <div className="grid grid-cols-3 items-start gap-4">
                <Label className="text-right font-semibold mt-1">Skills</Label>
                <div className="col-span-2 flex flex-wrap gap-2">
                  {(selectedUser.skills && selectedUser.skills.length > 0) ? (
                    selectedUser.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)
                  ) : (
                    <span className="text-muted-foreground">No skills listed</span>
                  )}
                </div>
              </div>

               {selectedUser.registrationType === 'team' && (
                <>
                    <div className="my-2 border-t"></div>
                    <h4 className="font-semibold text-center col-span-full">Team Details</h4>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label className="text-right font-semibold">Team Name</Label>
                        <span className="col-span-2">{selectedUser.teamName || 'Not provided'}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                        <Label className="text-right font-semibold">Leader</Label>
                        <span className="col-span-2">{selectedUser.leaderName || 'Not provided'}</span>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-4">
                        <Label className="text-right font-semibold mt-1">Members</Label>
                        <div className="col-span-2 flex flex-wrap gap-2">
                        {(selectedUser.teamMembers && selectedUser.teamMembers.length > 0) ? (
                            selectedUser.teamMembers.map(member => <Badge key={member} variant="outline">{member}</Badge>)
                        ) : (
                            <span className="text-muted-foreground">No members listed</span>
                        )}
                        </div>
                    </div>
                </>
            )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user <strong className='text-foreground'>{userToDelete?.name}</strong> from Firestore. It will NOT delete their authentication record. They will need to be deleted from the Firebase Authentication console separately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete from Firestore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function PlanManagementTab() {
  const firestore = useFirestore();
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firestore) return;
    setIsLoading(true);
    const usersCollection = collection(firestore, 'users');
    const q = query(usersCollection, orderBy('registrationDate', 'desc'));

    getDocs(q)
      .then((querySnapshot) => {
        const usersData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as UserAccount));
        setUsers(usersData);
      })
      .catch((err) => {
        const permissionError = new FirestorePermissionError({
          path: 'users',
          operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [firestore]);

  const downloadCSV = (data: UserAccount[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data to download.');
      return;
    }
    const headers = ['Name', 'Email', 'College', 'Team Name', 'Plan'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        `"${item.name || ''}"`,
        `"${item.email || ''}"`,
        `"${item.college || ''}"`,
        `"${item.teamName || ''}"`,
        `"${item.plan ? (item.plan === 'with-kit' ? 'With Kit' : 'Without Kit') : 'N/A'}"`
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
    <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-headline text-2xl">Registration Plans</CardTitle>
          <CardDescription>View which plan each participant has chosen.</CardDescription>
        </div>
        <Button onClick={() => downloadCSV(users, 'participant-plans.csv')} disabled={users.length === 0}>
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
              <TableHead>Team Name</TableHead>
              <TableHead>Plan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                </TableRow>
              ))
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.teamName || 'N/A'}</TableCell>
                  <TableCell>
                    {user.plan ? (
                      <Badge variant={user.plan === 'with-kit' ? 'default' : 'secondary'}>
                        {user.plan === 'with-kit' ? 'With Kit' : 'Without Kit'}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No participant data found.
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
  const [projectToDelete, setProjectToDelete] = useState<SubmittedProject | null>(null);

  // Pagination state
  const [projects, setProjects] = useState<SubmittedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisibleProject, setLastVisibleProject] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMoreProjects, setHasMoreProjects] = useState(true);

  const loadMoreProjects = useCallback(async () => {
    if (!firestore || !hasMoreProjects) return;
    setIsLoading(true);

    let q = query(collection(firestore, 'projects'), orderBy('submissionDate', 'desc'), limit(10));
    if (lastVisibleProject) {
      q = query(q, startAfter(lastVisibleProject));
    }

    try {
      const querySnapshot = await getDocs(q);
      const newProjects = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as SubmittedProject));
      
      setProjects(prev => lastVisibleProject ? [...prev, ...newProjects] : newProjects);
      
      if (querySnapshot.docs.length < 10) {
        setHasMoreProjects(false);
      } else {
        setLastVisibleProject(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
    } catch(err) {
        const permissionError = new FirestorePermissionError({
            path: 'projects',
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
    } finally {
      setIsLoading(false);
    }
  }, [firestore, hasMoreProjects, lastVisibleProject]);

  useEffect(() => {
    if(projects.length === 0) {
      loadMoreProjects();
    }
  }, [loadMoreProjects, projects.length]);

  const handleDeleteProject = () => {
    if (!firestore || !projectToDelete) return;

    const docRef = doc(firestore, 'projects', projectToDelete.id);
    deleteDoc(docRef)
        .then(() => {
          setProjects(prev => prev.filter(p => p.id !== projectToDelete.id));
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        });

    setProjectToDelete(null);
  };

  const downloadCSV = (data: SubmittedProject[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data to download.');
      return;
    }
    const headers = ['Project Name', 'Team', 'Description', 'Demo URL', 'Submission Date'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        `"${item.name || ''}"`,
        `"${item.teamName || (item.teamMembers || item.studentNames || []).join('; ')}"`,
        `"${(item.description || '').replace(/"/g, '""')}"`,
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
  
  const showSkeletons = isLoading && projects.length === 0;

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
              {showSkeletons ? (
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
                    <TableCell>{project.teamName || (project.studentNames || project.teamMembers || []).join(', ')}</TableCell>
                    <TableCell>
                      {project.submissionDate
                        ? format(new Date(project.submissionDate.seconds * 1000), 'PPp')
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button asChild variant="outline" size="icon" disabled={!project.demoUrl}>
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"><FileText className="h-4 w-4" /></a>
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
           {hasMoreProjects && (
            <div className="mt-6 flex justify-center">
              <Button onClick={loadMoreProjects} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Load More
              </Button>
            </div>
          )}
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

interface ProjectJudgments {
  judgments: Judgment[];
  totalScore: number;
  count: number;
}

function useProjectJudgments(projectId: string): { judgments: Judgment[] | null; isLoading: boolean, mutate: () => void } {
  const firestore = useFirestore();
  const judgmentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'judgments'), where('projectId', '==', projectId));
  }, [firestore, projectId]);

  const [judgments, setJudgments] = useState<Judgment[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJudgments = useCallback(async () => {
    if(!judgmentsQuery) return;
    setIsLoading(true);
    try {
      const snapshot = await getDocs(judgmentsQuery);
      const data = snapshot.docs.map(doc => ({...doc.data() as Judgment, id: doc.id}));
      setJudgments(data);
    } catch(err) {
      const permissionError = new FirestorePermissionError({
        path: 'judgments',
        operation: 'list',
      });
      errorEmitter.emit('permission-error', permissionError);
    } finally {
      setIsLoading(false);
    }
  }, [judgmentsQuery]);

  useEffect(() => {
    fetchJudgments();
  }, [fetchJudgments]);

  return { judgments, isLoading, mutate: fetchJudgments };
}


function JudgingTab() {
    const firestore = useFirestore();

    const [projects, setProjects] = useState<SubmittedProject[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);
    const [lastVisibleProject, setLastVisibleProject] = useState<QueryDocumentSnapshot | null>(null);
    const [hasMoreProjects, setHasMoreProjects] = useState(true);

    const [allJudgments, setAllJudgments] = useState<Judgment[] | null>(null);
    const [isLoadingJudgments, setIsLoadingJudgments] = useState(true);

    const [selectedProject, setSelectedProject] = useState<SubmittedProject | null>(null);

    const loadMoreProjects = useCallback(async () => {
      if (!firestore) return;
      setIsLoadingProjects(true);

      let q = query(collection(firestore, 'projects'), orderBy('submissionDate', 'desc'));
      
      try {
        const querySnapshot = await getDocs(q);
        const newProjects = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as SubmittedProject));
        setProjects(newProjects);
      } catch(err) {
        const permissionError = new FirestorePermissionError({
            path: 'projects',
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
      } 
      finally { setIsLoadingProjects(false); }
    }, [firestore]);

    const fetchAllJudgments = useCallback(async () => {
      if (!firestore) return;
      setIsLoadingJudgments(true);
      try {
        const querySnapshot = await getDocs(collection(firestore, 'judgments'));
        const judgmentsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Judgment));
        setAllJudgments(judgmentsData);
      } catch(err) {
        const permissionError = new FirestorePermissionError({
            path: 'judgments',
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
      finally { setIsLoadingJudgments(false); }
    }, [firestore]);

    useEffect(() => {
      loadMoreProjects();
      fetchAllJudgments();
    }, [loadMoreProjects, fetchAllJudgments]);

    const projectJudgments = useMemo(() => {
        if (!allJudgments) return new Map<string, ProjectJudgments>();

        const judgmentMap = new Map<string, ProjectJudgments>();

        for (const judgment of allJudgments) {
            if (!judgmentMap.has(judgment.projectId)) {
                judgmentMap.set(judgment.projectId, { judgments: [], totalScore: 0, count: 0 });
            }
            const projectData = judgmentMap.get(judgment.projectId)!;
            projectData.judgments.push(judgment);
        }
        
        for (const [, data] of judgmentMap.entries()) {
            const grandTotalScore = data.judgments.reduce((acc, j) => acc + (j.totalScore || 0), 0);
            data.count = data.judgments.length;
            data.totalScore = grandTotalScore;
        }
        
        return judgmentMap;

    }, [allJudgments]);
    
    const isLoading = isLoadingProjects || isLoadingJudgments;

    const onJudgmentDeleted = () => {
      // Re-fetch judgments to update the UI
      fetchAllJudgments();
    };

    return (
        <>
            <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Judging Results</CardTitle>
                    <CardDescription>View scores and feedback for all submitted projects.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Project Name</TableHead>
                                <TableHead className="text-center">Judges</TableHead>
                                <TableHead className="text-center">Total Score</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-16 mx-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-24 mx-auto" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : projects && projects.length > 0 ? (
                                projects.map((project) => {
                                    const judgments = projectJudgments.get(project.id);
                                    return (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium">{project.name}</TableCell>
                                            <TableCell className="text-center">{judgments?.count || 0}</TableCell>
                                            <TableCell className="text-center font-semibold text-primary">
                                                {judgments ? judgments.totalScore : 'N/A'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)} disabled={!judgments}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Scores
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No projects submitted yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {selectedProject && (
                <JudgmentDetailsDialog
                    project={selectedProject}
                    onOpenChange={() => setSelectedProject(null)}
                    onJudgmentDeleted={onJudgmentDeleted}
                />
            )}
        </>
    );
}

function JudgmentDetailsDialog({ project, onOpenChange, onJudgmentDeleted }: { project: SubmittedProject, onOpenChange: (open: boolean) => void, onJudgmentDeleted: () => void }) {
    const { judgments, isLoading, mutate } = useProjectJudgments(project.id);
    const firestore = useFirestore();
    const [judgmentToDelete, setJudgmentToDelete] = useState<Judgment | null>(null);

    const handleDeleteJudgment = () => {
        if (!firestore || !judgmentToDelete) return;
        const docRef = doc(firestore, "judgments", judgmentToDelete.id);

        deleteDoc(docRef)
            .then(() => {
                mutate(); // Re-fetch judgments for this project
                onJudgmentDeleted(); // Re-fetch all judgments in the parent
            })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: docRef.path,
                    operation: 'delete',
                });
                errorEmitter.emit('permission-error', permissionError);
            });
        
        setJudgmentToDelete(null);
    };

    return (
        <>
            <Dialog open={!!project} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-headline">{project.name}</DialogTitle>
                        <DialogDescription>
                            Detailed scores and feedback from all judges.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 max-h-[60vh] overflow-y-auto">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : judgments && judgments.length > 0 ? (
                            <div className="space-y-6">
                                {judgments.map((judgment) => (
                                    <Card key={judgment.id}>
                                        <CardHeader>
                                            <CardTitle className="text-lg flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span>Judge: {judgment.judgeName || 'Anonymous'}</span>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:bg-destructive/10 hover:text-destructive" onClick={() => setJudgmentToDelete(judgment)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <Badge variant="secondary" className="flex items-center gap-1.5">
                                                    <Star className="h-4 w-4 text-amber-400" />
                                                    {judgment.totalScore} / 200
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm italic text-muted-foreground p-4 bg-muted/50 rounded-md">"{judgment.feedback}"</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">No judgments submitted for this project yet.</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
            <AlertDialog open={!!judgmentToDelete} onOpenChange={(open) => !open && setJudgmentToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the judgment for this project submitted by <strong>{judgmentToDelete?.judgeName || 'Anonymous'}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteJudgment} className="bg-destructive hover:bg-destructive/90">
                            Delete
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
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, isAdmin, isLoading, router]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user && isAdmin) {
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
            <TabsList className="grid w-full grid-cols-5 bg-background/50 border shadow-inner">
              <TabsTrigger value="announcements" className="data-[state=active]:shadow-inner">Announcements</TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:shadow-inner">Participants</TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:shadow-inner">Projects</TabsTrigger>
              <TabsTrigger value="judging" className="data-[state=active]:shadow-inner">Judging</TabsTrigger>
              <TabsTrigger value="plans" className="data-[state=active]:shadow-inner">Plans</TabsTrigger>
            </TabsList>
            <TabsContent value="announcements" className="mt-6">
              <CreateAnnouncementForm />
            </TabsContent>
            <TabsContent value="users" className="mt-6">
              <ParticipantManagementTab />
            </TabsContent>
            <TabsContent value="projects" className="mt-6">
              <ProjectManagementTab />
            </TabsContent>
            <TabsContent value="judging" className="mt-6">
                <JudgingTab />
            </TabsContent>
             <TabsContent value="plans" className="mt-6">
                <PlanManagementTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return null;
}
