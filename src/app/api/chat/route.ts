import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from 'ai';
import { z } from 'zod';
import { source } from '@/lib/source';
import { Document, type DocumentData } from 'flexsearch';
import { ChatUIMessage, SearchTool } from '../../../components/ai/search';

interface CustomDocument extends DocumentData {
  url: string;
  title: string;
  description: string;
  content: string;
}
const searchServer = createSearchServer();

async function createSearchServer() {
  const search = new Document<CustomDocument>({
    document: {
      id: 'url',
      index: ['title', 'description', 'content'],
      store: true,
    },
  });

  const docs = await chunkedAll(
    source.getPages().map(async (page) => {
      if (!('getText' in page.data)) return null;

      return {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        content: await page.data.getText('processed'),
      } as CustomDocument;
    }),
  );

  for (const doc of docs) {
    if (doc) search.add(doc);
  }

  return search;
}

async function chunkedAll<O>(promises: Promise<O>[]): Promise<O[]> {
  const SIZE = 50;
  const out: O[] = [];
  for (let i = 0; i < promises.length; i += SIZE) {
    out.push(...(await Promise.all(promises.slice(i, i + SIZE))));
  }
  return out;
}

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

/** System prompt — describes the project and forces search-first behaviour */
const systemPrompt = [
  'You are an AI assistant for the Slices documentation site.',
  '',
  'Slices is a full-stack platform for real-world asset (RWA) tokenization. It lets users turn invoices, real estate, commodities, and receivables into on-chain instruments with built-in compliance and smart contract automation. Key features: crowdfunding pools, automated distributions, secondary-market trading, DAO governance (staking HOLD tokens, proposals, voting), GraphQL API, and smart contracts on-chain.',
  '',
  'CRITICAL RULE: ALWAYS use the `search` tool FIRST before answering any question. Do NOT rely on your own knowledge — the documentation is the source of truth.',
  '  - The `search` tool indexes ALL documentation pages (guides, API reference, smart contracts, AI agents).',
  '  - Search with relevant keywords from the user\'s question.',
  '  - If the first search returns no useful results, try different keywords before giving up.',
  '',
  'When answering:',
  '  - Ground your answer in the search results. Cite sources as markdown links using the document `url` field.',
  '  - If search results are insufficient, say "I couldn\'t find that in the documentation" and suggest a better query.',
  '  - For API questions, include the endpoint URL, method, and required parameters from the docs.',
  '  - For smart contract questions, reference the contract name and function signatures from the docs.',
].join('\n');

export async function POST(req: Request, ctx: RouteContext<"/api/chat">) {
  const reqJson = await req.json();

  const result = streamText({
    model: openrouter.chat(String(process.env.OPENROUTER_MODEL)),
    stopWhen: stepCountIs(5),
    tools: {
      search: searchTool,
    },
    messages: [
      { role: 'system', content: systemPrompt },
      ...(await convertToModelMessages<ChatUIMessage>(reqJson.messages ?? [], {
        convertDataPart(part) {
          if (part.type === 'data-client')
            return {
              type: 'text',
              text: `[Client Context: ${JSON.stringify(part.data)}]`,
            };
        },
      })),
    ],
    toolChoice: 'auto',
  });

  return result.toUIMessageStreamResponse();
}

const searchTool = tool({
  description: 'Search the docs content and return raw JSON results.',
  inputSchema: z.object({
    query: z.string(),
    limit: z.number().int().min(1).max(100).default(10),
  }),
  async execute({ query, limit }) {
    const search = await searchServer;
    return await search.searchAsync(query, { limit, merge: true, enrich: true });
  },
}) satisfies SearchTool;