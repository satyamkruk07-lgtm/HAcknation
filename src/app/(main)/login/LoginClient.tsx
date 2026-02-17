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
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.651-3.356-11.303-8H6.306C9.656,39.663,16.318,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C43.021,36.257,44,30.651,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

export default function LoginClient() {
  const auth = useAuth();
  const firestore = useFirestore();
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

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (firestore) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (!docSnap.exists()) {
          await setDoc(userDocRef, {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            registrationDate: new Date().toISOString(),
            emailVerified: user.emailVerified,
          });
        }
      }
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
        setIsSubmitting(false);
    }
  };


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
                {isSubmitting && !form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Log In
              </Button>
            </CardFooter>
          </form>
        </Form>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <CardContent>
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>
             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <GoogleIcon className="mr-2 h-5 w-5" />
            Google
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col items-stretch gap-4 pt-0">
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
