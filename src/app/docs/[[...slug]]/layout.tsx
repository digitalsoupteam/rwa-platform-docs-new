import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { getApiPageTree, getAgentsPageTree, getDocsPageTree } from '@/lib/api-tree';

// Unified docs layout — selects sidebar tree by URL slug[0].
// This layout lives INSIDE the [[...slug]] route so it receives the slug
// params. A layout at the parent /docs level would NOT get slug params
// (Next.js only passes dynamic-segment params to layouts AT or below that
// segment's level), which was the root cause of the sidebar always showing
// the Docs tree regardless of URL.
//
//   /docs/api/*         → API Reference sidebar
//   /docs/ai-agents/*   → AI Agents sidebar
//   everything else      → Docs sidebar
//
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const firstSegment = resolvedParams.slug?.[0];

  const fullTree = source.getPageTree();

  const tree =
    firstSegment === 'api'
      ? getApiPageTree(fullTree)
      : firstSegment === 'ai-agents'
        ? getAgentsPageTree(fullTree)
        : getDocsPageTree(fullTree);

  return (
    <DocsLayout tree={tree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}