
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
import Image from 'next/image';

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
import { PlaceHolderImages } from '@/lib/placeholder-images';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  college: z.string().optional(),
  skills: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

const profileBgImage = PlaceHolderImages.find(p => p.id === "profile-background");

export default function ProfilePage() {
  const { user, auth, isUserLoading, mutate: mutateUser } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: userProfile, isLoading: isProfileLoading, mutate } = useDoc<UserAccount>(userDocRef);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
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
    if (userProfile) {
      form.reset({
        name: userProfile.name || user?.displayName || '',
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
    avatarFileInputRef.current?.click();
  };

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    if (!user || !storage || !auth.currentUser || !userDocRef) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to upload a picture.",
      });
      return;
    }

    const file = event.target.files[0];
    const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);

    setIsUploadingAvatar(true);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(snapshot.ref);

      await updateProfile(auth.currentUser, { photoURL });
      await setDoc(userDocRef, { photoURL }, { merge: true });

      // Force re-fetch of both user and profile data
      await mutateUser();
      mutate();

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
      setIsUploadingAvatar(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user || !userDocRef || !auth.currentUser) {
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

      await setDoc(userDocRef, updatedData, { merge: true });

      if (auth.currentUser.displayName !== data.name) {
        await updateProfile(auth.currentUser, { displayName: data.name });
      }
      
      await mutateUser();
      mutate(); 

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
      <div className="bg-background min-h-[calc(100vh-3.5rem)]">
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
    <div className="relative min-h-[calc(100vh-3.5rem)]">
        {profileBgImage && (
            <Image
                src={profileBgImage.imageUrl}
                alt={profileBgImage.description}
                fill
                className="absolute inset-0 -z-10 h-full w-full object-cover"
                data-ai-hint={profileBgImage.imageHint}
                priority
            />
        )}
      <div className="container py-12">
        <Card className="mx-auto max-w-3xl bg-background/90 backdrop-blur-sm overflow-hidden p-6">
            <div className="flex items-center gap-6">
                <div className="relative h-32 w-32 group">
                    <Avatar className="h-32 w-32 border-4 border-background" onClick={handleAvatarClick}>
                    <AvatarImage src={user.photoURL ?? ''} />
                    <AvatarFallback className="text-4xl">
                        {getInitials(user.displayName)}
                    </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleAvatarClick}>
                    {isUploadingAvatar ? <Loader2 className="h-10 w-10 animate-spin text-white" /> : <Upload className="h-10 w-10 text-white" />}
                    </div>
                    <input type="file" ref={avatarFileInputRef} onChange={handleAvatarFileChange} accept="image/*" className="hidden" />
                </div>
                <div>
                    <CardTitle className="font-headline text-3xl">{user.displayName || userProfile?.name}</CardTitle>
                    <CardDescription className="text-foreground/80">
                        {user.email}
                    </CardDescription>
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
             </div>
        </Card>
      </div>
    </div>
  );
}
