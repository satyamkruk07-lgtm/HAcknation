'use client';

import { useState } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, doc, deleteDoc, setDoc } from 'firebase/firestore';
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
import { ExternalLink, Github, Loader2, PlusCircle, Trash2, Edit } from 'lucide-react';
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
import type { UserAccount, SubmittedProject, ScheduleEvent } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';

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
      <Card>
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
    <Card>
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
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('submissionDate', 'desc'));
  }, [firestore]);

  const { data: projects, isLoading } = useCollection<SubmittedProject>(projectsQuery);

  return (
    <Card>
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
              <TableHead className="text-right">Links</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : projects && projects.length > 0 ? (
              projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{(project.teamMembers || project.studentNames || []).join(', ')}</TableCell>
                  <TableCell>
                    {project.submissionDate
                      ? format(new Date(project.submissionDate.seconds * 1000), 'PPp')
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild variant="outline" size="icon">
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /></a>
                    </Button>
                    <Button asChild variant="outline" size="icon">
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No projects submitted yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


function ScheduleManagementTab() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const scheduleQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'schedule'), orderBy('sortTime', 'asc'));
  }, [firestore]);

  const { data: schedule, isLoading, error } = useCollection<ScheduleEvent>(scheduleQuery);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<ScheduleEvent> | null>(null);

  const handleAddNew = () => {
    setCurrentEvent({});
    setIsDialogOpen(true);
  };
  
  const handleEdit = (event: ScheduleEvent) => {
    setCurrentEvent(event);
    setIsDialogOpen(true);
  };
  
  const handleDelete = async (eventId: string) => {
    if (!firestore || !window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteDoc(doc(firestore, 'schedule', eventId));
      toast({ title: 'Event Deleted', description: 'The schedule has been updated.' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error deleting event', description: e.message });
    }
  };

  const createSortableTime = (timeStr: string): string => {
    if (!timeStr) return '';
    
    const parts = timeStr.toLowerCase().split(' - ');
    if (parts.length < 2) return timeStr; // Fallback for invalid format

    const dayPart = parts[0]; // "day 1" or "day 2"
    const timePart = parts[1]; // "hh:mm am/pm"

    const dayNumber = dayPart.includes('1') ? '1' : '2';

    let [time, modifier] = timePart.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (modifier === 'pm') {
        hours = (parseInt(hours, 10) + 12).toString();
    }

    return `day${dayNumber}-${hours.padStart(2, '0')}${minutes}`;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firestore || !currentEvent || !currentEvent.time) return;

    setIsSubmitting(true);
    
    const sortTime = createSortableTime(currentEvent.time);

    const eventData: Partial<ScheduleEvent> = {
        time: currentEvent.time,
        title: currentEvent.title,
        description: currentEvent.description,
        speaker: currentEvent.speaker || null,
        sortTime: sortTime,
        type: currentEvent.type || 'default',
    };

    try {
        if (currentEvent.id) {
            // Update existing event
            const eventRef = doc(firestore, 'schedule', currentEvent.id);
            await setDoc(eventRef, eventData, { merge: true });
            toast({ title: 'Event Updated', description: 'The schedule has been successfully updated.' });
        } else {
            // Create new event
            await addDoc(collection(firestore, 'schedule'), eventData);
            toast({ title: 'Event Added', description: 'A new event has been added to the schedule.' });
        }
        setIsDialogOpen(false);
        setCurrentEvent(null);
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Operation Failed',
            description: error.message || 'An unknown error occurred.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Schedule Management</CardTitle>
          <CardDescription>View, add, edit, or delete schedule events.</CardDescription>
        </div>
        <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Add Event</Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Speaker</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : schedule && schedule.length > 0 ? (
              schedule.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.time}</TableCell>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>{event.speaker || 'N/A'}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(event)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(event.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        {error ? `Error: ${error.message}` : 'No schedule events found. Click "Add Event" to create one.'}
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentEvent?.id ? 'Edit Event' : 'Add New Event'}</DialogTitle>
              <DialogDescription>
                Fill in the details for the schedule item.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4 py-4">
                <div>
                    <Label htmlFor="event-time">Time</Label>
                    <Input id="event-time" value={currentEvent?.time || ''} onChange={(e) => setCurrentEvent({...currentEvent, time: e.target.value})} placeholder="e.g., Day 1 - 09:00 AM" required />
                </div>
                <div>
                    <Label htmlFor="event-title">Title</Label>
                    <Input id="event-title" value={currentEvent?.title || ''} onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})} placeholder="e.g., Opening Ceremony" required />
                </div>
                <div>
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea id="event-description" value={currentEvent?.description || ''} onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})} placeholder="Describe the event" required />
                </div>
                <div>
                    <Label htmlFor="event-speaker">Speaker (Optional)</Label>
                    <Input id="event-speaker" value={currentEvent?.speaker || ''} onChange={(e) => setCurrentEvent({...currentEvent, speaker: e.target.value})} placeholder="e.g., Jane Doe" />
                </div>
                 <div>
                    <Label htmlFor="event-type">Type (Optional)</Label>
                     <Input id="event-type" value={currentEvent?.type || ''} onChange={(e) => setCurrentEvent({...currentEvent, type: e.target.value as any})} placeholder="e.g., workshop, talk, milestone" />
                     <p className='text-xs text-muted-foreground'>Use keywords like: milestone, workshop, talk, social, flag, code, coffee, megaphone, presentation, trophy.</p>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {currentEvent?.id ? 'Save Changes' : 'Create Event'}
                    </Button>
                </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </Card>
  );
}

export default function AdminPage() {
  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your HackNation event from here.
        </p>
      </div>

      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="announcements" className="mt-6">
          <CreateAnnouncementForm />
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <UserManagementTab />
        </TabsContent>
        <TabsContent value="schedule" className="mt-6">
           <ScheduleManagementTab />
        </TabsContent>
        <TabsContent value="projects" className="mt-6">
          <ProjectManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
