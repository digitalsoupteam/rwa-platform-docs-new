import type { Root, Folder, Node } from 'fumadocs-core/page-tree';

/**
 * Check if a folder node contains any page whose URL starts with prefix.
 * This is the stable way to identify folders in the page tree — it works
 * identically in dev and build because page URLs are always plain strings.
 *
 * Do NOT rely on `child.$ref?.folder` (value is `"api"` without a leading
 * slash in build, so `endsWith('/api')` fails) or `String(child.name)`
 * (name is a ReactNode in build, so `String(...)` yields "[object Object]").
 * Both were the root cause of the sidebar showing the wrong tree in build.
 */
function folderHasUrlPrefix(node: Folder, prefix: string): boolean {
  return node.children.some((child) => {
    if (child.type === 'page') return child.url.startsWith(prefix);
    if (child.type === 'folder') return folderHasUrlPrefix(child, prefix);
    return false;
  });
}

/**
 * Extract the "API Reference" folder from the full page tree and return it as a new Root.
 * The API reference sidebar should only show API modules — not docs guides.
 */
export function getApiPageTree(fullTree: Root): Root {
  const apiFolder = fullTree.children.find(
    (child): child is Folder =>
      child.type === 'folder' && folderHasUrlPrefix(child, '/docs/api/'),
  );

  if (!apiFolder) {
    return fullTree;
  }

  return {
    $id: apiFolder.$id,
    name: 'API Reference',
    children: apiFolder.children as Node[],
  };
}

/**
 * Extract the "AI Agents" folder from the full page tree and return it as a new Root.
 * The AI Agents sidebar should only show ai-agents pages.
 */
export function getAgentsPageTree(fullTree: Root): Root {
  const agentsFolder = fullTree.children.find(
    (child): child is Folder =>
      child.type === 'folder' && folderHasUrlPrefix(child, '/docs/ai-agents/'),
  );

  if (!agentsFolder) {
    return fullTree;
  }

  return {
    $id: agentsFolder.$id,
    name: 'AI Agents',
    children: agentsFolder.children as Node[],
  };
}

/**
 * Return the full page tree with the API Reference and AI Agents folders removed.
 * They have their own sidebars and shouldn't appear in the main docs sidebar.
 */
export function getDocsPageTree(fullTree: Root): Root {
  return {
    ...fullTree,
    children: fullTree.children.filter(
      (child) =>
        !(
          child.type === 'folder' &&
          (folderHasUrlPrefix(child, '/docs/api/') ||
            folderHasUrlPrefix(child, '/docs/ai-agents/'))
        ),
    ),
  };
}