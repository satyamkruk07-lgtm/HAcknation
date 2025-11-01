'use server';

import { summarizeJudgingFeedback } from '@/ai/flows/summarize-judging-feedback';

export async function generateSummaryAction(feedback: string) {
  try {
    const result = await summarizeJudgingFeedback({ feedback });
    return { summary: result.summary, error: null };
  } catch (error) {
    console.error(error);
    return { summary: null, error: 'Failed to generate summary.' };
  }
}
