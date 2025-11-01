'use server';

/**
 * @fileOverview Summarizes judging feedback using AI to provide participants with key areas for improvement.
 *
 * - summarizeJudgingFeedback - A function that summarizes the feedback from judges.
 * - SummarizeJudgingFeedbackInput - The input type for the summarizeJudgingFeedback function.
 * - SummarizeJudgingFeedbackOutput - The return type for the summarizeJudgingFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeJudgingFeedbackInputSchema = z.object({
  feedback: z.string().describe('The feedback from the judges.'),
});
export type SummarizeJudgingFeedbackInput = z.infer<typeof SummarizeJudgingFeedbackInputSchema>;

const SummarizeJudgingFeedbackOutputSchema = z.object({
  summary: z.string().describe('A summary of the feedback.'),
});
export type SummarizeJudgingFeedbackOutput = z.infer<typeof SummarizeJudgingFeedbackOutputSchema>;

export async function summarizeJudgingFeedback(input: SummarizeJudgingFeedbackInput): Promise<SummarizeJudgingFeedbackOutput> {
  return summarizeJudgingFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeJudgingFeedbackPrompt',
  input: {schema: SummarizeJudgingFeedbackInputSchema},
  output: {schema: SummarizeJudgingFeedbackOutputSchema},
  prompt: `You are an AI assistant that summarizes feedback from judges for hackathon participants. Please provide a concise summary of the following feedback, highlighting key areas for improvement:\n\nFeedback: {{{feedback}}}`,
});

const summarizeJudgingFeedbackFlow = ai.defineFlow(
  {
    name: 'summarizeJudgingFeedbackFlow',
    inputSchema: SummarizeJudgingFeedbackInputSchema,
    outputSchema: SummarizeJudgingFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
