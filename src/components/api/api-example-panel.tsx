import { ArrowUpRight } from 'lucide-react';
import type { ApiOperation } from '@/lib/api-data';
import { ApiCodeBlock } from './api-code-block';
import { generateRequestExample, generateResponseExample, getEndpointDisplay } from './api-examples';

// ── Right sticky panel: shows request + response examples ──
// Mirrors the Uniswap "Try It" panel but without interactivity — static code blocks.

const typeBadgeColors: Record<string, { bg: string; text: string; label: string }> = {
  Query: { bg: 'bg-blue-500/15', text: 'text-blue-500', label: '↗ QUERY' },
  Mutation: { bg: 'bg-amber-500/15', text: 'text-amber-500', label: '↗ MUTATION' },
  Subscription: { bg: 'bg-purple-500/15', text: 'text-purple-500', label: '↗ SUBSCRIPTION' },
  REST: { bg: 'bg-emerald-500/15', text: 'text-emerald-500', label: '↗ POST' },
};

interface ApiExamplePanelProps {
  operation: ApiOperation;
}

export function ApiExamplePanel({ operation }: ApiExamplePanelProps) {
  const requestExample = generateRequestExample(operation);
  const responseExample = generateResponseExample(operation);
  const endpoint = getEndpointDisplay(operation);
  const badge = typeBadgeColors[operation.type] ?? typeBadgeColors['REST'];

  return (
    <div className="flex flex-col gap-4">
      {/* Endpoint header */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${badge.bg} ${badge.text}`}
        >
          <ArrowUpRight className="size-3.5" />
          {endpoint.method}
        </span>
        <code className="flex-1 truncate font-mono text-sm text-fd-foreground">
          {endpoint.path}
        </code>
      </div>

      {/* Request code block */}
      <ApiCodeBlock
        code={requestExample.code}
        label="Request"
        badge={requestExample.language === 'graphql' ? 'GraphQL' : 'cURL'}
        badgeColor="blue"
        language={requestExample.language}
      />

      {/* Response code block */}
      <ApiCodeBlock
        code={responseExample.code}
        label="Response"
        badge="200"
        badgeColor="green"
        language={responseExample.language}
      />
    </div>
  );
}