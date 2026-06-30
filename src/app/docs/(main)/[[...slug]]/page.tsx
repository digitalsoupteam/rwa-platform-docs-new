import { HomePage } from '@/components/home-page';
import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source';
import {
  DocsBody,
  DocsPage,
  MarkdownCopyButton,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;

  // /docs (no slug) → render the same landing page as /
  if (!params.slug) {
    return <HomePage />;
  }

  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsBody>
        <div className="flex mb-4">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
        </div>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
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

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;

  if (!params.slug) {
    return {
      title: 'Slices Documentation',
      description:
        'Slices — a full-stack platform for real-world asset tokenization. Launch pools, automate distributions, integrate via GraphQL or smart contracts.',
    };
  }

  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}