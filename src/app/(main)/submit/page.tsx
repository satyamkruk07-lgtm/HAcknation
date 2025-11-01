import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function SubmitPage() {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-2xl">
        <form>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Submit Your Project
            </CardTitle>
            <CardDescription>
              Fill out the form below to submit your project for judging. Good
              luck!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input id="project-name" placeholder="e.g., EcoTrack" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-members">Team Members</Label>
                <Input
                  id="team-members"
                  placeholder="John Doe, Jane Smith..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Please enter full names, separated by commas.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project in a few sentences."
                  className="min-h-[120px]"
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="github-url">GitHub Repository URL</Label>
                  <Input
                    id="github-url"
                    type="url"
                    placeholder="https://github.com/..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="demo-url">Live Demo URL</Label>
                  <Input
                    id="demo-url"
                    type="url"
                    placeholder="https://yourapp.com"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="presentation">Presentation File</Label>
                <Input id="presentation" type="file" required />
                <p className="text-xs text-muted-foreground">
                  Upload a PDF or PowerPoint file.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full sm:w-auto">
              Submit for Judging
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
