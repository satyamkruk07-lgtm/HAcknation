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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  LogOut,
  User as UserIcon,
  LayoutGrid,
  Shield,
  FileText,
  Code,
  Check,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
          <Skeleton className="h-10 w-24" />
        ) : user && isAdmin ? (
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
                <Link href="/login">Login</Link>
            </Button>
            <Dialog>
                <DialogTrigger asChild>
                <Button>Register</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center font-headline text-3xl">
                        Registration Details
                        </DialogTitle>
                        <DialogDescription className="text-center text-lg">
                        All registrations include the official hackathon kit.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center py-8">
                        <Card className="w-full flex flex-col border-primary border-2 shadow-lg shadow-primary/20">
                            <CardHeader>
                                <CardTitle className="text-2xl">With Kit Registration</CardTitle>
                                <CardDescription>
                                Get the full hackathon experience with exclusive goodies.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <p className="text-4xl font-bold">₹250</p>
                                <ul className="space-y-2 text-muted-foreground">
                                <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                                    <span>Official Hackathon Kit</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                                    <span>Exclusive Pass For Comedy Night</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                                    <span>Meals & Snacks (2 Days)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                                    <span>Participation Certificate</span>
                                </li>
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                <Link href="/register?plan=with-kit">
                                    Proceed to Register
                                </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
