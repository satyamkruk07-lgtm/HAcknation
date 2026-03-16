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
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

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
const { toast } = useToast();

const [error, setError] = useState<string | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);
const [showVerificationInfo, setShowVerificationInfo] = useState(false);

// ✅ show verification toast once
useEffect(() => {
const reason = searchParams.get('reason');
const registered = searchParams.get('registered');


if (reason === 'unverified' || registered === 'true') {
  toast({
    title: 'Verification Required',
    description:
      'Please verify your email to continue (check spam folder also)',
  });
  setShowVerificationInfo(true);

  // remove params to avoid loop
  router.replace('/login');
}


}, []);

// ✅ redirect if already verified & logged in
useEffect(() => {
if (user?.emailVerified) {
router.replace('/dashboard');
}
}, [user]);

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


try {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    data.email,
    data.password
  );

  // ✅ reload latest firebase user
  await userCredential.user.reload();
  const freshUser = userCredential.user;

  if (freshUser.emailVerified) {
    router.replace('/dashboard');
  } else {
    // send verification only if not verified
    await sendEmailVerification(freshUser);

    await signOut(auth);

    router.replace('/login?reason=unverified');
  }
} catch (error: any) {
  let errorMessage = 'Login failed. Try again.';

  switch (error.code) {
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      errorMessage = 'Invalid email or password';
      break;
    case 'auth/wrong-password':
      errorMessage = 'Incorrect password';
      break;
    case 'auth/too-many-requests':
      errorMessage = 'Too many attempts. Try later';
      break;
    default:
      errorMessage = error.message;
  }

  setError(errorMessage);
} finally {
  setIsSubmitting(false);
}


};

return ( <div className="flex min-h-[calc(100vh-11rem)] items-center justify-center py-12"> <Card className="w-full max-w-md"> <CardHeader> <CardTitle className="font-headline text-2xl">
Welcome Back </CardTitle> <CardDescription>
Log in to your HackNation account to continue. </CardDescription> </CardHeader>


    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {showVerificationInfo && (
            <Alert>
              <AlertTitle>Action Required</AlertTitle>
              <AlertDescription>
                Please verify your email. Check spam folder.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Login Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
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
