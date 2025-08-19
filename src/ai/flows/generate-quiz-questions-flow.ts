
'use server';

/**
 * @fileOverview A flow to generate quiz questions from a topic using an AI model.
 *
 * - generateQuizQuestions - A function that generates quiz questions.
 * - GenerateQuizQuestionsInput - The input type for the function.
 * - GenerateQuizQuestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuestionSchema = z.object({
  text: z.string().describe("The question text."),
  options: z.array(z.string()).length(4).describe("An array of four possible answers."),
  correctAnswer: z.number().min(0).max(3).describe("The index (0-3) of the correct answer in the options array."),
});

const GenerateQuizQuestionsInputSchema = z.object({
  topic: z.string().describe('The topic to generate quiz questions for.'),
  count: z.number().min(1).max(10).default(5).describe('The number of questions to generate.'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('An array of generated quiz questions.'),
});
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;


export async function generateQuizQuestions(input: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `You are an expert educator and quiz creator.

  Based on the topic provided, generate a list of {{{count}}} multiple-choice questions. Each question should have four options, with one clear correct answer.

  The questions should be challenging but fair, suitable for a student learning about the topic. Ensure the options are plausible and the correct answer is well-defined.

  Topic: {{{topic}}}`,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
