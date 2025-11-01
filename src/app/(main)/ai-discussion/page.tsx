'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lightbulb, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { projectIdeas } from '@/lib/data';
import type { ProjectIdea } from '@/lib/types';

export default function AiDiscussionPage() {
  const ideas: ProjectIdea[] = projectIdeas;

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h1 className="font-headline text-3xl font-bold">
              Curated Project Ideas
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Here are some ideas to spark your creativity for the hackathon.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-start gap-3">
                    <Lightbulb className="h-6 w-6 mt-1 text-accent flex-shrink-0" />
                    <span>{idea.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground">{idea.description}</p>
              </CardContent>
              <CardContent>
                 <h4 className="font-semibold text-sm mb-3">Suggested Tech:</h4>
                 <div className="flex flex-wrap gap-2">
                    {idea.technologies.map(tech => (
                        <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
