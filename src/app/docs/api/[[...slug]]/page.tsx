import { source, getPageMarkdownUrl } from '@/lib/source';
import { DocsBody, DocsPage } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { MarkdownCopyButton, ViewOptionsPopover } from 'fumadocs-ui/layouts/docs/page';
import { gitConfig } from '@/lib/shared';
import type { Metadata } from 'next';

// API reference page renderer — more specific than docs/[[...slug]]
// Renders MDX pages from content/docs/api/ with full-width layout (no TOC)
// because ApiEndpoint provides its own 2-column layout with code examples.

export default async function ApiPage(props: PageProps<'/docs/api/[[...slug]]'>) {
  const params = await props.params;

  if (!params.slug) {
    // /docs/api → redirect to authentication page
    notFound();
  }

  // Prepend 'api' because this route is nested under /docs/api/
  // but source.getPage expects full slug relative to /docs
  const slug = ['api', ...params.slug];
  const page = source.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

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

export async function generateStaticParams() {
  // Only generate params for api/ pages
  return source.generateParams().filter((p) => p.slug?.[0] === 'api');
}

export async function generateMetadata(
  props: PageProps<'/docs/api/[[...slug]]'>,
): Promise<Metadata> {
  const params = await props.params;

  if (!params.slug) return { title: 'API Reference' };

  const slug = ['api', ...params.slug];
  const page = source.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}