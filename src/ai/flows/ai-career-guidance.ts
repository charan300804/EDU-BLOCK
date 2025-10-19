'use server';
/**
 * @fileOverview An AI assistant that suggests relevant job openings and learning paths based on the student's certificate.
 *
 * - getCareerSuggestions - A function that handles the career suggestions process.
 * - CareerSuggestionsInput - The input type for the getCareerSuggestions function.
 * - CareerSuggestionsOutput - The return type for the getCareerSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerSuggestionsInputSchema = z.object({
  certificateTitle: z
    .string()
    .describe('The title of the certificate (e.g., B.Tech CSE).'),
});
export type CareerSuggestionsInput = z.infer<typeof CareerSuggestionsInputSchema>;

const CareerSuggestionsOutputSchema = z.object({
  jobSuggestions: z
    .array(z.string())
    .describe('A list of suggested job titles.'),
  learningPathSuggestions: z
    .array(z.string())
    .describe('A list of suggested learning paths or courses.'),
});
export type CareerSuggestionsOutput = z.infer<typeof CareerSuggestionsOutputSchema>;

export async function getCareerSuggestions(input: CareerSuggestionsInput): Promise<CareerSuggestionsOutput> {
  return careerSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerSuggestionsPrompt',
  input: {schema: CareerSuggestionsInputSchema},
  output: {schema: CareerSuggestionsOutputSchema},
  prompt: `You are a career counselor specializing in providing job and learning path suggestions based on academic qualifications.

  Based on the following certificate title, suggest relevant job titles and learning paths.

  Certificate Title: {{{certificateTitle}}}

  Format your response as a JSON object with "jobSuggestions" and "learningPathSuggestions" arrays. Each array should contain a list of strings.`,
});

const careerSuggestionsFlow = ai.defineFlow(
  {
    name: 'careerSuggestionsFlow',
    inputSchema: CareerSuggestionsInputSchema,
    outputSchema: CareerSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
