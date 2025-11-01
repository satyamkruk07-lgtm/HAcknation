'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lightbulb, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { generateIdeasAction } from '@/lib/actions';
import type { ProjectIdea } from '@/ai/flows/generate-project-ideas-flow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AiDiscussionPage() {
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateIdeas = async () => {
    setIsLoading(true);
    setError(null);
    setIdeas([]);
    try {
      const result = await generateIdeasAction();
      if (result.ideas) {
        setIdeas(result.ideas);
      } else {
        setError(
          result.error || "Sorry, I couldn't come up with ideas. Please try again."
        );
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">
              AI Project Idea Generator
            </CardTitle>
            <CardDescription className="text-lg">
              Feeling stuck? Let our AI mentor brainstorm some project ideas for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGenerateIdeas} disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate New Ideas
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
            <Alert variant="destructive" className="mt-8">
                <AlertTitle>Error Generating Ideas</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {ideas.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center font-headline mb-8">
                Here are a few ideas to get you started:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea, index) => (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-start gap-3">
                        <Lightbulb className="h-6 w-6 mt-1 text-accent" />
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
        )}
      </div>
    </div>
  );
}
