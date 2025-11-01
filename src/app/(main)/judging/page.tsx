import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { projects } from '@/lib/data.tsx';
import { ArrowRight, Github } from 'lucide-react';

export default function JudgingPage() {
  return (
    <div className="container py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold">Judging Dashboard</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Review submissions and provide your feedback.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>
                by {project.team.join(', ')}
              </CardDescription>
            </CardHeader>
            <div className="p-6 pt-0 flex-1">
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <CardFooter className="flex justify-between">
              <Button asChild variant="ghost" size="sm">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
              <Button asChild>
                <Link href={`/judging/${project.id}`}>
                  Judge Project <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
