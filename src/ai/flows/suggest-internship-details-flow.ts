'use server';

/**
 * @fileOverview A flow to generate all internship details from a title using an AI model.
 *
 * - suggestInternshipDetails - A function that generates internship details.
 * - SuggestInternshipDetailsInput - The input type for the suggestInternshipDetails function.
 * - SuggestInternshipDetailsOutput - The return type for the suggestInternshipDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInternshipDetailsInputSchema = z.object({
  title: z.string().describe('The internship title to generate details for.'),
});
export type SuggestInternshipDetailsInput = z.infer<typeof SuggestInternshipDetailsInputSchema>;

const SuggestInternshipDetailsOutputSchema = z.object({
    category: z.string().describe("A relevant category for the internship (e.g., 'Software Engineering', 'Marketing')."),
    organization: z.string().describe("A plausible company name offering the internship."),
    description: z.string().describe("A detailed, engaging, and professional internship description (at least 3 paragraphs)."),
    duration: z.string().describe("An estimated duration for the internship (e.g., '3 Months', '12 Weeks')."),
    stipend: z.string().describe("A suggested monthly stipend for the internship (e.g., '$2500/month')."),
    location: z.string().describe("A plausible location for the internship (e.g., 'Remote', 'New York, NY')."),
    bannerPrompt: z.string().describe("A creative and descriptive prompt for generating a banner image for the internship posting.")
});
export type SuggestInternshipDetailsOutput = z.infer<typeof SuggestInternshipDetailsOutputSchema>;


export async function suggestInternshipDetails(input: SuggestInternshipDetailsInput): Promise<SuggestInternshipDetailsOutput> {
  return suggestInternshipDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInternshipDetailsPrompt',
  input: {schema: SuggestInternshipDetailsInputSchema},
  output: {schema: SuggestInternshipDetailsOutputSchema},
  prompt: `You are an expert career advisor and copywriter for an online learning platform called Nexus Learning.

  An employer has provided a title for a new internship. Your task is to generate all the necessary details for the internship posting form. The details should be realistic, professional, and appealing to students.

  Based on the internship title provided, generate the following:
  - A suitable category.
  - A plausible organization/company name.
  - A detailed internship description (at least 3 paragraphs long, highlighting responsibilities, required skills, and what the intern will learn).
  - A realistic duration.
  - A competitive stipend.
  - A plausible location (can be 'Remote').
  - A creative prompt that can be used to generate a visually appealing banner image for the internship.

  Internship Title: {{{title}}}`,
});

const suggestInternshipDetailsFlow = ai.defineFlow(
  {
    name: 'suggestInternshipDetailsFlow',
    inputSchema: SuggestInternshipDetailsInputSchema,
    outputSchema: SuggestInternshipDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
