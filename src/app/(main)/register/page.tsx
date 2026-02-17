'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';


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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const formSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    mentorName: z.string().optional(),
    registrationType: z.enum(['individual', 'team'], {
      required_error: 'You need to select a registration type.',
    }),
    leaderName: z.string().optional(),
    teamName: z.string().optional(),
    teamMembers: z.string().optional(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => {
    if (data.registrationType === 'team') {
      return !!data.leaderName && data.leaderName.length > 0;
    }
    return true;
  }, {
    message: "Team Leader's name is required for team registration.",
    path: ['leaderName'],
  })
  .refine((data) => {
    if (data.registrationType === 'team') {
      return !!data.teamName && data.teamName.length > 0;
    }
    return true;
  }, {
    message: 'Team name is required when registering as a team.',
    path: ['teamName'],
  });


type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      mentorName: '',
      password: '',
      confirmPassword: '',
      registrationType: 'individual',
      leaderName: '',
      teamName: '',
      teamMembers: '',
    },
  });

  const registrationType = form.watch('registrationType');
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    if (!firestore) {
        setError("Database not available. Please try again later.");
        setIsSubmitting(false);
        return;
    }

    try {
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;
      
      // Step 2: Update their Auth profile with their name
      await updateProfile(user, { displayName: data.name });
      
      // Step 3: Create a corresponding user document in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
          name: data.name,
          email: data.email,
          mentorName: data.mentorName || '',
          registrationType: data.registrationType,
          leaderName: data.leaderName || '',
          teamName: data.teamName || '',
          teamMembers: data.teamMembers ? data.teamMembers.split(',').map(s => s.trim()) : [],
          registrationDate: new Date().toISOString(),
          emailVerified: false, // Explicitly set to false initially
      });

      // Step 4: Send the verification email
      await sendEmailVerification(user);

      // Step 5: Sign the user out to force them to log in after verifying
      await signOut(auth);

      // Step 6: Redirect to login page with a success message
      router.push('/login?registered=true');

    } catch (error: any) {
      let errorMessage = 'An unknown error occurred. Please try again.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email address is already registered. Please try logging in.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. Please use at least 6 characters.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        default:
          errorMessage = error.message;
          break;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-11rem)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Register for HackNation
          </CardTitle>
          <CardDescription>
            Join the best and brightest. Your journey starts here.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Registration Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Grace Hopper" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="grace@example.com"
                        {...field}
                      />
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
                    <FormLabel>Mentor's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Dr. Alan Turing" {...field} />
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
                    <FormLabel>Registration Type <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
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
                    name="teamName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="The Innovators" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leaderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Leader's Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Ada Lovelace" {...field} />
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
                        <FormLabel>Team Members' Names</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe, Jane Smith..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter names separated by commas.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </CardFooter>
          </form>
        </Form>

        <CardFooter className="flex flex-col items-stretch gap-4 pt-4">
            <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
                href="/login"
                className="font-medium text-primary hover:underline"
            >
                Log in
            </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
