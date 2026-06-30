"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "fumadocs-core/link";
import { usePathname } from "fumadocs-core/framework";
import { cn } from "@/lib/cn";
import { ChevronDown, X } from "lucide-react";
import { OpTypeBadge } from "@/components/sidebar-components";
import type {
  Root as PageTreeRoot,
  Node as PageTreeNode,
  Folder as PageTreeFolder,
} from "fumadocs-core/page-tree";

/** Check if a folder node contains any page whose URL starts with prefix */
function folderHasUrlPrefix(node: PageTreeFolder, prefix: string): boolean {
  return node.children.some((child) => {
    if (child.type === "page") return child.url.startsWith(prefix);
    if (child.type === "folder") return folderHasUrlPrefix(child, prefix);
    return false;
  });
}

interface NavLink {
  text: string;
  url?: string;
  active?: "url" | "nested-url" | "none";
  matchUrls?: string[];
  excludePrefix?: string | string[];
}

interface MobileNavSheetProps {
  links: NavLink[];
  tree: PageTreeRoot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNavSheet({
  links,
  tree,
  open,
  onOpenChange,
}: MobileNavSheetProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const isNodeActive = useCallback(
    (url: string) => pathname === url,
    [pathname],
  );

  // Determine which tab to show based on pathname
  const getInitialTab = useCallback(() => {
    if (pathname.startsWith("/docs/api")) return 1;
    if (pathname.startsWith("/docs/ai-agents")) return 2;
    return 0;
  }, [pathname]);

  // Split the full tree into 3 sections: Docs, API Reference, Agents
  // Match folders by checking children URLs — $ref and name are unreliable
  // after client-side deserialization (name becomes a JSX element).
  const docsChildren = useMemo(
    () =>
      tree.children.filter((child) => {
        if (child.type !== "folder") return true;
        return (
          !folderHasUrlPrefix(child, "/docs/api") &&
          !folderHasUrlPrefix(child, "/docs/ai-agents")
        );
      }),
    [tree],
  );

  const apiChildren = useMemo(() => {
    const apiFolder = tree.children.find(
      (child): child is PageTreeFolder =>
        child.type === "folder" && folderHasUrlPrefix(child, "/docs/api"),
    );
    return apiFolder?.children ?? [];
  }, [tree]);

  const agentsChildren = useMemo(() => {
    const agentsFolder = tree.children.find(
      (child): child is PageTreeFolder =>
        child.type === "folder" && folderHasUrlPrefix(child, "/docs/ai-agents"),
    );
    return agentsFolder?.children ?? [];
  }, [tree]);

  const visibleChildren =
    activeTab === 0
      ? docsChildren
      : activeTab === 1
        ? apiChildren
        : agentsChildren;

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  // Lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close on route change
  useEffect(() => {
    onOpenChange(false);
  }, [pathname, onOpenChange]);

  // Set active tab when sheet opens
  useEffect(() => {
    if (!open) return;
    setActiveTab(getInitialTab());
  }, [open, getInitialTab]);

  // Auto-expand the folders containing the active page (top-level + nested)
  useEffect(() => {
    if (!open) return;
    const ids: string[] = [];
    for (const child of visibleChildren) {
      if (child.type === "folder" && containsActiveUrl(child, pathname)) {
        const id = child.$id ?? child.name?.toString() ?? "";
        if (id) ids.push(id);
        // Check nested folders
        for (const sub of child.children) {
          if (sub.type === "folder" && containsActiveUrl(sub, pathname)) {
            const subId = sub.$id ?? sub.name?.toString() ?? "";
            if (subId) ids.push(subId);
          }
        }
      }
    }
    if (ids.length > 0) {
      setExpanded((prev) => [...new Set([...prev, ...ids])]);
    }
  }, [open, pathname, visibleChildren]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm animate-fd-fade-in"
        onClick={() => onOpenChange(false)}
      />

      {/* Bottom sheet — fixed 80dvh height, anchored to bottom */}
      <div
        className="fixed inset-x-0 bottom-0 top-auto z-[61] flex h-[80dvh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl animate-mobile-sheet-up dark:bg-[#121212]"
        role="dialog"
        aria-modal="true"
      >
        {/* Drag handle */}
        <div className="flex shrink-0 justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Close button — top right */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-3.5 flex size-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          aria-label="Close menu"
        >
          <X className="size-5" />
        </button>

        {/* ── Nav tabs — fixed at top, switch tree content ── */}
        <div className="flex shrink-0 gap-1 px-4 pb-3 pt-2">
          {links.map((link, i) => (
            <button
              key={link.text}
              onClick={() => setActiveTab(i)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                activeTab === i
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
              )}
            >
              {link.text}
            </button>
          ))}
        </div>

        {/* ── Page tree — scrollable middle section ── */}
        <div className="min-h-0 flex-1 overflow-y-auto border-t border-gray-100 px-2 pt-2 dark:border-gray-800">
          {visibleChildren.map((child: PageTreeNode) => {
            if (child.type === "separator") {
              return null;
            }
            if (child.type === "page") {
              return (
                <Link
                  key={child.$id ?? child.url}
                  href={child.url}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-3 text-[0.9375rem] transition-colors",
                    isNodeActive(child.url)
                      ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800",
                  )}
                >
                  <OpTypeBadge url={child.url} name={String(child.name)} />
                  {child.name}
                </Link>
              );
            }
            // folder
            const id = child.$id ?? child.name?.toString() ?? "";
            const isOpen = expanded.includes(id);
            return (
              <div key={id} className="py-0.5">
                <button
                  onClick={() =>
                    setExpanded((prev) =>
                      prev.includes(id)
                        ? prev.filter((x) => x !== id)
                        : [...prev, id],
                    )
                  }
                  className="flex w-full items-center rounded-lg px-3 py-3 text-[0.9375rem] font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  {child.name}
                  <ChevronDown
                    className={cn(
                      "ms-auto size-4 text-gray-400 transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="pb-1">
                    {child.children.map((sub: PageTreeNode) => {
                      if (sub.type === "page") {
                        return (
                          <Link
                            key={sub.$id ?? sub.url}
                            href={sub.url}
                            onClick={() => onOpenChange(false)}
                            className={cn(
                              "flex items-center gap-2 rounded-lg py-2.5 ps-8 pe-3 text-[0.9375rem] transition-colors",
                              isNodeActive(sub.url)
                                ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800",
                            )}
                          >
                            <OpTypeBadge url={sub.url} name={String(sub.name)} />
                            {sub.name}
                          </Link>
                        );
                      }
                      // nested folder — render with its own expand state
                      const subId = sub.$id ?? sub.name?.toString() ?? "";
                      const subIsOpen = expanded.includes(subId);
                      if (sub.type !== "folder") return null;
                      return (
                        <div key={subId} className="py-0.5">
                          <button
                            onClick={() =>
                              setExpanded((prev) =>
                                prev.includes(subId)
                                  ? prev.filter((x) => x !== subId)
                                  : [...prev, subId],
                              )
                            }
                            className="flex w-full items-center rounded-lg py-2.5 ps-8 pe-3 text-[0.9375rem] font-medium text-gray-900 transition-colors hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800"
                          >
                            {sub.name}
                            <ChevronDown
                              className={cn(
                                "ms-auto size-4 text-gray-400 transition-transform",
                                subIsOpen && "rotate-180",
                              )}
                            />
                          </button>
                          {subIsOpen && (
                            <div className="pb-1">
                              {sub.children.map((subSub: PageTreeNode) => {
                                if (subSub.type !== "page") return null;
                                return (
                                  <Link
                                    key={subSub.$id ?? subSub.url}
                                    href={subSub.url}
                                    onClick={() => onOpenChange(false)}
                                    className={cn(
                                      "flex items-center gap-2 rounded-lg py-2.5 ps-14 pe-3 text-[0.9375rem] transition-colors",
                                      isNodeActive(subSub.url)
                                        ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                                        : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800",
                                    )}
                                  >
                                    <OpTypeBadge url={subSub.url} name={String(subSub.name)} />
                                    {subSub.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── API keys button — pinned to bottom ── */}
        <div className="shrink-0 border-t border-gray-100 p-4 dark:border-gray-800">
          <Link
            href="/docs/api/authentication"
            onClick={() => onOpenChange(false)}
            className="flex w-full items-center justify-center rounded-full bg-fd-primary/10 px-5 py-3 text-sm font-semibold text-fd-primary transition-colors hover:bg-fd-primary/20"
          >
            API keys
          </Link>
        </div>
      </div>
    </>
  );
}

/** Recursively check if a tree node contains the active URL */
function containsActiveUrl(node: PageTreeNode, pathname: string): boolean {
  if (node.type === "page") return node.url === pathname;
  if (node.type === "folder") {
    return node.children.some((child: PageTreeNode) =>
      containsActiveUrl(child, pathname),
    );
  }
  return false;
}