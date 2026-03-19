'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  const amount = searchParams.get('amount');
  const name = searchParams.get('name');
  const email = searchParams.get('email');

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      // On successful payment, redirect to the success page.
      router.push('/registration-success');
    }, 2000); // 2-second delay to simulate processing
  };

  if (!amount || !name || !email) {
    return (
      <div className="flex min-h-[calc(100vh-11rem)] items-center justify-center py-12">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Invalid Payment Details</CardTitle>
            <CardDescription>
              Something went wrong. Please try registering again.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push('/register')} className="w-full">
              Back to Registration
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-11rem)] items-center justify-center py-12 bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
             <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">
            Complete Your Payment
          </CardTitle>
          <CardDescription>
            You are one step away from completing your HackNation registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="rounded-lg border bg-card text-card-foreground p-6 space-y-4">
                <div className="flex justify-between items-baseline">
                    <span className="text-muted-foreground">Billed to:</span>
                    <div className="text-right">
                        <p className="font-semibold">{name}</p>
                        <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                </div>
                <div className="flex justify-between items-baseline font-bold text-2xl border-t pt-4">
                    <span>Total Amount</span>
                    <span>₹{parseFloat(amount).toFixed(2)}</span>
                </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">
                This is a mock payment page. No real transaction will occur.
            </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handlePayment} disabled={isProcessing} className="w-full">
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <PaymentPageContent />
        </Suspense>
    );
}
