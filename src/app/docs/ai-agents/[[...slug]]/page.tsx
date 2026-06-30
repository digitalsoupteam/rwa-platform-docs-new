import { source } from '@/lib/source';
import { DocsBody, DocsPage } from 'fumadocs-ui/layouts/docs/page';
import { notFound, redirect } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';

// AI Agents page renderer
export default async function AgentsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;

  if (!resolvedParams.slug) {
    // /docs/ai-agents → redirect to overview page
    redirect('/docs/ai-agents/overview');
  }

  const slug = ['ai-agents', ...resolvedParams.slug];
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams().filter((p) => p.slug?.[0] === 'ai-agents');
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await params;

  if (!resolvedParams.slug) {
    return { title: 'AI Agents' };
  }

  const slug = ['ai-agents', ...resolvedParams.slug];
  const page = source.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
