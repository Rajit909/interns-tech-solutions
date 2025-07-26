'use server';

/**
 * @fileOverview A flow to generate blog post details from a title using an AI model.
 *
 * - suggestBlogDetails - A function that generates blog details.
 * - SuggestBlogDetailsInput - The input type for the suggestBlogDetails function.
 * - SuggestBlogDetailsOutput - The return type for the suggestBlogDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBlogDetailsInputSchema = z.object({
  title: z.string().describe('The blog post title to generate details for.'),
});
export type SuggestBlogDetailsInput = z.infer<typeof SuggestBlogDetailsInputSchema>;

const SuggestBlogDetailsOutputSchema = z.object({
    excerpt: z.string().describe("A concise, compelling summary or teaser for the blog post (2-3 sentences), written in a professional tone."),
    content: z.string().describe("The full content of the blog post, written in engaging, well-structured HTML format. It should be at least 4 paragraphs long and provide valuable insights on the topic."),
});
export type SuggestBlogDetailsOutput = z.infer<typeof SuggestBlogDetailsOutputSchema>;


export async function suggestBlogDetails(input: SuggestBlogDetailsInput): Promise<SuggestBlogDetailsOutput> {
  return suggestBlogDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBlogDetailsPrompt',
  input: {schema: SuggestBlogDetailsInputSchema},
  output: {schema: SuggestBlogDetailsOutputSchema},
  prompt: `You are an expert blog writer and copywriter for a platform called Intern Tech Solutions, which focuses on career development, courses, and internships for students.

  A content creator has provided a title for a new blog post. Your task is to generate a compelling excerpt and the full HTML content for the post.

  Based on the blog post title provided, generate the following:
  - A concise, compelling excerpt (2-3 sentences).
  - The full blog post content in well-structured HTML (at least 4 paragraphs).

  Blog Post Title: {{{title}}}`,
});

const suggestBlogDetailsFlow = ai.defineFlow(
  {
    name: 'suggestBlogDetailsFlow',
    inputSchema: SuggestBlogDetailsInputSchema,
    outputSchema: SuggestBlogDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
