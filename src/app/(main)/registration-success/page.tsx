'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function RegistrationSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[calc(100vh-11rem)] items-center justify-center py-12 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
             <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="font-headline text-2xl">
            Registration Successful!
          </CardTitle>
          <CardDescription>
            Thank you for registering for HackNation. We're excited to have you.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-center text-muted-foreground">
                You will receive a confirmation email shortly with further details about the event. Get ready to innovate, collaborate, and create!
            </p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/">Back to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

