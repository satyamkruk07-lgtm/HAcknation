
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser, useFirestore, useMemoFirebase, useStorage } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useDoc } from '@/firebase/firestore/use-doc';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { UserAccount } from '@/lib/types';
import { updateProfile } from 'firebase/auth';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  college: z.string().optional(),
  skills: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, auth, isUserLoading, mutate: mutateUser } = useUser();
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

  const { data: userProfile, isLoading: isProfileLoading, mutate } = useDoc<UserAccount>(userDocRef);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    // Initialize with empty strings to prevent uncontrolled-to-controlled error
    defaultValues: {
      name: '',
      college: '',
      skills: '',
      bio: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    // When data is loaded, reset the form with the new values.
    // Ensure all fields get a defined value (e.g., '' instead of undefined).
    if (userProfile) {
      form.reset({
        name: userProfile.name || '',
        college: userProfile.college || '',
        skills: userProfile.skills?.join(', ') || '',
        bio: userProfile.bio || '',
      });
    } else if (user) {
      form.reset({
        name: user.displayName || '',
        college: '',
        skills: '',
        bio: '',
      });
    }
  }, [userProfile, user, form, isProfileLoading]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    if (!user || !storage || !auth.currentUser) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to upload a picture.",
      });
      return;
    }

    const file = event.target.files[0];
    const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);

    setIsUploading(true);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);

      // Update Firebase Auth user profile
      await updateProfile(auth.currentUser, { photoURL });
      
      // Update Firestore document
      if(userDocRef) {
        await setDoc(userDocRef, { photoURL }, { merge: true });
      }

      // Force re-fetch of user data
      await auth.currentUser.reload();
      mutateUser(); // re-fetch auth user
      mutate(); // re-fetch firestore doc

      toast({
        title: 'Success!',
        description: 'Your profile picture has been updated.',
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Could not upload your picture.",
      });
    } finally {
      setIsUploading(false);
    }
  };


  const onSubmit = async (data: ProfileFormData) => {
    if (!user || !firestore || !auth) {
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
        skills: data.skills ? data.skills.split(',').map((s) => s.trim()) : [],
        bio: data.bio,
      };

      if (userDocRef) {
        await setDoc(userDocRef, updatedData, { merge: true });
      }


      if (auth.currentUser && auth.currentUser.displayName !== data.name) {
        await updateProfile(auth.currentUser, { displayName: data.name });
      }
      
      mutate(); // re-fetch firestore doc after update
      mutateUser(); // re-fetch user after update

      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
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

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  if (isUserLoading || isProfileLoading || !user) {
    return (
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
    );
  }

  return (
    <div className="container py-12">
      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Your Profile</CardTitle>
          <CardDescription>
            Keep your information up to date to connect with others.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                    <AvatarImage src={user.photoURL ?? ''} />
                    <AvatarFallback className="text-3xl">
                      {getInitials(userProfile?.name ?? user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity" onClick={handleAvatarClick}>
                    {isUploading ? <Loader2 className="h-8 w-8 animate-spin text-white" /> : <Upload className="h-8 w-8 text-white" />}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{userProfile?.name ?? user.displayName}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>

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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    