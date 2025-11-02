'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { ScheduleEvent } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Flag, Code, Wrench, Pizza, Mic, Coffee, Megaphone, Milestone, Presentation, Trophy, Clock } from 'lucide-react';
import { schedule as staticSchedule } from '@/lib/data.tsx';

// Helper to map event type to icon
const getIconForEvent = (eventType?: string) => {
  const staticEvent = staticSchedule.find(e => e.title.toLowerCase().includes(eventType?.toLowerCase() || ''));
  if (staticEvent) return staticEvent.icon;
  
  // Fallback icons
  if (eventType?.includes('workshop')) return Wrench;
  if (eventType?.includes('talk')) return Mic;
  if (eventType?.includes('meal') || eventType?.includes('lunch') || eventType?.includes('dinner')) return Pizza;
  
  return Clock;
};


const ScheduleTimeline = ({ events, isLoading }: { events: ScheduleEvent[], isLoading: boolean }) => {

    if (isLoading) {
        return (
             <div className="relative pt-6">
                <div className="absolute left-6 top-0 h-full w-0.5 bg-border" aria-hidden="true" />
                <ul className="space-y-8">
                    {Array.from({length: 4}).map((_, i) => (
                         <li key={i} className="relative pl-16">
                             <Skeleton className="absolute left-0 top-1.5 h-10 w-10 rounded-full" />
                             <div className='space-y-2'>
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                             </div>
                         </li>
                    ))}
                </ul>
             </div>
        )
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No events scheduled for this day yet.</p>
            </div>
        )
    }

    return (
        <div className="relative pt-6">
            <div className="absolute left-6 top-0 h-full w-0.5 bg-border" aria-hidden="true" />
            <ul className="space-y-8">
            {events.map((event) => {
                const EventIcon = getIconForEvent(event.title) || Clock;
                return (
                    <li key={event.id} className="relative pl-16 group">
                        <div
                            className="absolute left-0 top-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground ring-8 ring-background transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                        >
                            <EventIcon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="bg-card p-4 rounded-lg border shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02] group-hover:-translate-x-1">
                            <div className="text-sm font-semibold text-muted-foreground">
                                {/* Extracts time like "09:00 AM" from "Day 1 - 09:00 AM" */}
                                {event.time.split(' - ')[1] || event.time}
                            </div>
                            <h3 className="mt-1 text-lg font-semibold">{event.title}</h3>
                            <p className="mt-1 text-muted-foreground">{event.description}</p>
                            {event.speaker && (
                            <p className="mt-2 text-sm font-medium">
                                Speaker: {event.speaker}
                            </p>
                            )}
                        </div>
                    </li>
                )
            })}
            </ul>
        </div>
    );
};

export default function SchedulePage() {
    const firestore = useFirestore();

    const scheduleQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'schedule'), orderBy('time', 'asc'));
    }, [firestore]);

    const { data: schedule, isLoading, error } = useCollection<ScheduleEvent>(scheduleQuery);
    
    const { day1Events, day2Events } = useMemo(() => {
        const d1: ScheduleEvent[] = [];
        const d2: ScheduleEvent[] = [];
        schedule?.forEach(event => {
            if (event.time.toLowerCase().startsWith('day 1')) {
                d1.push(event);
            } else if (event.time.toLowerCase().startsWith('day 2')) {
                d2.push(event);
            }
        });
        return { day1Events: d1, day2Events: d2 };
    }, [schedule]);


  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="mb-8 font-headline text-4xl font-bold">
          Event Schedule
        </h1>
      </div>
      <div className="mx-auto max-w-2xl">
        <Tabs defaultValue="day1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="day1">Day 1</TabsTrigger>
            <TabsTrigger value="day2">Day 2</TabsTrigger>
          </TabsList>
          <TabsContent value="day1">
            <ScheduleTimeline events={day1Events} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="day2">
            <ScheduleTimeline events={day2Events} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
        {error && <p className="text-center text-destructive mt-4">Error loading schedule: {error.message}</p>}
      </div>
    </div>
  );
}
