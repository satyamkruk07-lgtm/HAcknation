'use server';

import { summarizeJudgingFeedback } from '@/ai/flows/summarize-judging-feedback';
import { chat, type Message } from '@/ai/flows/chat-flow';
import { syncUsersToSheet } from '@/ai/flows/sync-to-sheet-flow';


export async function generateSummaryAction(feedback: string) {
  try {
    const result = await summarizeJudgingFeedback({ feedback });
    return { summary: result.summary, error: null };
  } catch (error) {
    console.error(error);
    return { summary: null, error: 'Failed to generate summary.' };
  }
}

export async function chatWithAI(messages: Message[]) {
    try {
        const result = await chat({ messages });
        return { response: result.response, error: null };
    } catch (error) {
        console.error(error);
        return { response: null, error: 'Failed to get response from AI.'};
    }
}

export async function syncDataToSheet() {
  try {
    const result = await syncUsersToSheet();
    return { ...result, error: null };
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { status: 'Error', rowsAdded: 0, error: errorMessage };
  }
}
