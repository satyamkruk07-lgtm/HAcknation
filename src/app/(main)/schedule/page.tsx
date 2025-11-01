
import { schedule } from '@/lib/data.tsx';
import type { ScheduleEvent } from '@/lib/types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const day1Events = schedule.filter((event) => event.time.startsWith('Day 1'));
const day2Events = schedule.filter((event) => event.time.startsWith('Day 2'));

const ScheduleTimeline = ({ events }: { events: ScheduleEvent[] }) => (
  <div className="relative pt-6">
    <div
      className="absolute left-6 top-0 h-full w-0.5 bg-border"
      aria-hidden="true"
    />
    <ul className="space-y-8">
      {events.map((event) => (
        <li key={event.id} className="relative pl-16">
          <div className="absolute left-0 top-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground ring-8 ring-background">
            <event.icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="text-sm font-semibold text-muted-foreground">
              {event.time.split(' - ')[1]}
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
      ))}
    </ul>
  </div>
);

export default function SchedulePage() {
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
