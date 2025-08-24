
'use server';

/**
 * @fileOverview A flow to generate hero slide details from a topic using an AI model.
 *
 * - suggestHeroSlideDetails - A function that generates slide details.
 * - SuggestHeroSlideDetailsInput - The input type for the suggestHeroSlideDetails function.
 * - SuggestHeroSlideDetailsOutput - The return type for the suggestHeroSlideDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHeroSlideDetailsInputSchema = z.object({
  topic: z.string().describe('The topic or theme for the hero slide.'),
});
export type SuggestHeroSlideDetailsInput = z.infer<typeof SuggestHeroSlideDetailsInputSchema>;

const SuggestHeroSlideDetailsOutputSchema = z.object({
    title: z.string().describe("A powerful, concise headline for the slide (around 5-7 words)."),
    description: z.string().describe("An engaging and descriptive paragraph for the slide (2-3 sentences)."),
    buttonText: z.string().describe("A clear and compelling call-to-action for the button (e.g., 'Explore Now', 'Learn More')."),
    buttonLink: z.string().describe("A relevant link for the button, typically a page anchor or a URL (e.g., '#courses', '/login')."),
    dataAiHint: z.string().describe("A short, two-word hint for generating a background image (e.g., 'students learning', 'modern office')."),
});
export type SuggestHeroSlideDetailsOutput = z.infer<typeof SuggestHeroSlideDetailsOutputSchema>;


export async function suggestHeroSlideDetails(input: SuggestHeroSlideDetailsInput): Promise<SuggestHeroSlideDetailsOutput> {
  return suggestHeroSlideDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHeroSlideDetailsPrompt',
  input: {schema: SuggestHeroSlideDetailsInputSchema},
  output: {schema: SuggestHeroSlideDetailsOutputSchema},
  prompt: `You are an expert marketing copywriter for an online learning platform called Intern Tech Solutions.

  A content manager has provided a topic for a new hero carousel slide on the homepage. Your task is to generate all the necessary marketing copy for the slide. The tone should be inspiring, professional, and action-oriented.

  Based on the topic provided, generate the following:
  - A powerful, concise headline (around 5-7 words).
  - An engaging and descriptive paragraph (2-3 sentences).
  - A clear and compelling call-to-action button text.
  - A relevant link for the button (e.g., '#courses', '/login').
  - A two-word hint for the AI image generator to create a stunning background.

  Topic: {{{topic}}}`,
});

const suggestHeroSlideDetailsFlow = ai.defineFlow(
  {
    name: 'suggestHeroSlideDetailsFlow',
    inputSchema: SuggestHeroSlideDetailsInputSchema,
    outputSchema: SuggestHeroSlideDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
