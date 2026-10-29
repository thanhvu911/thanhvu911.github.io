// Published at /assistant-knowledge.json. The AI worker (worker/) reads it, so
// the assistant always answers from the same facts as the site.
import type { APIRoute } from 'astro';
import { knowledgeText } from '../lib/knowledge';

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ text: knowledgeText() }), {
    headers: { 'Content-Type': 'application/json' },
  });
