
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import { BrainCircuit } from 'lucide-react';
  
  export default function AiDiscussionPage() {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <BrainCircuit className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="font-headline text-3xl">
                AI Project Discussion
              </CardTitle>
              <CardDescription className="text-lg">
                This feature is coming soon! Get ready to brainstorm and refine your
                hackathon ideas with an AI partner.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                You&apos;ll be able to describe your project, get feedback on its
                feasibility, ask for technical suggestions, and even generate
                code snippets to get you started.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  