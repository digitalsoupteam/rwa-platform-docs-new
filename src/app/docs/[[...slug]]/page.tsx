import { HomePage } from '@/components/home-page';
import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsPage,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound, redirect } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { gitConfig } from '@/lib/shared';
import type { Metadata } from 'next';

// Unified docs page renderer — handles /docs, /docs/api/*, /docs/ai-agents/*
// Sidebar tree is selected by docs/layout.tsx based on slug[0].

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const slug = await params;

  // /docs (no slug) → render the landing page
  if (!slug.slug) {
    return <HomePage />;
  }

  // /docs/ai-agents → redirect to the overview page (no index.mdx at root)
  if (slug.slug.length === 1 && slug.slug[0] === 'ai-agents') {
    redirect('/docs/ai-agents/overview');
  }

  const page = source.getPage(slug.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  const firstSegment = slug.slug[0];
  const isApiPage = firstSegment === 'api';

  // API pages: full-width, no TOC (ApiEndpoint provides its own 2-column layout)
  // Other pages: normal DocsPage with TOC
  if (isApiPage) {
    return (
      <DocsPage full>
        <div className="flex flex-row gap-2 items-center border-b pb-4 mb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${page.path}`}
          />
        </div>
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

  // Docs & AI Agents pages
  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsBody>
        <div className="flex mb-4">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
        </div>
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
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const slug = await params;

  if (!slug.slug) {
    return {
      title: 'Slices Documentation',
      description:
        'Slices — a full-stack platform for real-world asset tokenization. Launch pools, automate distributions, integrate via GraphQL or smart contracts.',
    };
  }

  const page = source.getPage(slug.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}