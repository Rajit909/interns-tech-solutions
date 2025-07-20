'use server';

/**
 * @fileOverview AI-powered course and internship recommendation flow.
 *
 * - recommendCourses - A function that recommends courses and internships.
 * - RecommendCoursesInput - The input type for the recommendCourses function.
 * - RecommendCoursesOutput - The return type for the recommendCourses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendCoursesInputSchema = z.object({
  viewingHistory: z
    .string()
    .describe('The viewing history of the student as a string.'),
  profileData: z
    .string()
    .describe('The profile data of the student as a string.'),
});
export type RecommendCoursesInput = z.infer<typeof RecommendCoursesInputSchema>;

const RecommendCoursesOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('The recommendations for courses and internships.'),
});
export type RecommendCoursesOutput = z.infer<typeof RecommendCoursesOutputSchema>;

export async function recommendCourses(input: RecommendCoursesInput): Promise<RecommendCoursesOutput> {
  return recommendCoursesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCoursesPrompt',
  input: {schema: RecommendCoursesInputSchema},
  output: {schema: RecommendCoursesOutputSchema},
  prompt: `You are an AI assistant designed to recommend courses and internships to students.

  Based on the student's viewing history and profile data, provide personalized recommendations for courses and internships.

  Viewing History: {{{viewingHistory}}}
  Profile Data: {{{profileData}}}

  Recommendations:`,
});

const recommendCoursesFlow = ai.defineFlow(
  {
    name: 'recommendCoursesFlow',
    inputSchema: RecommendCoursesInputSchema,
    outputSchema: RecommendCoursesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
