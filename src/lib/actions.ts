
'use server';

import { summarizeJudgingFeedback } from '@/ai/flows/summarize-judging-feedback';
import { chat, type Message } from '@/ai/flows/chat-flow';
import { generateProjectIdeas } from '@/ai/flows/generate-project-ideas-flow';

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

export async function generateIdeasAction() {
    try {
        const result = await generateProjectIdeas();
        return { ideas: result.ideas, error: null };
    } catch (error) {
        console.error(error);
        return { ideas: null, error: 'Failed to generate project ideas.' };
    }
}
