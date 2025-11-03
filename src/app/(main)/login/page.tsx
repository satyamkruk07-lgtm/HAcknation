
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo, signOut } from 'firebase/auth';
import { useAuth, useUser, useFirestore } from '@/firebase';
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

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

const adminEmails = ['kalyanikri1111@gmail.com', 'frgtpeople@gmail.com'];

export default function LoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);


  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('Account created! Please check your email to verify your account before logging in.');
    }
  }, [searchParams]);

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
      const user = userCredential.user;
      
      const isAdmin = user.email && adminEmails.includes(user.email);

      if (user.emailVerified || isAdmin) {
        // SUCCESS: Email is verified OR user is an admin, proceed to dashboard.
        router.push('/dashboard');
      } else {
        // FAIL: Email is not verified.
        setError('Please verify your email address before logging in. A new verification link has been sent to your email.');
        await sendEmailVerification(user);
        await signOut(auth);
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

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!firestore) {
      setError("Firestore is not initialized.");
      setIsGoogleSubmitting(false);
      return;
    }

    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const additionalUserInfo = getAdditionalUserInfo(result);
  
        // If the user is new, create a document for them in Firestore
        if (additionalUserInfo?.isNewUser) {
          const userDocRef = doc(firestore, 'users', user.uid);
          await setDoc(userDocRef, {
            id: user.uid,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            registrationDate: new Date().toISOString(),
            emailVerified: user.emailVerified,
          });
        }
        router.push('/dashboard');
    } catch(error: any) {
        let errorMessage = 'An unknown error occurred.';
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            errorMessage = 'Sign-in popup was closed. Please try again.';
            break;
          case 'auth/account-exists-with-different-credential':
            errorMessage = 'An account already exists with the same email address but different sign-in credentials.';
            break;
          default:
            errorMessage = error.message;
        }
        setError(errorMessage);
    } finally {
        setIsGoogleSubmitting(false);
    }
  }

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
                  <AlertTitle>Success!</AlertTitle>
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
              <Button type="submit" disabled={isSubmitting || isGoogleSubmitting} className="w-full">
                {isSubmitting && (
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

        <CardFooter className="flex flex-col items-stretch gap-4">
            <Button variant="outline" onClick={handleGoogleSignIn} disabled={isSubmitting || isGoogleSubmitting} className="w-full">
                {isGoogleSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                Google
            </Button>
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
