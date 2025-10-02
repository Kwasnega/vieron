'use server';
/**
 * @fileOverview A flow for summarizing text using an AI model.
 *
 * - summarizeText - A function that takes a string of text and returns a summary.
 * - SummarizeTextInput - The input type for the summarizeText function.
 * - SummarizeTextOutput - The return type for the summarizeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTextInputSchema = z.object({
  text: z.string().describe('The text to be summarized.'),
});
export type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;

const SummarizeTextOutputSchema = z.object({
  summary: z.string().describe('The generated summary of the text.'),
});
export type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;

export async function summarizeText(
  input: SummarizeTextInput
): Promise<SummarizeTextOutput> {
  try {
    return await summarizeTextFlow(input);
  } catch (error) {
    console.error('Summarization error:', error);
    throw new Error('Failed to generate summary. Please check your API key configuration.');
  }
}

const prompt = ai.definePrompt({
  name: 'summarizeTextPrompt',
  input: {schema: SummarizeTextInputSchema},
  output: {schema: SummarizeTextOutputSchema},
  prompt: `You are an expert at explaining complex topics in a simple and easy-to-understand way.

Please provide a summary of the following text. Explain it in a way that a 10-year-old child could easily understand. Break down the key ideas into simple concepts and use analogies if possible.

Text to summarize:
{{{text}}}
  `,
});

const summarizeTextFlow = ai.defineFlow(
  {
    name: 'summarizeTextFlow',
    inputSchema: SummarizeTextInputSchema,
    outputSchema: SummarizeTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);