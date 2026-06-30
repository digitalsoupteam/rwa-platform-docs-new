import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { getDocsPageTree } from '@/lib/api-tree';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={getDocsPageTree(source.getPageTree())} {...baseOptions()}>
      {children}
    </DocsLayout>
  );
}