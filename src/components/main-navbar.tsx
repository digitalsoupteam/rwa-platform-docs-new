"use client";

import { usePathname } from "fumadocs-core/framework";
import Link from "fumadocs-core/link";
import { cn } from "@/lib/cn";
import {
  FullSearchTrigger,
  SearchTrigger,
} from "fumadocs-ui/layouts/shared/slots/search-trigger";
import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch";
import { useState, useMemo } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { deserializePageTree } from "fumadocs-core/source/client";
import type { SerializedPageTree } from "fumadocs-core/source/client";
import type { Root as PageTreeRoot } from "fumadocs-core/page-tree";
import { MobileNavSheet } from "./mobile-nav-sheet";

interface NavLink {
  text: string;
  url?: string;
  active?: "url" | "nested-url" | "none";
  matchUrls?: string[];
  matchPrefix?: string;
  excludePrefix?: string | string[];
  items?: {
    text: string;
    url: string;
    description?: string;
  }[];
}

export function MainNavbar({
  links,
  serializedTree,
}: {
  links: NavLink[];
  serializedTree: SerializedPageTree;
}) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const tree = useMemo<PageTreeRoot>(
    () => deserializePageTree(serializedTree),
    [serializedTree],
  );

  const isActive = (link: NavLink) => {
    if (!link.url) return false;
    if (link.matchUrls?.includes(pathname)) return true;
    if (link.matchPrefix && pathname.startsWith(link.matchPrefix)) return true;
    if (link.active === "nested-url") {
      if (link.excludePrefix) {
        const prefixes = Array.isArray(link.excludePrefix) ? link.excludePrefix : [link.excludePrefix];
        if (prefixes.some((p) => pathname.startsWith(p))) return false;
      }
      return pathname.startsWith(link.url);
    }
    return pathname === link.url;
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-[#121212]">
        <div className="flex h-14 items-center pl-4 pr-4">
          {/* Logo + burger — far left group */}
          <Link href="/" className="shrink-0 font-semibold text-blue-500">
            <span className="text-xl">Slices</span>
          </Link>

          {/* Burger — right of logo, mobile only (≤720px) */}
          <button
            onClick={() => setSheetOpen(true)}
            className="ml-1 flex size-8 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 mobile-only-flex dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            <Menu className="size-5" />
          </button>

          {/* Desktop nav — centered, hidden on mobile (≤720px) */}
          <ul className="hidden flex-1 items-center justify-center gap-1 desktop-only-flex">
            {links.map((link, i) => {
              if (link.items) {
                const isOpen = openMenu === String(i);
                return (
                  <li key={i} className="relative">
                    <button
                      onClick={() => setOpenMenu(isOpen ? null : String(i))}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
                        isActive(link) &&
                          "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100",
                      )}
                    >
                      {link.text}
                      <ChevronDown className="size-3.5" />
                    </button>
                    {isOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenu(null)}
                        />
                        <div className="absolute left-0 top-full z-20 mt-1 w-64 rounded-xl border bg-white p-2 shadow-lg dark:bg-gray-900">
                          {link.items.map((child, j) => (
                            <Link
                              key={j}
                              href={child.url}
                              className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                              onClick={() => setOpenMenu(null)}
                            >
                              <div className="font-medium">{child.text}</div>
                              {child.description && (
                                <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                  {child.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </li>
                );
              }

              return (
                <li key={i}>
                  <Link
                    href={link.url ?? "#"}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
                      isActive(link) &&
                        "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100",
                    )}
                  >
                    {link.text}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* spacer to push right group to the end on mobile */}
          <div className="flex-1 desktop-only-none" />

          {/* Right side — search + theme + API keys */}
          <div className="flex shrink-0 items-center gap-1">
            {/* Desktop search bar */}
            <FullSearchTrigger className="w-48 desktop-only-flex" />
            {/* Mobile search icon */}
            <SearchTrigger className="mobile-only-flex" />
            <ThemeSwitch />
            {/* API keys button — always visible, full text on all screens */}
            <Link
              href="/docs/api/auth/authenticate"
              className="inline-flex items-center rounded-full bg-fd-primary/10 px-3 py-1.5 text-sm font-semibold text-fd-primary transition-colors hover:bg-fd-primary/20"
            >
              API keys
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile bottom sheet */}
      <MobileNavSheet
        links={links}
        tree={tree}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
