'use client';

import { useMemo } from 'react';
import { schedule as staticSchedule } from '@/lib/data';
import type { ScheduleEvent as ScheduleEventType } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ScheduleTimeline = ({ events }: { events: ScheduleEventType[] }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No events scheduled for this day yet.</p>
      </div>
    );
  }

  return (
    <div className="relative pt-6">
      <div className="absolute left-6 top-0 h-full w-0.5 bg-border" aria-hidden="true" />
      <ul className="space-y-8">
        {events.map((event) => {
          const EventIcon = event.icon || 'div';
          return (
            <li key={event.id} className="relative pl-16 group">
              <div className="absolute left-0 top-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground ring-8 ring-background transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <EventIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="bg-card p-4 rounded-lg border shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02] group-hover:-translate-x-1">
                <div className="text-sm font-semibold text-muted-foreground">
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
          );
        })}
      </ul>
    </div>
  );
};

export default function SchedulePage() {
  const { day1Events, day2Events } = useMemo(() => {
    const d1: ScheduleEventType[] = [];
    const d2: ScheduleEventType[] = [];
    staticSchedule.forEach(event => {
      if (event.time.toLowerCase().startsWith('day 1')) {
        d1.push(event);
      } else if (event.time.toLowerCase().startsWith('day 2')) {
        d2.push(event);
      }
    });
    return { day1Events: d1, day2Events: d2 };
  }, []);

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
            <ScheduleTimeline events={day1Events} />
          </TabsContent>
          <TabsContent value="day2">
            <ScheduleTimeline events={day2Events} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
