import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { getApiPageTree } from '@/lib/api-tree';

// API reference layout — sidebar shows ONLY API modules (not docs guides)
export default function Layout({ children }: LayoutProps<'/docs/api'>) {
  const fullTree = source.getPageTree();
  const apiTree = getApiPageTree(fullTree);

  return (
    <DocsLayout tree={apiTree} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}