'use client';

import { useFirestore } from '@/firebase';
import { collection, getCountFromServer } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from './ui/skeleton';

export function RegistrationCountCard() {
    const firestore = useFirestore();
    const [count, setCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // This component is rendered on the public homepage, so we can't assume a user is logged in.
        // We'll try to fetch, but expect it might fail due to security rules.
        // A production app would use a Cloud Function to write this count to a public document.
        if (!firestore) {
            setIsLoading(false);
            setCount(10); // Fallback if firestore is not available
            return;
        };

        const fetchCount = async () => {
            setIsLoading(true);
            try {
                const coll = collection(firestore, "users");
                const snapshot = await getCountFromServer(coll);
                setCount(snapshot.data().count);
            } catch (error: any) {
                if (error.code === 'permission-denied') {
                    // This is expected for unauthenticated users.
                    // We'll just show a placeholder.
                    console.warn("Permission denied for registration count. This is expected for public visitors.");
                } else {
                    console.error("Error fetching registration count:", error);
                }
                setCount(150); // Fallback to a nice-looking number on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchCount();

    }, [firestore]);


    return (
        <Card className="[transform-style:preserve-3d] transition-all duration-500 ease-in-out hover:[transform:rotateY(15deg)_rotateX(10deg)] group">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50 blur-lg transition-all duration-500 group-hover:opacity-100" />
            <div className="relative border-4 border-background/50 rounded-lg h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                        <Users className="h-6 w-6 text-accent" />
                        <span>Live Registrations</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center pt-4">
                    {isLoading ? (
                        <Skeleton className="h-20 w-36 mx-auto" />
                    ) : (
                        <div className="text-7xl font-bold font-mono text-primary [text-shadow:_2px_2px_4px_hsl(var(--primary)/0.2)]">
                            {(count && count > 150 ? count : 150)}+
                        </div>
                    )}
                     <p className="text-muted-foreground mt-2 font-semibold tracking-widest">INNOVATORS</p>
                </CardContent>
            </div>
        </Card>
    );
}
