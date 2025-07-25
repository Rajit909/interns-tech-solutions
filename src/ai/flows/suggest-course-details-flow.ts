'use server';

/**
 * @fileOverview A flow to generate all course details from a title using an AI model.
 *
 * - suggestCourseDetails - A function that generates course details.
 * - SuggestCourseDetailsInput - The input type for the suggestCourseDetails function.
 * - SuggestCourseDetailsOutput - The return type for the suggestCourseDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCourseDetailsInputSchema = z.object({
  title: z.string().describe('The course title to generate details for.'),
});
export type SuggestCourseDetailsInput = z.infer<typeof SuggestCourseDetailsInputSchema>;

const SuggestCourseDetailsOutputSchema = z.object({
    category: z.string().describe("A relevant category for the course (e.g., 'Web Development', 'Data Science')."),
    instructor: z.string().describe("A plausible instructor name for the course."),
    description: z.string().describe("A detailed, engaging, and professional course description (at least 3 paragraphs)."),
    duration: z.string().describe("An estimated duration for the course (e.g., '8 Weeks', '12 Hours')."),
    price: z.number().describe("A suggested price for the course."),
    bannerPrompt: z.string().describe("A creative and descriptive prompt for generating a course banner image.")
});
export type SuggestCourseDetailsOutput = z.infer<typeof SuggestCourseDetailsOutputSchema>;


export async function suggestCourseDetails(input: SuggestCourseDetailsInput): Promise<SuggestCourseDetailsOutput> {
  return suggestCourseDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCourseDetailsPrompt',
  input: {schema: SuggestCourseDetailsInputSchema},
  output: {schema: SuggestCourseDetailsOutputSchema},
  prompt: `You are an expert curriculum designer and copywriter for an online learning platform called Intern Tech Solutions.

  A course creator has provided a title for a new course. Your task is to generate all the necessary details for the course creation form. The details should be realistic, professional, and compelling.

  Based on the course title provided, generate the following:
  - A suitable category.
  - A plausible instructor's name.
  - A detailed course description (at least 3 paragraphs long, highlighting key learning objectives, target audience, and what students will gain).
  - A realistic duration.
  - A competitive price.
  - A creative prompt that can be used to generate a visually appealing banner image for the course.

  Course Title: {{{title}}}`,
});

const suggestCourseDetailsFlow = ai.defineFlow(
  {
    name: 'suggestCourseDetailsFlow',
    inputSchema: SuggestCourseDetailsInputSchema,
    outputSchema: SuggestCourseDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
