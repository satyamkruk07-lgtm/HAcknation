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
  Lightbulb,
  Rocket,
  Users,
  Code,
  Calendar,
  MapPin,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { sponsors } from '@/lib/data.tsx';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MainNav } from '@/components/main-nav';
import { Footer } from '@/components/footer';
import { ConductedBy } from '@/components/conducted-by';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

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
                <span>17ᵗʰ & 18ᵗʰ April,2026</span>
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
                <DialogContent className="sm:max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-center font-headline text-3xl">
                      Choose Your Plan
                    </DialogTitle>
                    <DialogDescription className="text-center text-lg">
                      Select the registration type that suits you best.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 max-h-[70vh] overflow-y-auto">
                    <Card className="flex flex-col border-primary border-2 shadow-lg shadow-primary/20">
                      <CardHeader>
                        <CardTitle className="text-2xl">With Kit</CardTitle>
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
                            <span>Official Hackathon T-Shirt</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                            <span>Exclusive Sticker Pack & Goodies</span>
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
                            Register With Kit
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card className="flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-2xl">Without Kit</CardTitle>
                        <CardDescription>
                          Just the essentials for a great hackathon.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-4">
                        <p className="text-4xl font-bold">₹0</p>
                        <ul className="space-y-2 text-muted-foreground">
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
                        <Button
                          asChild
                          className="w-full"
                          variant="secondary"
                        >
                          <Link href="/register?plan=without-kit">
                            Register Without Kit
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

        <section id="sponsors" className="py-16 bg-background">
          <div className="container">
            <h2 className="text-center text-3xl font-headline font-bold mb-12">
              Our Sponsors
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-10 gap-x-6 items-center justify-items-center">
              {sponsors.map(sponsor => (
                <div
                  key={sponsor.name}
                  className="flex flex-col items-center justify-center text-center gap-3"
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
