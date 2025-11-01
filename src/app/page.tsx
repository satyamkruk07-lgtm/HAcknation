
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Lightbulb,
  Megaphone,
  Rocket,
  Users,
  Code,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { announcements, sponsors } from '@/lib/data.tsx';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MainNav } from '@/components/main-nav';
import { Footer } from '@/components/footer';

const heroImage = PlaceHolderImages.find(p => p.id === "hero");

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <section className="relative py-20 md:py-32">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="absolute inset-0 object-cover w-full h-full -z-10 brightness-50"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="container text-center text-primary-foreground">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              HackTrack
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-lg md:text-xl">
              Innovate. Collaborate. Create. The future is in your hands.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/register">Register Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-background">
                <Link href="/schedule">View Schedule</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="sponsors" className="py-16 bg-background">
          <div className="container">
            <h2 className="text-center text-3xl font-headline font-bold mb-8">
              Our Sponsors
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {sponsors.map((sponsor) => (
                <div key={sponsor.name} className="flex items-center space-x-3">
                  {sponsor.icon}
                  <span className="text-xl font-semibold">{sponsor.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="container grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-headline text-3xl font-bold">
                About HackTrack
              </h2>
              <p className="mt-4 text-muted-foreground">
                HackTrack is the country's most prestigious hackathon, bringing
                together the brightest minds to solve real-world problems
                through technology. Over 48 hours, participants will form
                teams, brainstorm ideas, and build a project from scratch with
                the help of our mentors and workshops.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <Lightbulb className="mt-1 h-8 w-8 text-accent" />
                <div>
                  <h3 className="font-semibold">Innovate</h3>
                  <p className="text-sm text-muted-foreground">
                    Turn your creative ideas into tangible solutions.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="mt-1 h-8 w-8 text-accent" />
                <div>
                  <h3 className="font-semibold">Collaborate</h3>
                  <p className="text-sm text-muted-foreground">
                    Meet new people and form powerful teams.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Code className="mt-1 h-8 w-8 text-accent" />
                <div>
                  <h3 className="font-semibold">Build</h3>
                  <p className="text-sm text-muted-foreground">
                    Code, design, and create a functional prototype.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Rocket className="mt-1 h-8 w-8 text-accent" />
                <div>
                  <h3 className="font-semibold">Launch</h3>
                  <p className="text-sm text-muted-foreground">
                    Present your project to a panel of expert judges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="announcements" className="py-20 bg-background">
          <div className="container">
            <h2 className="mb-8 text-center font-headline text-3xl font-bold">
              Live Announcements
            </h2>
            <div className="mx-auto max-w-2xl">
              <Card>
                <CardContent className="p-6">
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {announcements.map((announcement, announcementIdx) => (
                        <li key={announcement.id}>
                          <div className="relative pb-8">
                            {announcementIdx !== announcements.length - 1 ? (
                              <span
                                className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-border"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex items-start space-x-3">
                              <div className="relative">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground ring-8 ring-background">
                                  <Megaphone
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </div>
                              </div>
                              <div className="min-w-0 flex-1 py-1.5">
                                <div className="text-sm text-muted-foreground">
                                  <Badge variant={announcement.type === 'Update' ? 'default' : 'secondary'}>{announcement.type}</Badge>
                                  <span className="ml-2 whitespace-nowrap">
                                    {announcement.time}
                                  </span>
                                </div>
                                <div className="mt-2">
                                  <p className="text-foreground">
                                    {announcement.content}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
