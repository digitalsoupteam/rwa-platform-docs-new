import type { Root, Folder, Node } from 'fumadocs-core/page-tree';

/**
 * Extract the "API Reference" folder from the full page tree and return it as a new Root.
 * The API reference sidebar should only show API modules — not docs guides.
 */
export function getApiPageTree(fullTree: Root): Root {
  const byRef = fullTree.children.find(
    (child): child is Folder =>
      child.type === 'folder' && (child.$ref?.folder?.endsWith('/api') ?? false),
  );

  const apiFolder =
    byRef ??
    fullTree.children.find(
      (child): child is Folder => child.type === 'folder' && String(child.name) === 'API Reference',
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
  const byRef = fullTree.children.find(
    (child): child is Folder =>
      child.type === 'folder' && (child.$ref?.folder?.endsWith('/ai-agents') ?? false),
  );

  const agentsFolder =
    byRef ??
    fullTree.children.find(
      (child): child is Folder => child.type === 'folder' && String(child.name) === 'AI Agents',
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
          ((child.$ref?.folder?.endsWith('/api') ?? false) ||
            String(child.name) === 'API Reference' ||
            (child.$ref?.folder?.endsWith('/ai-agents') ?? false) ||
            String(child.name) === 'AI Agents')
        ),
    ),
  };
}