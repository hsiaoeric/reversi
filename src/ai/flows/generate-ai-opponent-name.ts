'use server';
/**
 * @fileOverview AI opponent name generator.
 *
 * - generateAiOpponentName - A function that generates an AI opponent name based on the AI strategy.
 * - GenerateAiOpponentNameInput - The input type for the generateAiOpponentName function.
 * - GenerateAiOpponentNameOutput - The return type for the generateAiOpponentName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiOpponentNameInputSchema = z.object({
  aiStrategy: z
    .enum(['Strategic', 'Greedy', 'Random'])
    .describe('The AI strategy to use for generating the opponent name.'),
});
export type GenerateAiOpponentNameInput = z.infer<typeof GenerateAiOpponentNameInputSchema>;

const GenerateAiOpponentNameOutputSchema = z.object({
  aiOpponentName: z.string().describe('The generated AI opponent name.'),
});
export type GenerateAiOpponentNameOutput = z.infer<typeof GenerateAiOpponentNameOutputSchema>;

export async function generateAiOpponentName(
  input: GenerateAiOpponentNameInput
): Promise<GenerateAiOpponentNameOutput> {
  return generateAiOpponentNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiOpponentNamePrompt',
  input: {schema: GenerateAiOpponentNameInputSchema},
  output: {schema: GenerateAiOpponentNameOutputSchema},
  prompt: `You are an AI name generator. Generate a name for the AI opponent based on the AI strategy.

AI Strategy: {{{aiStrategy}}}

Name: `,
});

const generateAiOpponentNameFlow = ai.defineFlow(
  {
    name: 'generateAiOpponentNameFlow',
    inputSchema: GenerateAiOpponentNameInputSchema,
    outputSchema: GenerateAiOpponentNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
