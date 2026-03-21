'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Card,
} from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay"
import { topStatesData, topCollegesData } from '@/lib/data';
import Image from 'next/image';


export function PastPerformanceSection() {
    return (
        <section id="past-performance" className="py-20">
          <div className="container">
              <h2 className="text-center text-3xl font-headline font-bold mb-12">
              Past Performances
              </h2>
              <div className="space-y-16">
                  <div>
                      <h3 className="text-center text-2xl font-headline font-semibold mb-8">Participating States</h3>
                      <Carousel
                        plugins={[
                            Autoplay({
                              delay: 5000,
                              stopOnInteraction: true,
                            })
                          ]}
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        className="w-full max-w-5xl mx-auto"
                      >
                        <CarouselContent>
                          {topStatesData.map((state) => (
                                <CarouselItem key={state.name} className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                                <div className="p-1">
                                    <Card className="flex flex-col items-center p-6 text-center transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
                                        <div className="relative h-20 w-20 mb-4 overflow-hidden rounded-full">
                                            <Image
                                                src={state.imageUrl}
                                                alt={state.name}
                                                fill
                                                className="object-cover"
                                                data-ai-hint={state.imageHint}
                                            />
                                        </div>
                                        <h4 className="font-semibold text-lg">{state.name}</h4>
                                    </Card>
                                </div>
                                </CarouselItem>
                            )
                          )}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                  </div>
                  <div>
                      <h3 className="text-center text-2xl font-headline font-semibold mb-8"> Participating Colleges</h3>
                      <Carousel
                        plugins={[
                            Autoplay({
                              delay: 5000,
                              stopOnInteraction: true,
                            })
                          ]}
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        className="w-full max-w-5xl mx-auto"
                      >
                        <CarouselContent>
                          {topCollegesData.map((college) => (
                            <CarouselItem key={college.name} className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                              <div className="p-1">
                                <Card className="flex flex-col items-center justify-center p-6 text-center h-40 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2">
                                  <GraduationCap className="h-10 w-10 text-primary mb-4" />
                                  <h4 className="font-semibold text-lg">{college.name}</h4>
                                </Card>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                      </Carousel>
                  </div>
              </div>
          </div>
        </section>
    )
}
