'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/footer';
import { MainNav } from '@/components/main-nav';
import { Logo } from '@/components/logo';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isJudgingRoute = pathname.startsWith('/judging');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center">
          {isJudgingRoute ? <Logo /> : <MainNav />}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
