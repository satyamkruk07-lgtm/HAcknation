'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser, useFirestore, useMemoFirebase, useStorage } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useUserAndMutate } from '@/firebase/provider';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Cpu, Upload } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { UserAccount } from '@/lib/types';
import { updateProfile } from 'firebase/auth';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  college: z.string().min(1, 'College/University is required'),
  mentorName: z.string().min(1, 'Mentor name is required'),
  department: z.string().min(1, 'Department is required'),
  skills: z.string().min(1, 'Skills are required'),
  bio: z.string().min(1, 'A short bio is required'),
  phoneNumber: z.string().min(1, 'Phone number is required').refine(
    (val) => /^\d{10}$/.test(val),
    {
      message: 'Phone number must be 10 digits.',
    }
  ),
  registrationType: z.enum(['individual', 'team'], {
    required_error: 'You need to select a registration type.',
  }),
  leaderName: z.string().optional(),
  teamName: z.string().optional(),
  teamMembers: z.string().optional(),
}).refine((data) => {
    if (data.registrationType === 'team') {
      return !!data.teamName && data.teamName.length > 0;
    }
    return true;
}, {
    message: 'Team name is required for team registration.',
    path: ['teamName'],
}).refine((data) => {
    if (data.registrationType === 'team') {
      return !!data.leaderName && data.leaderName.length > 0;
    }
    return true;
}, {
    message: "Team Leader's name is required for team registration.",
    path: ['leaderName'],
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, isUserLoading, mutate: mutateUser } = useUserAndMutate();
  const firestore = useFirestore();
  const storage = useStorage();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: userProfile, isLoading: isProfileLoading, mutate: mutateProfile } = useDoc<UserAccount>(userDocRef);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      college: '',
      mentorName: '',
      department: '',
      skills: '',
      bio: '',
      phoneNumber: '',
      registrationType: 'individual',
      leaderName: '',
      teamName: '',
      teamMembers: '',
    },
  });

  const registrationType = form.watch('registrationType');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || user?.displayName || '',
        college: userProfile.college || '',
        mentorName: userProfile.mentorName || '',
        department: userProfile.department || '',
        skills: userProfile.skills?.join(', ') || '',
        bio: userProfile.bio || '',
        phoneNumber: userProfile.phoneNumber || '',
        registrationType: userProfile.registrationType || 'individual',
        leaderName: userProfile.leaderName || '',
        teamName: userProfile.teamName || '',
        teamMembers: userProfile.teamMembers?.join(', ') || '',
      });
    } else if (user) {
      form.reset({
        name: user.displayName || '',
        college: '',
        mentorName: '',
        department: '',
        skills: '',
        bio: '',
        phoneNumber: user.phoneNumber || '',
        registrationType: 'individual',
        leaderName: '',
        teamName: '',
        teamMembers: '',
      });
    }
  }, [userProfile, user, form, isProfileLoading]);
  
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !userDocRef) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({
        variant: 'destructive',
        title: 'File too large',
        description: 'Please upload an image smaller than 2MB.',
      });
      return;
    }

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `user_avatars/${user.uid}/${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      await setDoc(userDocRef, { photoURL: downloadURL }, { merge: true });
      if(user) {
        await updateProfile(user, { photoURL: downloadURL });
      }
      
      await mutateUser(); // Refresh auth state
      await mutateProfile(); // Refresh firestore state

      toast({
        title: 'Image uploaded successfully!',
      });

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message || 'Could not upload your image.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user || !userDocRef) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to update your profile.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedData: Partial<UserAccount> = {
        name: data.name,
        college: data.college,
        mentorName: data.mentorName,
        department: data.department,
        skills: data.skills.split(',').map((s) => s.trim()),
        bio: data.bio,
        phoneNumber: data.phoneNumber,
        registrationType: data.registrationType,
        leaderName: data.leaderName,
        teamName: data.teamName,
        teamMembers: data.teamMembers ? data.teamMembers.split(',').map(s => s.trim()) : [],
      };

      if (userProfile?.registrationType) {
        delete updatedData.registrationType;
      }

      if (data.registrationType === 'individual') {
        updatedData.teamName = '';
        updatedData.teamMembers = [];
        updatedData.leaderName = '';
      }

      await setDoc(userDocRef, updatedData, { merge: true });

      if (user.displayName !== data.name || user.phoneNumber !== data.phoneNumber) {
        await updateProfile(user, { displayName: data.name, phoneNumber: data.phoneNumber });
      }
      
      await mutateUser();
      await mutateProfile();

      toast({
        title: 'Profile updated successfully!',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not update your profile.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || isProfileLoading || !user) {
    return (
      <div className="bg-muted/40 min-h-[calc(100vh-3.5rem)]">
        <div className="container py-12">
          <Card className="mx-auto max-w-3xl">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 min-h-[calc(100vh-3.5rem)]">
      <div className="container py-12">
        <Card className="mx-auto max-w-3xl overflow-hidden p-6 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center gap-6">
                <div className="relative h-32 w-32 group">
                    <Image 
                        src={userProfile?.photoURL || user.photoURL || `https://picsum.photos/seed/${user.uid}/200/200`}
                        alt={userProfile?.name || user.displayName || 'User Avatar'}
                        width={128}
                        height={128}
                        className="rounded-full border-4 border-background object-cover h-32 w-32"
                        data-ai-hint="person portrait"
                    />
                     <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 text-white hover:bg-white/20"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-6 w-6" />
                        </Button>
                      )}
                    </div>
                    <Input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleImageUpload}
                    />
                </div>
                <div>
                    <CardTitle className="font-headline text-3xl">{userProfile?.name || user.displayName}</CardTitle>
                    <CardDescription className="text-foreground/80">
                        {user.email}
                    </CardDescription>
                    {userProfile?.registrationType && (
                      <Badge variant="secondary" className="mt-2 capitalize">
                        {userProfile.registrationType} Registration
                      </Badge>
                    )}
                </div>
            </div>
             <div className="pt-8">
                <CardContent className="p-0">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Grace Hopper" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input type="tel" placeholder="9876543210" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                        control={form.control}
                        name="college"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>College/University</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Vassar College" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                          control={form.control}
                          name="mentorName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mentor Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Dr. Alan Turing" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Department</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Computer Science" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                            control={form.control}
                            name="registrationType"
                            render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Registration Type</FormLabel>
                                <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="flex flex-row space-x-4"
                                    disabled={!!userProfile?.registrationType}
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="individual" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Individual
                                    </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="team" />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        Team
                                    </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        {registrationType === 'team' && (
                          <>
                            <FormField
                                control={form.control}
                                name="leaderName"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team Leader's Name</FormLabel>
                                    <FormControl>
                                    <Input placeholder="e.g., Ada Lovelace" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="teamName"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team Name</FormLabel>
                                    <FormControl>
                                    <Input placeholder="The Innovators" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="teamMembers"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Team Members</FormLabel>
                                    <FormControl>
                                    <Input placeholder="John Doe (CS), Jane Smith (IT)..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                    Enter each member's name and department, separated by commas.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                          </>
                        )}
                        <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl>
                                <Input placeholder="React, Python, Figma..." {...field} />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                                Enter your skills, separated by commas.
                            </p>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Short Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Tell us a little bit about yourself."
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isSubmitting || isUploading}>
                          {isSubmitting && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Update Profile
                        </Button>
                    </form>
                    </Form>
                </CardContent>
             </div>
        </Card>
      </div>
    </div>
  );
}
