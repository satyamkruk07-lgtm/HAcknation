'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Mail, Linkedin, BookOpen, Phone } from 'lucide-react';
import { conductors } from '@/lib/data';
import type { Conductor } from '@/lib/types';

const renderRole = (role: string) => {
  return role.split('\n').map((line, index, arr) => (
    <React.Fragment key={index}>
      {line}
      {index < arr.length - 1 && <br />}
    </React.Fragment>
  ));
};

export function ConductedBy() {
  const [selectedConductor, setSelectedConductor] = useState<Conductor | null>(null);

  const handleConductorSelect = (conductor: Conductor) => {
    setSelectedConductor(conductor);
  };

  const mainConductor = conductors.find(c => c.name === "Mr. Kumar Satyam");
  const otherConductors = conductors.filter(c => c.name !== "Mr. Kumar Satyam");

  return (
    <>
      <div className="mt-12">
        <div className="flex items-center justify-center gap-4 mb-8">
          <h2 className="font-headline text-2xl font-bold text-center">Conducted By</h2>
          <Button asChild>
            <a href="tel:7060550243">
              <Phone className="mr-2 h-4 w-4" />
              Help
            </a>
          </Button>
        </div>
        <div className="flex flex-col items-center gap-12">
          {mainConductor && (
            <div className="flex justify-center">
              <div key={mainConductor.id} className="flex flex-col items-center text-center gap-2">
                <button 
                  onClick={() => handleConductorSelect(mainConductor)}
                  className="rounded-full"
                >
                  <Image
                    src={mainConductor.imageUrl || `https://picsum.photos/seed/${mainConductor.id}/128/128`}
                    alt={`Portrait of ${mainConductor.name}`}
                    width={112}
                    height={112}
                    className="rounded-full border-4 border-background shadow-lg transition-transform hover:scale-105 object-cover h-28 w-28"
                    data-ai-hint="person portrait"
                  />
                </button>
                <div className="mt-2">
                  <h3 className="font-semibold text-lg">{mainConductor.name}</h3>
                  <p className="text-base text-muted-foreground">{renderRole(mainConductor.role)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-32 gap-y-12">
            {otherConductors.map((conductor) => (
              <div key={conductor.id} className="flex flex-col items-center text-center gap-2">
                <button 
                  onClick={() => handleConductorSelect(conductor)}
                  className="rounded-full"
                >
                  <Image
                    src={conductor.imageUrl || `https://picsum.photos/seed/${conductor.id}/96/96`}
                    alt={`Portrait of ${conductor.name}`}
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-background shadow-lg transition-transform hover:scale-105 object-cover h-24 w-24"
                    data-ai-hint="person portrait"
                  />
                </button>
                <div className="mt-2">
                  <h3 className="font-semibold text-base">{conductor.name}</h3>
                  <p className="text-sm text-muted-foreground">{renderRole(conductor.role)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedConductor && (
        <Dialog open={!!selectedConductor} onOpenChange={(open) => !open && setSelectedConductor(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="items-center text-center">
                <Image
                    src={selectedConductor.imageUrl || `https://picsum.photos/seed/${selectedConductor.id}/96/96`}
                    alt={selectedConductor.name}
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-background shadow-lg object-cover"
                    data-ai-hint="person portrait"
                  />
              <div className='pt-2'>
                <DialogTitle className="text-2xl font-headline">{selectedConductor.name}</DialogTitle>
                <DialogDescription>{renderRole(selectedConductor.role)}</DialogDescription>
              </div>
            </DialogHeader>
            <div className="py-4 grid gap-6">
                <div className='space-y-4'>
                    <h4 className="font-semibold text-center text-muted-foreground text-sm uppercase tracking-wider">Contact</h4>
                    <div className='flex items-center justify-center gap-4'>
                        <Button variant="outline" size="icon" asChild>
                            <a href={`mailto:${selectedConductor.email}`} aria-label="Email">
                                <Mail className="h-5 w-5" />
                            </a>
                        </Button>
                         <Button variant="outline" size="icon" asChild>
                            <a href={selectedConductor.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </Button>
                    </div>
                </div>

                <div className='space-y-2 text-center'>
                    <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Qualification</h4>
                    <p className="text-sm flex items-center justify-center gap-2"><BookOpen className="h-4 w-4 text-accent" /> {selectedConductor.qualification}</p>
                </div>

                <div className='space-y-3 text-center'>
                    <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Skills</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {selectedConductor.skills.map(skill => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
