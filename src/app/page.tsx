import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Lightbulb,
  Megaphone,
  Rocket,
  Users,
  Code,
  Calendar,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { sponsors } from '@/lib/data.tsx';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MainNav } from '@/components/main-nav';
import { Footer } from '@/components/footer';
import { ConductedBy } from '@/components/conducted-by';

const heroImage = PlaceHolderImages.find(p => p.id === "hero");

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <section className="relative py-20 md:py-32 bg-background">
        {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/80" />
          <div className="container text-center relative">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-primary-foreground">
              HackNation
            </h1>
            <p className="mx-auto mt-4 max-w-[700px] text-lg md:text-xl text-primary-foreground/80">
              Innovate. Collaborate. Create. The future is in your hands.
            </p>
            <div className="mt-6 flex items-center justify-center gap-6 text-lg text-primary-foreground">
                <div className='flex items-center gap-2'>
                    <Calendar className='h-5 w-5 text-destructive' />
                    <span>12 & 13 Aug, 2026</span>
                </div>
                <div className='flex items-center gap-2'>
                    <MapPin className='h-5 w-5 text-destructive' />
                    <span>Shivalik College of Engineering,Dehradun</span>
                </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/register">Register Now</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="container grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="font-headline text-3xl font-bold">
                About HackNation
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                HackNation is the country's most prestigious hackathon, bringing
                together the brightest minds to solve real-world problems
                through technology. Over 48 hours, participants will form
                teams, brainstorm ideas, and build a project from scratch with
                the help of our mentors and workshops.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <Lightbulb className="mt-1 h-10 w-10 text-accent" />
                <div>
                  <h3 className="font-semibold">Innovate</h3>
                  <p className="text-sm text-muted-foreground">
                    Turn your creative ideas into tangible solutions.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="mt-1 h-10 w-10 text-accent" />
                <div>
                  <h3 className="font-semibold">Collaborate</h3>
                  <p className="text-sm text-muted-foreground">
                    Meet new people and form powerful teams.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Code className="mt-1 h-10 w-10 text-accent" />
                <div>
                  <h3 className="font-semibold">Build</h3>
                  <p className="text-sm text-muted-foreground">
                    Code, design, and create a functional prototype.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Rocket className="mt-1 h-10 w-10 text-accent" />
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

        <section id="sponsors" className="py-16 bg-background">
          <div className="container">
            <h2 className="text-center text-3xl font-headline font-bold mb-12">
              Our Sponsors
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-10 gap-x-6 items-center justify-items-center">
              {sponsors.map((sponsor) => (
                <div key={sponsor.name} className="flex flex-col items-center justify-center text-center gap-3">
                  {sponsor.icon}
                  <span className="text-base font-semibold text-muted-foreground">{sponsor.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="conducted-by" className="py-20 bg-muted/40">
          <div className="container">
            <ConductedBy />
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
