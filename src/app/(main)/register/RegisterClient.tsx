'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';


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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

const formSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phoneNumber: z.string().min(1, 'Phone number is required').refine(
      (val) => /^\d{10}$/.test(val),
      {
        message: 'Phone number must be 10 digits.',
      }
    ),
    mentorName: z.string().optional(),
    registrationType: z.enum(['individual', 'team'], {
      required_error: 'You need to select a registration type.',
    }),
    leaderName: z.string().optional(),
    leaderCourse: z.string().optional(),
    teamName: z.string().optional(),
    teamMember1: z.string().optional(),
    teamMember1Course: z.string().optional(),
    teamMember2: z.string().optional(),
    teamMember2Course: z.string().optional(),
    teamMember3: z.string().optional(),
    teamMember3Course: z.string().optional(),
    teamMember4: z.string().optional(),
    teamMember4Course: z.string().optional(),
    teamMember5: z.string().optional(),
    teamMember5Course: z.string().optional(),
    teamMember6: z.string().optional(),
    teamMember6Course: z.string().optional(),
  })
  .refine((data) => {
    if (data.registrationType === 'team') {
      return !!data.leaderName && data.leaderName.length > 0;
    }
    return true;
  }, {
    message: "Team Leader's name is required for team registration.",
    path: ['leaderName'],
  })
  .refine((data) => {
    if (data.registrationType === 'team') {
      return !!data.leaderCourse && data.leaderCourse.length > 0;
    }
    return true;
  }, {
    message: "Team Leader's course is required for team registration.",
    path: ['leaderCourse'],
  })
  .refine((data) => {
    if (data.registrationType === 'team') {
      return !!data.teamName && data.teamName.length > 0;
    }
    return true;
  }, {
    message: 'Team name is required when registering as a team.',
    path: ['teamName'],
  })
  .superRefine((data, ctx) => {
    if (data.registrationType === 'team') {
      const requiredMembers = [
        { name: data.teamMember1, namePath: 'teamMember1', course: data.teamMember1Course, coursePath: 'teamMember1Course' },
        { name: data.teamMember2, namePath: 'teamMember2', course: data.teamMember2Course, coursePath: 'teamMember2Course' },
        { name: data.teamMember3, namePath: 'teamMember3', course: data.teamMember3Course, coursePath: 'teamMember3Course' },
        { name: data.teamMember4, namePath: 'teamMember4', course: data.teamMember4Course, coursePath: 'teamMember4Course' },
      ];

      requiredMembers.forEach(member => {
        if (!member.name || member.name.trim().length === 0) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Member name is required.", path: [member.namePath as 'teamMember1'] });
        }
        if (!member.course || member.course.trim().length === 0) {
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Course is required.", path: [member.coursePath as 'teamMember1Course'] });
        }
      });
      
      const optionalMembers = [
          { name: data.teamMember5, namePath: 'teamMember5', course: data.teamMember5Course, coursePath: 'teamMember5Course' },
          { name: data.teamMember6, namePath: 'teamMember6', course: data.teamMember6Course, coursePath: 'teamMember6Course' },
      ];
      
      optionalMembers.forEach(member => {
          if (member.name && member.name.trim().length > 0 && (!member.course || member.course.trim().length === 0)) {
               ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Course is required if name is provided.", path: [member.coursePath as 'teamMember5Course'] });
          }
      });
    }
  });


