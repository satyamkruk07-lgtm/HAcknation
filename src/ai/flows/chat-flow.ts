
'use server';
/**
 * @fileOverview A simple chat flow for the AI Discussion page.
 *
 * - chat - A function that handles the chat interaction.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 * - Message - The type for a single chat message.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  text: z.string().describe('The text content of the message.'),
  isUser: z.boolean().describe('True if the message is from the user, false if from the AI.'),
});

export type Message = z.infer<typeof MessageSchema>;

const ChatInputSchema = z.object({
  messages: z.array(MessageSchema).describe('The history of messages in the conversation.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response message.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are a helpful AI assistant for participants in a hackathon called HackTrack. Your role is to help them with their projects. You can help them brainstorm ideas, refine features, suggest technologies, and provide code snippets. Be encouraging and supportive.

Here is the conversation history:
{{#each messages}}
  {{#if isUser}}
    User: {{{text}}}
  {{else}}
    AI: {{{text}}}
  {{/if}}
{{/each}}
AI:`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: prompt.render(input)!.prompt,
      model: 'googleai/gemini-2.5-flash',
      output: {
        format: 'text'
      }
    });

    return { response: llmResponse.text };
  }
);
