import 'server-only';

/**
 * RAG Agent Handler - Server-only execution logic
 * Generates natural language answers based on provided context using Gemini
 * Supports both RAG mode (with documents) and simple chat mode (conversation only)
 */

import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { ExecutionContext } from '../../types/executionContext';
import type { RagHandlerParams, RagHandlerResult, ConversationMessage } from './rag.types';

const GEMINI_RAG_MODEL = 'models/gemini-2.0-flash-exp';

/**
 * Build prompt for simple chat mode (no documents)
 */
function buildSimpleChatPrompt(query: string, history?: ConversationMessage[]): string {
  const conversationContext = history?.length
    ? `CONVERSATION HISTORY:\n${history.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}\n\n`
    : '';

  return `You are a helpful, friendly assistant.

${conversationContext}USER MESSAGE:
${query}

INSTRUCTIONS:
1. Respond naturally to the user's message.
2. Consider the conversation history for context continuity if available.
3. Be concise but helpful.

RESPONSE:`;
}

/**
 * Build prompt for RAG mode (with documents)
 */
function buildRagPrompt(query: string, ragContext: string, history?: ConversationMessage[]): string {
  const conversationContext = history?.length
    ? `CONVERSATION HISTORY:\n${history.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}\n\n`
    : '';

  return `You are a helpful and expert assistant for the Beddel Protocol.

${conversationContext}CONTEXT INFORMATION:
${ragContext}

USER QUESTION:
${query}

INSTRUCTIONS:
1. Answer the user's question based on the CONTEXT INFORMATION provided above.
2. Consider the CONVERSATION HISTORY for context continuity if available.
3. If the context does not contain the answer, politely state that you don't have enough information in the documentation to answer.
4. Be concise but comprehensive.

ANSWER:`;
}

/**
 * Execute RAG answer generation
 */
export async function executeRagHandler(
  params: RagHandlerParams,
  props: Record<string, string>,
  context: ExecutionContext
): Promise<RagHandlerResult> {
  const apiKey = props?.gemini_api_key?.trim();
  if (!apiKey) {
    throw new Error('Missing required prop: gemini_api_key');
  }

  const { query, history, mode = 'rag' } = params;
  const ragContext = params.context || params.documents;

  if (!query) {
    throw new Error('Missing required RAG input: query');
  }

  // Simple mode doesn't require documents
  if (mode === 'rag' && !ragContext) {
    throw new Error('Missing required RAG input: context or documents');
  }

  const google = createGoogleGenerativeAI({ apiKey });
  const model = google(GEMINI_RAG_MODEL);

  const prompt = mode === 'simple'
    ? buildSimpleChatPrompt(query, history)
    : buildRagPrompt(query, ragContext!, history);

  try {
    context.log(`[RAG:${mode}] Generating answer for: "${query.substring(0, 50)}..."`);

    const { text } = await generateText({
      model,
      prompt,
      temperature: mode === 'simple' ? 0.7 : 0.3,
    });

    return {
      response: text,
      answer: text,
      timestamp: new Date().toISOString(),
    };

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    context.log(`[RAG] Error: ${message}`);
    return {
      response: '',
      answer: '',
      timestamp: new Date().toISOString(),
      error: message,
    };
  }
}
