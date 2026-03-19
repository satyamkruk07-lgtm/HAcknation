'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from 'lucide-react';

const deadline = new Date('2026-04-16T00:00:00');

export function CountdownCard() {
    const [daysLeft, setDaysLeft] = useState<number | null>(null);

    useEffect(() => {
        const calculateDaysLeft = () => {
            const now = new Date();
            const difference = deadline.getTime() - now.getTime();

            if (difference > 0) {
                return Math.ceil(difference / (1000 * 60 * 60 * 24));
            }
            return 0;
        };
        
        setDaysLeft(calculateDaysLeft());

        const timer = setInterval(() => {
            setDaysLeft(calculateDaysLeft());
        }, 1000 * 60 * 60); // Update once an hour is enough

        return () => clearInterval(timer);
    }, []);

    return (
        <Card className="[transform-style:preserve-3d] transition-all duration-500 ease-in-out hover:[transform:rotateY(-15deg)_rotateX(10deg)] group">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-50 blur-lg transition-all duration-500 group-hover:opacity-100" />
            <div className="relative border-4 border-background/50 rounded-lg h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 font-headline text-2xl">
                        <Calendar className="h-6 w-6 text-accent" />
                        <span>Days to Go</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center pt-4">
                    {daysLeft === null ? (
                        <Skeleton className="h-20 w-36 mx-auto" />
                    ) : (
                        <div className="text-7xl font-bold font-mono text-primary [text-shadow:_2px_2px_4px_hsl(var(--primary)/0.2)]">
                            {daysLeft}
                        </div>
                    )}
                    <p className="text-muted-foreground mt-2 font-semibold tracking-widest">DAYS</p>
                </CardContent>
            </div>
        </Card>
    );
}
