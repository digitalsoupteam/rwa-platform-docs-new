'use client';

import {
  SidebarFolder as BaseFolder,
  SidebarFolderContent as BaseFolderContent,
  SidebarFolderLink as BaseFolderLink,
  SidebarFolderTrigger as BaseFolderTrigger,
  SidebarItem as BaseItem,
  useFolderDepth,
} from 'fumadocs-ui/components/sidebar/base';
import type { Folder, Item } from 'fumadocs-core/page-tree';
import { usePathname } from 'fumadocs-core/framework';
import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';
import { apiOperations, type ApiOperationType } from '@/lib/api-data';

// ── Utilities ──

function getItemOffset(depth: number): string {
  return `calc(${2 + 3 * depth} * var(--spacing))`;
}

function isPathActive(url: string, pathname: string): boolean {
  return pathname === url;
}

// ── Base item classes (replicated from fumadocs-ui docs layout) ──

const itemBase =
  'relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0';

const itemLink = cn(
  itemBase,
  'transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none',
  'data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors',
);

const itemButton = cn(
  itemBase,
  'transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none',
);

// ── Custom Folder ──
// Top-level (depth 0): collapsible={false} → no chevron, always open, bold header
// Nested: default collapsible behavior with chevron

export function CustomFolder({
  item,
  children,
}: {
  item: Folder;
  children: ReactNode;
}) {
  const depth = useFolderDepth(); // parent's depth
  const isTopLevel = depth === 0;
  const pathname = usePathname();

  return (
    <BaseFolder collapsible={!isTopLevel} defaultOpen={item.defaultOpen}>
      {isTopLevel ? (
        // Top-level: static bold label, no chevron, no toggle
        <BaseFolderTrigger
          className={cn(itemBase, 'w-full font-bold text-fd-foreground')}
          style={{ paddingInlineStart: getItemOffset(depth) }}
        >
          {item.icon}
          {item.name}
        </BaseFolderTrigger>
      ) : item.index ? (
        // Nested with index page: clickable link
        <BaseFolderLink
          href={item.index.url}
          active={isPathActive(item.index.url, pathname)}
          external={item.index.external}
          className={cn(itemLink, 'w-full')}
          style={{ paddingInlineStart: getItemOffset(depth) }}
        >
          {item.icon}
          {item.name}
        </BaseFolderLink>
      ) : (
        // Nested without index: collapsible button with chevron
        <BaseFolderTrigger
          className={cn(itemButton, 'w-full')}
          style={{ paddingInlineStart: getItemOffset(depth) }}
        >
          {item.icon}
          {item.name}
        </BaseFolderTrigger>
      )}
      {/* Base content — no vertical line (docs layout adds before:, we don't) */}
      <BaseFolderContent>
        <div className="flex flex-col gap-0.5 pt-0.5">{children}</div>
      </BaseFolderContent>
    </BaseFolder>
  );
}

// ── API operation type badges ──
// Colored dot badges for sidebar items: Query (blue), Mutation (amber),
// Subscription (purple), REST (emerald). Mapped by operation name lookup.

const typeBadge: Record<ApiOperationType, { label: string; className: string }> = {
  Query: {
    label: 'Q',
    className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  },
  Mutation: {
    label: 'M',
    className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
  Subscription: {
    label: 'S',
    className: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  },
  REST: {
    label: 'R',
    className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
};

// Build name→type map (operation names are unique across all modules)
const opTypeMap = new Map<string, ApiOperationType>(
  apiOperations.map((op) => [op.name, op.type]),
);

// Build slug→type map for URL-based lookup (mobile sidebar uses serialized tree
// where item.name is a ReactNode, so name-based lookup fails; URL is always a string)
function camelToKebab(s: string): string {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
const opTypeBySlug = new Map<string, ApiOperationType>(
  apiOperations.map((op) => [camelToKebab(op.name), op.type]),
);

export function OpTypeBadge({ url, name }: { url?: string; name?: string }) {
  let opType: ApiOperationType | undefined;
  // Try name lookup first (desktop sidebar — name is string)
  if (name) opType = opTypeMap.get(name);
  // Fallback: URL slug lookup (mobile sidebar — name may be ReactNode)
  if (!opType && url) {
    const slug = url.split('/').pop() ?? '';
    opType = opTypeBySlug.get(slug);
  }
  if (!opType) return null;
  const badge = typeBadge[opType];
  return (
    <span
      className={cn(
        'inline-flex size-4 shrink-0 items-center justify-center rounded text-[9px] font-bold leading-none',
        badge.className,
      )}
    >
      {badge.label}
    </span>
  );
}

// ── Custom Item ──
// Top-level items (depth 1): aligned with header (getItemOffset(0))
// Nested items: normal indentation (getItemOffset(depth))

export function CustomItem({ item }: { item: Item }) {
  const depth = useFolderDepth(); // parent folder's depth
  const pathname = usePathname();
  const isTopLevel = depth === 1; // inside a top-level folder

  return (
    <BaseItem
      href={item.url}
      external={item.external}
      active={isPathActive(item.url, pathname)}
      icon={item.icon ?? <OpTypeBadge name={String(item.name)} url={item.url} />}
      className={itemLink}
      style={{
        paddingInlineStart: isTopLevel
          ? getItemOffset(0)
          : getItemOffset(depth),
      }}
    >
      {item.name}
    </BaseItem>
  );
}