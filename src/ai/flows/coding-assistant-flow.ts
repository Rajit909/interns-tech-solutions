
'use server';

/**
 * @fileOverview A flow to handle AI coding assistant queries.
 *
 * - codingAssistant - A function that responds to a user's coding-related query.
 * - CodingAssistantInput - The input type for the function.
 * - CodingAssistantOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CodingAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s coding question, error message, or request for a practice problem.'),
});
export type CodingAssistantInput = z.infer<typeof CodingAssistantInputSchema>;

const CodingAssistantOutputSchema = z.object({
  response: z.string().describe('The AI\'s response, formatted as Markdown.'),
});
export type CodingAssistantOutput = z.infer<typeof CodingAssistantOutputSchema>;

export async function codingAssistant(input: CodingAssistantInput): Promise<CodingAssistantOutput> {
  return codingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'codingAssistantPrompt',
  input: {schema: CodingAssistantInputSchema},
  output: {schema: CodingAssistantOutputSchema},
  prompt: `You are an expert AI Coding Assistant for students. Your goal is to help them understand programming concepts, debug their code, and practice their skills.

  - If a user asks a question, provide a clear, concise, and easy-to-understand explanation with code examples where appropriate.
  - If a user provides a code snippet with an error, identify the error, explain what's wrong, and provide the corrected code.
  - If a user asks for a practice problem, generate a suitable problem statement and a hint to get them started.
  - Format all code blocks and explanations in clear Markdown.

  User Query:
  {{{query}}}`,
});

const codingAssistantFlow = ai.defineFlow(
  {
    name: 'codingAssistantFlow',
    inputSchema: CodingAssistantInputSchema,
    outputSchema: CodingAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
