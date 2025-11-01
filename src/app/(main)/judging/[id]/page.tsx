import { notFound } from 'next/navigation';
import { projects } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import JudgingForm from './_components/judging-form';

export default function ProjectJudgingPage({
  params,
}: {
  params: { id: string };
}) {
  const project = projects.find((p) => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="font-headline text-4xl font-bold">{project.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            by {project.team.join(', ')}
          </p>
          <p className="mt-4">{project.description}</p>
          <div className="mt-6 flex gap-4">
            <Button asChild variant="outline">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Live Demo
              </a>
            </Button>
          </div>
        </div>
        
        <JudgingForm />
      </div>
    </div>
  );
}
