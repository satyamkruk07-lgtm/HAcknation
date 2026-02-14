import { Footer } from '@/components/footer';
import { Logo } from '@/components/logo';

export default function JudgingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center justify-between">
          <Logo />
          {/* 
            This simplified header intentionally omits the MainNav component.
            MainNav includes the useAdminStatus hook, which was causing
            unnecessary permission checks and errors for anonymous users (judges).
            By using this separate layout, we ensure the judging flow is clean
            and free of irrelevant checks.
          */}
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