type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const plan = searchParams.get('plan');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      mentorName: '',
      registrationType: 'individual',
      leaderName: '',
      leaderCourse: '',
      teamName: '',
      teamMember1: '',
      teamMember1Course: '',
      teamMember2: '',
      teamMember2Course: '',
      teamMember3: '',
      teamMember3Course: '',
      teamMember4: '',
      teamMember4Course: '',
      teamMember5: '',
      teamMember5Course: '',
      teamMember6: '',
      teamMember6Course: '',
    },
  });

  const registrationType = form.watch('registrationType');
  const teamMemberFields = [
    form.watch('teamMember1'),
    form.watch('teamMember2'),
    form.watch('teamMember3'),
    form.watch('teamMember4'),
    form.watch('teamMember5'),
    form.watch('teamMember6'),
  ];

  const [memberCount, setMemberCount] = useState(1);
  const [totalAmount, setTotalAmount] = useState(250);

  useEffect(() => {
    let count = 1; // Default for individual
    if (registrationType === 'team') {
        count = teamMemberFields.filter(m => m && m.trim().length > 0).length;
    }
    setMemberCount(count);
    setTotalAmount(count * 250);
  }, [registrationType, teamMemberFields]);
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    if (!firestore) {
        setError("Database not available. Please try again later.");
        setIsSubmitting(false);
        return;
    }

    // Check for duplicate team name
    if (data.registrationType === 'team' && data.teamName) {
      const usersRef = collection(firestore, 'users');
      // Case-sensitive check for simplicity. For case-insensitivity, would need a separate lowercase field.
      const q = query(usersRef, where("teamName", "==", data.teamName.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        form.setError("teamName", {
          type: "manual",
          message: "Team name already taken.",
        });
        setIsSubmitting(false);
        return;
      }
    }

    // This creates a secure, random password for the user account.
    // The student does not need this password, but it allows an account to be created.
    const randomPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

    try {
      // Step 1: Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        randomPassword
      );
      const user = userCredential.user;
      
      // Step 2: Update their Auth profile with their name
      await updateProfile(user, { displayName: data.name });
      
      const leaderWithCourse = data.leaderName && data.leaderCourse 
        ? `${data.leaderName.trim()} (${data.leaderCourse.trim()})`
        : data.leaderName || '';

      const teamMembersList = [
        { name: data.teamMember1, course: data.teamMember1Course },
        { name: data.teamMember2, course: data.teamMember2Course },
        { name: data.teamMember3, course: data.teamMember3Course },
        { name: data.teamMember4, course: data.teamMember4Course },
        { name: data.teamMember5, course: data.teamMember5Course },
        { name: data.teamMember6, course: data.teamMember6Course },
      ]
      .filter(m => m.name && m.name.trim().length > 0)
      .map(m => `${m.name!.trim()} (${m.course ? m.course.trim() : 'N/A'})`);

      // Step 3: Create a corresponding user document in Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          mentorName: data.mentorName || '',
          registrationType: data.registrationType,
          leaderName: leaderWithCourse,
          teamName: data.teamName ? data.teamName.trim() : '',
          teamMembers: teamMembersList,
          registrationDate: new Date().toISOString(),
          plan: plan,
      });

      // Step 4: Redirect to payment or success page
      if (plan === 'with-kit') {
        router.push(`/payment?amount=${totalAmount}&name=${data.name}&email=${data.email}&userId=${user.uid}`);
      } else {
        router.push('/registration-success');
      }

    } catch (error: any) {
      let errorMessage = 'An unknown error occurred. Please try again.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email address is already registered. Please try logging in.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. Please use at least 6 characters.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        default:
          errorMessage = error.message;
          break;
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
            Register for HackNation
          </CardTitle>
          <CardDescription>
            Join the best and brightest. Your journey starts here.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {error && (
                <Alert variant="destructive">
                    <AlertTitle>Registration Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Grace Hopper" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mentorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mentor's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Dr. Alan Turing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Registration Type <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="individual" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Individual
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="team" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Team
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {registrationType === 'team' && (
                <>
                  <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="The Innovators" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="leaderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Leader's Name <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Ada Lovelace" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="leaderCourse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Leader's Course <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., B.Tech CSE" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4 rounded-md border p-4">
                    <FormLabel>Team Members (min 4, max 6) <span className="text-destructive">*</span></FormLabel>
                    <FormDescription>
                        Enter the full name and course for each team member. The first 4 are required.
                    </FormDescription>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="teamMember1"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="text-xs">Member 1 Name<span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="teamMember1Course"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="text-xs">Course <span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input placeholder="e.g., B.Tech IT" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="teamMember2"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="text-xs">Member 2 Name<span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="teamMember2Course"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="text-xs">Course <span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input placeholder="e.g., B.Tech IT" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <FormField
                          control={form.control}
                          name="teamMember3"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="text-xs">Member 3 Name <span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="teamMember3Course"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="text-xs">Course <span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input placeholder="e.g., B.Tech IT" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <FormField
                          control={form.control}
                          name="teamMember4"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="text-xs">Member 4 Name <span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="teamMember4Course"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="text-xs">Course <span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input placeholder="e.g., B.Tech IT" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="teamMember5"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Member 5 Name (Optional)</FormLabel>
                                    <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="teamMember5Course"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs">Course (Optional)</FormLabel>
                                    <FormControl><Input placeholder="e.g., B.Tech IT" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="teamMember6"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="text-xs">Member 6 Name (Optional)</FormLabel>
                                  <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="teamMember6Course"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="text-xs">Course (Optional)</FormLabel>
                                  <FormControl><Input placeholder="e.g., B.Tech IT" {...field} /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                    </div>
                </div>

                </>
              )}
            </CardContent>
            
            {plan === 'with-kit' && (
                <CardContent className="border-t pt-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-center">Payment Information</h3>
                        <Card className="bg-muted/50 p-4 space-y-2">
                           <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Price per person</span>
                                <span className="font-semibold">₹250.00</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Number of members</span>
                                <span className="font-semibold">x {memberCount}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2 font-bold text-lg border-t pt-2">
                                <span>Total Amount</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </Card>
                         <p className="text-xs text-center text-muted-foreground pt-2">
                            You will be redirected to our secure payment partner after clicking the button below.
                        </p>
                    </div>
                </CardContent>
            )}

            <CardFooter className="flex flex-col items-stretch gap-4">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {plan === 'with-kit' ? 'Create Account & Proceed to Payment' : 'Create Account'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
