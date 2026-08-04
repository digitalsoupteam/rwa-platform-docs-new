# Slices Documentation

[![Built with Fumadocs](https://img.shields.io/badge/Built%20with-Fumadocs-%23E11D48?logo=next.js&logoColor=white)](https://fumadocs.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.9-%23000000?logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success)](https://docs.slices.market)

The official documentation site for **Slices** — a platform for tokenizing real-world assets (RWAs) and launching crowdfunding pools on BSC (Binance Smart Chain).

Built with [Fumadocs](https://fumadocs.dev) (Next.js + MDX), this site contains **140+ pages** covering every aspect of the platform: tokenization, pools, trading, governance, smart contracts, AI agents, API reference, and more.

**Who is this for?**
- **Businesses** looking to tokenize real-world assets and raise capital
- **Developers** integrating with Slices smart contracts and APIs
- **Participants** joining crowdfunding pools and trading RWA tokens
- **DAO members** participating in protocol governance

---

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) (v1.2+)
- Node.js 20+

### Install dependencies

```bash
bun install
```

> The `postinstall` script automatically runs `fumadocs-mdx` to generate MDX content sources.

### Start the development server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the documentation site.

### Build for production

```bash
bun run build
```

The static output is written to the `out/` directory.

### Other commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start the development server |
| `bun run build` | Build the production site |
| `bun run start` | Start the production server |
| `bun run lint` | Run ESLint |
| `bun run types:check` | Run MDX generation, Next.js typegen, and TypeScript checks |

---

## Documentation Structure

The documentation is organized into **18 sections** under `content/docs/`:

| Section | Description |
|---------|-------------|
| **Get Started** | Quick start guide, core concepts, and system architecture |
| **Tokenization** | Asset types, token creation, and compliance |
| **Pools** | Launching pools, joining pools, tranches, and lifecycle |
| **Trading** | Secondary market and order matching |
| **Governance** | PlatformToken, staking, proposals, and voting |
| **Smart Contracts** | Contract architecture, reference, and deployments |
| **Fees** | Creation fees, trading fees, and protocol parameters |
| **AI Evaluator** | AI-powered asset evaluation |
| **AI Assistant** | AI assistant for platform interactions |
| **Signers Manager** | Multi-signature management |
| **Charts** | On-chain data visualization |
| **Loyalty** | Referrals, rewards, and airdrops |
| **Testnet Faucet** | Testnet token faucet |
| **API Keys** | API key management |
| **Webhooks** | Webhook integration |
| **API Reference** | Full REST API reference (auth, RWA, company, documents, charts, portfolio, DAO, loyalty, AI, and more) |
| **AI Agents** | AI agent tools and skills |
| **Resources** | SDK, FAQ, and whitepaper |

---

## Adding New Pages

### 1. Create an MDX file

Place your file in the appropriate section folder under `content/docs/`:

```mdx
---
title: Your Page Title
description: A brief description for SEO and navigation
---

# Your Page Title

Content goes here. You can use **Markdown** and MDX components.
```

### 2. Register in navigation

Update the section's `meta.json` file to add your page to the sidebar:

```json
{
  "pages": ["existing-page", "your-new-page"]
}
```

Pages appear in the order listed. Use the filename without the `.mdx` extension.

### 3. Frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Page title (used in navigation and `<title>`) |
| `description` | No | Meta description for SEO and previews |

---

## Writing Guidelines

- **Active voice** — Write commands and instructions in active voice ("Create a pool" not "A pool is created").
- **English only** — All documentation is written in English.
- **Mermaid diagrams** — Use Mermaid code blocks for flowcharts, sequence diagrams, and architecture visuals:

  ````mdx
  ```mermaid
  graph LR
    A[Business] --> B[Create RWA Token]
    B --> C[Launch Pool]
  ```
  ````

- **Code examples** — Use TypeScript/JavaScript with clear comments. Prefer `bun` for CLI examples.
- **Consistent terminology** — Refer to platform terms exactly: RWA token, HOLD token, Pool, Tranche, PlatformToken.
- **Link to related pages** — Cross-reference sections where relevant (e.g., link from Pools to Tokenization).

---

## Project Structure

```
├── content/docs/          # MDX documentation pages
│   ├── index.mdx          # Documentation landing page
│   ├── meta.json          # Top-level navigation config
│   └── <section>/         # Section folders with their own meta.json
├── src/
│   ├── app/
│   │   ├── (home)/        # Landing page and other pages
│   │   ├── docs/          # Documentation layout and pages
│   │   └── api/search/    # Search route handler
│   └── lib/
│       ├── source.ts      # Content source adapter (Fumadocs loader)
│       └── layout.shared.tsx  # Shared layout options
├── source.config.ts       # Fumadocs MDX configuration
├── next.config.mjs        # Next.js configuration
└── package.json
```

---

## Links

- **Documentation site** — [https://docs.slices.market](https://docs.slices.market)
- **Platform** — [https://slices.market](https://slices.market)
- **Repository** — [GitHub](https://github.com/slices-market/rwa-platform-docs-new)
- **Fumadocs** — [https://fumadocs.dev](https://fumadocs.dev)
- **Next.js** — [https://nextjs.org/docs](https://nextjs.org/docs)
