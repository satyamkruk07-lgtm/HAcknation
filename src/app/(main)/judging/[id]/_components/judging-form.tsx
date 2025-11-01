'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateSummaryAction } from '@/lib/actions';
import { Lightbulb, Loader2, Sparkles } from 'lucide-react';

export default function JudgingForm() {
  const [feedback, setFeedback] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      setFeedbackSubmitted(true);
    }
  };

  const handleGenerateSummary = async () => {
    if (!feedback) return;
    setIsLoading(true);
    setError(null);
    setSummary('');

    const result = await generateSummaryAction(feedback);

    if (result.error) {
      setError(result.error);
    } else if (result.summary) {
      setSummary(result.summary);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <Card>
        <form onSubmit={handleFeedbackSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Judge&apos;s Scorecard
            </CardTitle>
            <CardDescription>
              Rate the project on the following criteria and provide feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Innovation & Creativity (0-10)</Label>
              <Slider defaultValue={[5]} max={10} step={1} />
            </div>
            <div className="space-y-3">
              <Label>Technical Execution (0-10)</Label>
              <Slider defaultValue={[5]} max={10} step={1} />
            </div>
            <div className="space-y-3">
              <Label>Design & User Experience (0-10)</Label>
              <Slider defaultValue={[5]} max={10} step={1} />
            </div>
            <div className="space-y-3">
              <Label>Presentation (0-10)</Label>
              <Slider defaultValue={[5]} max={10} step={1} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Qualitative Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Provide detailed comments on the project's strengths and areas for improvement."
                className="min-h-[150px]"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={feedbackSubmitted}>
              {feedbackSubmitted ? 'Feedback Submitted' : 'Submit Feedback'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {feedbackSubmitted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <Sparkles className="h-6 w-6 text-accent" />
              AI-Powered Feedback Summary
            </CardTitle>
            <CardDescription>
              Generate a concise summary of your feedback for the participants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {summary && (
              <Alert>
                 <Lightbulb className="h-4 w-4" />
                <AlertTitle>Feedback Summary</AlertTitle>
                <AlertDescription>
                  <p className="whitespace-pre-wrap">{summary}</p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerateSummary}
              disabled={isLoading || !feedback}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? 'Generating...' : 'Generate Summary'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
