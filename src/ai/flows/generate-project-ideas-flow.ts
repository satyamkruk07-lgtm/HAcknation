'use server';
/**
 * @fileOverview An AI flow for generating hackathon project ideas.
 *
 * - generateProjectIdeas - A function that generates a list of project ideas.
 * - ProjectIdea - The type for a single project idea.
 * - GenerateProjectIdeasOutput - The return type for the generateProjectIdeas function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProjectIdeaSchema = z.object({
  title: z.string().describe('A catchy and descriptive title for the project.'),
  description: z
    .string()
    .describe('A one or two-sentence summary of what the project is.'),
  technologies: z
    .array(z.string())
    .describe('A list of 3-5 suggested technologies or APIs to build this project.'),
});

export type ProjectIdea = z.infer<typeof ProjectIdeaSchema>;

const GenerateProjectIdeasOutputSchema = z.object({
  ideas: z
    .array(ProjectIdeaSchema)
    .describe('An array of 3 unique hackathon project ideas.'),
});
export type GenerateProjectIdeasOutput = z.infer<
  typeof GenerateProjectIdeasOutputSchema
>;

export async function generateProjectIdeas(): Promise<GenerateProjectIdeasOutput> {
  return generateProjectIdeasFlow();
}

const prompt = ai.definePrompt({
  name: 'projectIdeasPrompt',
  output: { schema: GenerateProjectIdeasOutputSchema },
  prompt: `You are an expert hackathon mentor, skilled at brainstorming innovative and impactful project ideas.

Generate a list of 3 unique and exciting project ideas for a hackathon.

For each idea, provide a catchy title, a short description (1-2 sentences), and a list of 3-5 suggested technologies or APIs that could be used.

The ideas should be creative, technically feasible within a 48-hour hackathon, and have the potential for a real-world impact. Focus on themes like sustainability, health tech, education, or social good. Avoid generic ideas like "a social media app" or "a simple to-do list".`,
});

const generateProjectIdeasFlow = ai.defineFlow(
  {
    name: 'generateProjectIdeasFlow',
    outputSchema: GenerateProjectIdeasOutputSchema,
  },
  async () => {
    const { output } = await prompt();
    return output!;
  }
);
