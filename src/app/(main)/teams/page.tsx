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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { teamProfiles } from '@/lib/data';
import { Mail } from 'lucide-react';

export default function TeamsPage() {
  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold">Find Your Team</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Connect with other hackers and build your dream team.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-6 font-headline text-2xl font-bold">
            Looking for a Team
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Join the Board</CardTitle>
              <CardDescription>
                Add your profile to find a team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Ada Lovelace" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="ada@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Input id="skills" placeholder="React, Python, Figma..." />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated skills.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Short Bio</Label>
                  <Textarea id="bio" placeholder="Tell us about yourself." />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add My Profile</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
