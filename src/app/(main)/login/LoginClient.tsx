'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginClient() {
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created! Please check your email to verify your account before logging in.');
    }
    if (searchParams.get('reason') === 'unverified') {
      setSuccess('Please verify your email to continue(Check your inbox and spam section for verification link)');
    }
  }, [searchParams]);

  useEffect(() => {
    // If a verified user somehow lands on the login page, redirect them.
    if (user?.emailVerified) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // Force a reload of the user's profile to get the latest `emailVerified` status
      await userCredential.user.reload();
      const freshUser = auth.currentUser; // Get the most up-to-date user object
      
      if (freshUser && freshUser.emailVerified) {
        // SUCCESS: Email is verified, proceed to dashboard.
        router.push('/dashboard');
      } else {
        // FAIL: Email is not verified.
        setError('Please verify your email address before logging in. A new verification link has been sent to your email.');
        if (freshUser) {
          await sendEmailVerification(freshUser);
        }
        await signOut(auth);
        // Force a page refresh to ensure UI reflects the signed-out state.
        window.location.reload();
      }

    } catch (error: any) {
      let errorMessage = 'An unknown error occurred.';
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please try again.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
            errorMessage = 'Too many login attempts. Please try again later.';
            break;
        default:
          errorMessage = error.message;
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
            Welcome Back
          </CardTitle>
          <CardDescription>
            Log in to your HackNation account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
               {success && (
                <Alert variant='default'>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Action Required</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
        </CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
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
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Log In
              </Button>
            </CardFooter>
          </form>
        </Form>
        
        <CardFooter className="justify-center pt-4">
            <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
                href="/register"
                className="font-medium text-primary hover:underline"
            >
                Register
            </Link>
            </p>
        </CardFooter>

      </Card>
    </div>
  );
}
