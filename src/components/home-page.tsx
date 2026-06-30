import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  Building2,
  Users,
  LineChart,
  ArrowRight,
  Send,
  MessageCircleIcon,
  Plug,
  Rocket,
  Wallet,
  Vote,
  Shield,
  type LucideIcon,
} from 'lucide-react';
import { AISearchTrigger } from '@/components/ai/search';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.3.8 1 .8 2v3c0 .3.2.6.8.5a11.5 11.5 0 0 0 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.2 2.3h3.3l-7.2 8.2 8.4 11.2h-6.6l-5.2-6.8-6 6.8H1.6l7.7-8.8L1.2 2.3h6.8l4.7 6.2 5.5-6.2zm-1.2 17.6h1.8L7.1 4.1H5.2l11.8 15.8z" />
    </svg>
  );
}

export function HomePage() {
  return (
    <div className="relative">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
      />

      <div className="mx-auto max-w-[1100px] px-6 pb-16">
        {/* ── Hero ── */}
        <header className="grid grid-cols-1 gap-12 pb-12 pt-16 lg:grid-cols-[1.4fr_1fr]">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-fd-foreground sm:text-5xl">
              Slices Documentation
            </h1>
            <div className="mt-4 space-y-3 text-lg leading-relaxed text-fd-muted-foreground">
              <p>
                Slices is a full-stack platform for real-world asset tokenization — turn invoices, real estate, commodities, and receivables into on-chain instruments with built-in compliance and smart contract automation.
              </p>
              <p>
                Launch crowdfunding pools, automate distributions, and let your investors trade on secondary markets — without building the infrastructure from scratch.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 justify-center">
            <Link
              href="/docs/get-started/quickstart"
              className="group flex items-center gap-3 rounded-xl border border-fd-border bg-fd-card px-5 py-4 text-sm font-semibold text-fd-foreground transition-all hover:border-fd-primary/30 hover:shadow-sm hover:-translate-y-0.5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-fd-primary/10 text-fd-primary">
                <BookOpen className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">Quick Start</span>
                <span className="block text-xs font-normal text-fd-muted-foreground mt-0.5">Get up and running in minutes</span>
              </span>
            </Link>
            <Link
              href="/docs/ai-agents"
              className="group flex items-center gap-3 rounded-xl border border-fd-border bg-fd-card px-5 py-4 text-sm font-semibold text-fd-foreground transition-all hover:border-fd-primary/30 hover:shadow-sm hover:-translate-y-0.5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <Sparkles className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">Agents</span>
                <span className="block text-xs font-normal text-fd-muted-foreground mt-0.5">AI-powered development tools</span>
              </span>
            </Link>
            <AISearchTrigger
              className="group flex items-center gap-3 rounded-xl border border-fd-border bg-fd-card px-5 py-4 text-sm font-semibold text-fd-foreground transition-all hover:border-fd-primary/30 hover:shadow-sm hover:-translate-y-0.5 text-start"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400">
                <MessageCircleIcon className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">Ask AI</span>
                <span className="block text-xs font-normal text-fd-muted-foreground mt-0.5">Chat with documentation</span>
              </span>
            </AISearchTrigger>
          </div>
        </header>

        {/* ── Guides ── */}
        <section className="mt-12">
          <h2 className="mb-8 text-2xl font-bold text-fd-foreground">Guides</h2>
          <div className="flex flex-col gap-5">
            {/* Row 1: 2 cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <GuideCard
                href="/docs/pools/launch-pool"
                icon={Rocket}
                title="Launch a pool"
                desc="Create RWA tokens and launch a crowdfunding pool with automated tranches and returns."
                color="emerald"
              />
              <GuideCard
                href="/docs/pools/join-pool"
                icon={Wallet}
                title="Join a pool"
                desc="Contribute HOLD tokens to a pool and receive tranche payments over time."
                color="purple"
              />
            </div>
            {/* Row 2: 3 cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <GuideCard
                href="/docs/governance/staking"
                icon={Vote}
                title="Stake & vote"
                desc="Stake HOLD tokens, participate in DAO governance, and shape protocol decisions."
                color="blue"
              />
              <GuideCard
                href="/docs/api/auth/authenticate"
                icon={Plug}
                title="Integrate via API"
                desc="Connect your app using GraphQL, smart contracts, and SDK tooling."
                color="orange"
              />
              <GuideCard
                href="/docs/ai-agents"
                icon={Sparkles}
                title="Configure AI agents"
                desc="Set up AI-powered agents for automated workflows and documentation assistance."
                color="sky"
              />
            </div>
          </div>
        </section>

        {/* ── Use cases ── */}
        <section className="mt-20">
          <h2 className="mb-7 text-2xl font-bold text-fd-foreground">Use cases</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
            <UseCaseCard
              icon={Building2}
              title="For Business"
              desc="Tokenize assets and raise capital"
              links={[
                { label: 'Create a company profile', href: '/docs/api/company/company/create-company' },
                { label: 'Tokenize your asset', href: '/docs/tokenization/overview' },
                { label: 'Launch a pool', href: '/docs/pools/launch-pool' },
              ]}
            />
            <UseCaseCard
              icon={Users}
              title="For Participants"
              desc="Support businesses and track returns"
              links={[
                { label: 'Explore pools', href: '/docs/pools/overview' },
                { label: 'View portfolio', href: '/docs/api/portfolio/get-balances' },
                { label: 'Track charts', href: '/docs/charts/overview' },
              ]}
            />
            <UseCaseCard
              icon={Shield}
              title="For Governance"
              desc="Stake HOLD, propose and vote"
              links={[
                { label: 'Stake HOLD tokens', href: '/docs/governance/staking' },
                { label: 'Create a proposal', href: '/docs/governance/proposals' },
                { label: 'Vote on proposals', href: '/docs/governance/voting' },
              ]}
            />
            <UseCaseCard
              icon={LineChart}
              title="For Developers"
              desc="Integrate via GraphQL or contracts"
              links={[
                { label: 'GraphQL API reference', href: '/docs/api/auth/authenticate' },
                { label: 'Smart contract docs', href: '/docs/smart-contracts/architecture' },
                { label: 'Download AI skills', href: '/docs/ai-agents' },
              ]}
            />
          </div>
        </section>

        {/* ── Footer (inside content, not full width) ── */}
        <footer className="mt-20 border-t border-fd-border pt-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
            {/* Brand + social */}
            <div className="col-span-2">
              <span className="text-lg font-bold text-fd-foreground">Slices</span>
              <div className="mt-4 flex gap-4 text-fd-muted-foreground">
                <a href="https://github.com/slices-xyz/slices-docs" className="hover:text-fd-foreground" aria-label="GitHub">
                  <GithubIcon className="size-5" />
                </a>
                <a href="#" className="hover:text-fd-foreground" aria-label="Twitter">
                  <TwitterIcon className="size-5" />
                </a>
                <a href="#" className="hover:text-fd-foreground" aria-label="Telegram">
                  <Send className="size-5" />
                </a>
              </div>
            </div>

            {/* Ecosystem */}
            <FooterColumn
              title="Ecosystem"
              links={[
                { label: 'Web App', href: '#' },
                { label: 'Wallet', href: '#' },
                { label: 'Governance', href: '#' },
              ]}
            />

            {/* Resources */}
            <FooterColumn
              title="Resources"
              links={[
                { label: 'Deployments', href: '#' },
                { label: 'Bug Bounty', href: '#' },
                { label: 'Whitepaper', href: '#' },
              ]}
            />

            {/* Company */}
            <FooterColumn
              title="Company"
              links={[
                { label: 'About', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Brand Assets', href: '#' },
              ]}
            />

            {/* Support */}
            <FooterColumn
              title="Support"
              links={[
                { label: 'Help', href: '#' },
                { label: 'Feedback', href: '#' },
                { label: 'Status', href: '#' },
              ]}
            />
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-fd-border pt-6 pb-4 text-sm text-fd-muted-foreground sm:flex-row">
            <span>© {new Date().getFullYear()} Slices. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-fd-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-fd-foreground">Terms of Service</a>
              <a href="#" className="hover:text-fd-foreground">API Terms of Use</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ── Guide card: colored bg, icon in circle, vertical ── */

const guideBg = {
  blue: 'bg-blue-50 dark:bg-blue-950',
  emerald: 'bg-emerald-50 dark:bg-emerald-950',
  purple: 'bg-purple-50 dark:bg-purple-950',
  orange: 'bg-orange-50 dark:bg-orange-950',
  sky: 'bg-sky-50 dark:bg-sky-950',
} as const;

const guideIcon = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-300',
} as const;

type GuideColor = keyof typeof guideBg;

function GuideCard({
  href,
  icon: Icon,
  title,
  desc,
  color,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  color: GuideColor;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-4 rounded-2xl p-6 transition-all hover:shadow-md hover:-translate-y-0.5 ${guideBg[color]}`}
    >
      <div className={`flex size-12 items-center justify-center rounded-full ${guideIcon[color]}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-fd-foreground">{title}</h3>
        <p className="mt-1.5 text-sm text-fd-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </Link>
  );
}

/* ── Use case card: vertical, icon, title, desc, link list ── */

function UseCaseCard({
  icon: Icon,
  title,
  desc,
  links,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-fd-border bg-fd-card p-6 transition-shadow hover:shadow-md">
      <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-fd-muted text-fd-muted-foreground">
        <Icon className="size-5" />
      </div>
      <h3 className="text-base font-semibold text-fd-foreground">{title}</h3>
      <p className="mb-5 text-sm text-fd-muted-foreground">{desc}</p>
      <ul className="divide-y divide-fd-border border-t border-fd-border">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="group flex items-center py-2.5 text-sm font-medium text-fd-foreground transition-colors hover:text-fd-primary"
            >
              {l.label}
              <ArrowRight className="ml-auto size-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Footer column ── */

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-fd-foreground">{title}</h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}