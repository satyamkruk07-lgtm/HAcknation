
'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { teamProfiles as initialTeamProfiles } from '@/lib/data.tsx';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import type { TeamMemberProfile } from '@/lib/types';

export default function TeamsPage() {
  const [teamProfiles, setTeamProfiles] = useState<TeamMemberProfile[]>(initialTeamProfiles);

  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold">Find Your Team</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Connect with other hackers and build your dream team.
        </p>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 font-headline text-2xl font-bold">
          Looking for a Team
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teamProfiles.map((profile) => (
            <Card key={profile.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                  data-ai-hint="person portrait"
                />
                <div>
                  <CardTitle>{profile.name}</CardTitle>
                  <CardDescription>{profile.bio}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="mr-2 h-4 w-4" /> Connect
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
