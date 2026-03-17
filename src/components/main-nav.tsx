'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { Button } from './ui/button';
import { useUser, useAuth } from '@/firebase';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { signOut } from 'firebase/auth';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  LogOut,
  User as UserIcon,
  LayoutGrid,
  Shield,
  FileText,
  Code,
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';

export function MainNav() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { isAdmin, isAdminLoading } = useAdminStatus();
  const { toast } = useToast();

  const isLoading = isUserLoading || isAdminLoading;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description:
          error.message || 'Could not log you out. Please try again.',
      });
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <div className="flex w-full items-center justify-between">

      <div className="flex items-center gap-6">
        <Logo />
      </div>

      <div className="flex items-center gap-4">

        {isLoading ? (
          <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
        ) : user ? (

          <DropdownMenu>

            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.photoURL ?? ''}
                    alt={user.displayName ?? ''}
                  />
                  <AvatarFallback>
                    {getInitials(user.displayName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>

              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>

              {isAdmin ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/judging">
                      <Code className="mr-2 h-4 w-4" />
                      Judging
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/submit">
                    <FileText className="mr-2 h-4 w-4" />
                    Submit Project
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        ) : (

          <>
            <Button asChild variant="ghost">
              <Link href="/login">Log In</Link>
            </Button>

            <Dialog>

              <DialogTrigger asChild>
                <Button>Register</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-4xl">

                <DialogHeader>
                  <DialogTitle className="text-center text-3xl font-bold">
                    Choose Your Plan
                  </DialogTitle>

                  <DialogDescription className="text-center text-lg">
                    Select the registration type that suits you best.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 max-h-[70vh] overflow-y-auto">

                  <div className="border rounded-xl p-6 shadow-lg">

                    <h3 className="text-2xl font-bold mb-2">
                      With Kit
                    </h3>

                    <p className="text-4xl font-bold mb-4">
                      ₹250
                    </p>

                    <ul className="space-y-2 text-muted-foreground mb-6">
                      <li>✔ Official Hackathon T-Shirt</li>
                      <li>✔ Sticker Pack & Goodies</li>
                      <li>✔ Meals & Snacks (2 Days)</li>
                      <li>✔ Participation Certificate</li>
                    </ul>

                    <Button asChild className="w-full">
                      <Link href="/register?plan=with-kit">
                        Register With Kit
                      </Link>
                    </Button>

                  </div>

                  <div className="border rounded-xl p-6">

                    <h3 className="text-2xl font-bold mb-2">
                      Without Kit
                    </h3>

                    <p className="text-4xl font-bold mb-4">
                      Free
                    </p>

                    <ul className="space-y-2 text-muted-foreground mb-6">
                      <li>✔ Meals & Snacks (2 Days)</li>
                      <li>✔ Participation Certificate</li>
                    </ul>

                    <Button asChild variant="secondary" className="w-full">
                      <Link href="/register?plan=without-kit">
                        Register Without Kit
                      </Link>
                    </Button>

                  </div>

                </div>

              </DialogContent>

            </Dialog>
          </>
        )}

      </div>
    </div>
  );
}
