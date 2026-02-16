import { Suspense } from 'react';
import LoginClient from './LoginClient';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <Suspense fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
      <LoginClient />
    </Suspense>
  );
}
