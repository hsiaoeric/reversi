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
    .enum(['random', 'Max ev1', 'Max ev2', 'Max ev3', 'Min ev3'])
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
  prompt: `You are an AI name generator. Generate a creative and thematic name for an AI Reversi opponent based on its strategy.

AI Strategy: {{{aiStrategy}}}

Here are descriptions of the strategies:
- random: Makes moves randomly.
- Max ev1: Tries to limit the opponent's number of possible moves.
- Max ev2: A greedy AI that tries to maximize its own piece count.
- Max ev3: A strong AI that combines multiple strategies for optimal play.
- Min ev3: An unusual AI that tries to help its opponent win.

Based on the strategy, generate a suitable name. For example, for 'random' you might suggest "ChaosChip" or "RNGeezus". For 'Max ev2' you could use "The Overlord". For 'Min ev3', something like "FriendlyBot" or "Kingmaker".

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
