import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";
import { MainNavbar } from "@/components/main-navbar";
import { source } from "@/lib/source";
import {
  AISearch,
  AISearchPanel,
  AISearchTrigger,
} from "@/components/ai/search";
import { MessageCircleIcon } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
});

const navLinks = [
  {
    text: "Docs",
    url: "/docs",
    active: "nested-url" as const,
    matchUrls: ["/"],
    excludePrefix: ["/docs/api", "/docs/ai-agents"],
  },
  {
    text: "API Reference",
    url: "/docs/api/auth/authenticate",
    active: "nested-url" as const,
    matchPrefix: "/docs/api" as const,
  },
  {
    text: "Agents",
    url: "/docs/ai-agents",
    active: "nested-url" as const,
  },
];

export default async function Layout({ children }: LayoutProps<"/">) {
  const tree = source.getPageTree();
  const serializedTree = await source.serializePageTree(tree);

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <AISearch>
            <MainNavbar links={navLinks} serializedTree={serializedTree} />
            {children}
            <AISearchTrigger
              position="float"
              className="size-12 rounded-full bg-fd-primary text-fd-primary-foreground shadow-lg hover:bg-fd-primary/90 flex items-center justify-center"
            >
              <MessageCircleIcon className="size-5" />
            </AISearchTrigger>
            <AISearchPanel />
          </AISearch>
        </RootProvider>
      </body>
    </html>
  );
}
