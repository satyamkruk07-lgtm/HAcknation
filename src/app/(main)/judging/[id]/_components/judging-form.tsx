
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
import { Lightbulb, Loader2, Sparkles, Trophy, Mic, Brush, Code, ChevronRight, ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const judgingRounds = [
  {
    id: 'round1',
    name: 'Idea & Innovation',
    icon: Lightbulb,
    questions: [
      'Originality of the Idea',
      'Problem Significance',
      'Innovation Level',
      'Potential Impact',
      'Clarity of Value Proposition',
    ],
  },
  {
    id: 'round2',
    name: 'Technical Implementation',
    icon: Code,
    questions: [
      'Code Quality & Structure',
      'Technical Complexity',
      'Use of Technology Stack',
      'Functionality & Completeness',
      'Scalability Potential',
    ],
  },
  {
    id: 'round3',
    name: 'Design & UX',
    icon: Brush,
    questions: [
      'Visual Appeal & Aesthetics',
      'User-Friendliness',
      'Responsiveness & Accessibility',
      'Clarity of User Flow',
      'Overall User Experience',
    ],
  },
  {
    id: 'round4',
    name: 'Presentation & Demo',
    icon: Mic,
    questions: [
      'Clarity of Presentation',
      'Effectiveness of the Demo',
      'Team\'s Understanding of the Project',
      'Ability to Answer Questions',
      'Overall Presentation Quality',
    ],
  },
  {
    id: 'round5',
    name: 'Feasibility & Impact',
    icon: Trophy,
    questions: [
      'Business Model/Monetization Strategy',
      'Market Fit and Potential',
      'Real-world Applicability',
      'Future Scope for Development',
      'Overall Impression',
    ],
  },
];

const initialScores = judgingRounds.reduce((acc, round) => {
    round.questions.forEach((_, qIndex) => {
        acc[`${round.id}-q${qIndex}`] = 5;
    });
    return acc;
}, {} as Record<string, number>);


export default function JudgingForm() {
  const [feedback, setFeedback] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [currentTab, setCurrentTab] = useState(judgingRounds[0].id);
  const [scores, setScores] = useState<Record<string, number>>(initialScores);

  const handleScoreChange = (key: string, value: number[]) => {
    setScores(prev => ({...prev, [key]: value[0]}));
  };

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
  
  const navigateTabs = (direction: 'next' | 'prev') => {
    const currentIndex = judgingRounds.findIndex(r => r.id === currentTab);
    if (direction === 'next' && currentIndex < judgingRounds.length - 1) {
      setCurrentTab(judgingRounds[currentIndex + 1].id);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentTab(judgingRounds[currentIndex - 1].id);
    }
  };

  const isFirstTab = currentTab === judgingRounds[0].id;
  const isLastTab = currentTab === judgingRounds[judgingRounds.length - 1].id;

  return (
    <div className="space-y-8">
      <Card>
        <form onSubmit={handleFeedbackSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Judge&apos;s Scorecard
            </CardTitle>
            <CardDescription>
              Evaluate the project across 5 rounds. Use the tabs to navigate between rounds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                 {judgingRounds.map((round) => (
                    <TabsTrigger key={round.id} value={round.id} className="flex flex-col h-auto p-2 gap-1 sm:flex-row">
                        <round.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{round.name}</span>
                    </TabsTrigger>
                ))}
              </TabsList>
              {judgingRounds.map((round) => (
                <TabsContent key={round.id} value={round.id} className="py-6 px-2 space-y-8">
                    <h3 className="text-xl font-semibold font-headline text-center">{round.name}</h3>
                    {round.questions.map((question, index) => {
                        const scoreKey = `${round.id}-q${index}`;
                        return (
                            <div key={index} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <Label className="text-base">{question}</Label>
                                    <span className="text-sm font-bold w-12 text-center bg-primary/10 text-primary rounded-md py-1">
                                        {scores[scoreKey]}
                                    </span>
                                </div>
                                <Slider 
                                    value={[scores[scoreKey]]}
                                    onValueChange={(value) => handleScoreChange(scoreKey, value)}
                                    max={10} 
                                    step={1} 
                                />
                            </div>
                        );
                    })}
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-6 flex justify-between">
              <Button type="button" onClick={() => navigateTabs('prev')} disabled={isFirstTab}>
                <ChevronLeft className="mr-2" /> Previous
              </Button>
              <Button type="button" onClick={() => navigateTabs('next')} disabled={isLastTab}>
                Next <ChevronRight className="ml-2" />
              </Button>
            </div>
            
            <div className="mt-8 space-y-2">
              <Label htmlFor="feedback" className="text-lg">Final Qualitative Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Provide detailed overall comments on the project's strengths and areas for improvement."
                className="min-h-[150px]"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={feedbackSubmitted}>
              {feedbackSubmitted ? 'Feedback Submitted' : 'Submit Final Feedback'}
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
