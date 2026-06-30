import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { getAgentsPageTree } from '@/lib/api-tree';

// AI Agents layout — sidebar shows ONLY ai-agents pages (not docs guides or API)
export default function Layout({ children }: { children: React.ReactNode }) {
  const fullTree = source.getPageTree();
  const agentsTree = getAgentsPageTree(fullTree);

  return (
    <DocsLayout tree={agentsTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}
