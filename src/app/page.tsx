import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Lightbulb,
  Rocket,
  Users,
  Code,
  Calendar,
  MapPin,
  Check,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { sponsors, previousParticipants, topStatesData, topCollegesData } from '@/lib/data.tsx';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MainNav } from '@/components/main-nav';
import { Footer } from '@/components/footer';
import { ConductedBy } from '@/components/conducted-by';
import { PerformanceChart } from '@/components/performance-charts';
import { CountdownCard } from '@/components/countdown-card';
import { RegistrationCountCard } from '@/components/registration-count-card';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
const galleryImages = PlaceHolderImages.filter(p => p.id.startsWith('gallery-'));

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
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-destructive" />
                <span>16ᵗʰ & 17ᵗʰ April,2026</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-destructive" />
                <span>Shivalik College of Engineering,Dehradun</span>
              </div>
            </div>
            <div className="mt-8 flex justify-center gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg">Register Now</Button>
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
                          Get the full hackathon experience with exclusive
                          goodies.
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
                through technology. Over 36 hours, participants will form
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

        <section id="live-stats" className="py-20 bg-muted/40">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <CountdownCard />
              <RegistrationCountCard />
            </div>
          </div>
        </section>

        <section id="gallery" className="py-20 bg-background">
          <div className="container">
            <h2 className="text-center text-3xl font-headline font-bold mb-12">
              Glimpses of HackNation 2025
            </h2>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-4xl mx-auto"
            >
              <CarouselContent>
                {galleryImages.map((image) => (
                  <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden group">
                        <CardContent className="flex aspect-video items-center justify-center p-0">
                          <Image
                              src={image.imageUrl}
                              alt={image.description}
                              width={600}
                              height={400}
                              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                              data-ai-hint={image.imageHint}
                            />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        <section id="best-performers" className="py-20">
          <div className="container">
            <h2 className="text-center text-3xl font-headline font-bold mb-12">
              Best Performers in Hackathon 2025
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {previousParticipants.map((participant) => (
                <Card key={participant.id} className="text-center transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl">
                  <CardContent className="p-6">
                    <Image
                      src={participant.imageUrl}
                      alt={participant.name}
                      width={128}
                      height={128}
                      className="rounded-full mx-auto mb-4 border-4 border-primary/20 object-cover h-32 w-32"
                      data-ai-hint={participant.imageHint}
                    />
                    <h3 className="font-semibold text-lg">{participant.name}</h3>
                    <p className="text-sm text-muted-foreground">{participant.college}</p>
                  </CardContent>
                  <CardFooter className="flex-col items-center justify-center p-4 border-t">
                      <p className="text-sm font-semibold flex items-center gap-2 text-accent"><Trophy className="h-4 w-4"/> Winner</p>
                      <p className="text-xs text-muted-foreground mt-1 text-center">{participant.project}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <PerformanceChart 
                    data={topStatesData} 
                    title="Top 5 States"
                    description="States with the highest number of participants in previous editions."
                    barColor="hsl(var(--primary))"
                />
                <PerformanceChart 
                    data={topCollegesData} 
                    title="Top 5 Colleges"
                    description="Colleges that have consistently shown outstanding participation."
                    barColor="hsl(var(--accent))"
                />
            </div>
          </div>
        </section>

        <section id="sponsors" className="py-16 bg-background">
          <div className="container">
            <h2 className="text-center text-3xl font-headline font-bold mb-12">
              Our Sponsors
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-10 gap-x-6 items-center justify-items-center">
              {sponsors.map(sponsor => (
                <div
                  key={sponsor.name}
                  className="flex flex-col items-center justify-center text-center gap-3 transition-transform duration-300 hover:scale-110"
                >
                  {sponsor.icon}
                  <span className="text-base font-semibold text-muted-foreground">
                    {sponsor.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="managed-by" className="py-20 bg-muted/40">
          <div className="container">
            <ConductedBy />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
