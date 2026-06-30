'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

// ── Static code block with copy button + dark syntax-highlighted theme ──
// Mimics the Uniswap-style dark code blocks: dark background, colored tokens.

interface ApiCodeBlockProps {
  code: string;
  label?: string;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'purple' | 'gray';
  language?: 'graphql' | 'json' | 'bash';
}

const badgeColors: Record<string, string> = {
  blue: 'bg-blue-500/15 text-blue-500',
  green: 'bg-emerald-500/15 text-emerald-500',
  purple: 'bg-purple-500/15 text-purple-500',
  gray: 'bg-gray-500/15 text-gray-500',
};

// Lightweight GraphQL/token highlighter — no external deps.
// Produces HTML spans for keywords, strings, types, comments, punctuation.
function highlightCode(code: string, language: string): string {
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  let html = escapeHtml(code);

  if (language === 'graphql') {
    // Comments
    html = html.replace(/(^|\n)(#[^\n]*)/g, '$1<span class="tok-comment">$2</span>');
    // Strings
    html = html.replace(/"([^"]*)"/g, '<span class="tok-string">"$1"</span>');
    // GraphQL keywords
    html = html.replace(
      /\b(query|mutation|subscription|fragment|on|type|input|enum|interface|union|scalar|extend|schema|implements|directive)\b/g,
      '<span class="tok-keyword">$1</span>',
    );
    // Types (Capitalized words)
    html = html.replace(
      /\b([A-Z][A-Za-z0-9_]*)(!?)/g,
      '<span class="tok-type">$1$2</span>',
    );
    // Directives (@something)
    html = html.replace(/(@[A-Za-z0-9_]+)/g, '<span class="tok-directive">$1</span>');
    // Arguments (field: value) — highlight the field name before :
    html = html.replace(/(\b[a-z][A-Za-z0-9_]*)(\s*:)/g, '<span class="tok-property">$1</span>$2');
  } else if (language === 'json') {
    // Use placeholder approach to avoid regex matching inside HTML attributes
    // 1. Replace keys ("key":) with placeholders
    const keys: string[] = [];
    html = html.replace(/"([^"]*)"(\s*:)/g, (_, key, colon) => {
      const placeholder = `\x00K${keys.length}\x00`;
      keys.push(`<span class="tok-property">"${key}"</span>${colon}`);
      return placeholder;
    });
    // 2. Replace remaining strings (values)
    const strings: string[] = [];
    html = html.replace(/"([^"]*)"/g, (_, val) => {
      const placeholder = `\x00S${strings.length}\x00`;
      strings.push(`<span class="tok-string">"${val}"</span>`);
      return placeholder;
    });
    // 3. Numbers
    html = html.replace(/\b(-?\d+\.?\d*)\b/g, '<span class="tok-number">$1</span>');
    // 4. Booleans, null
    html = html.replace(/\b(true|false|null)\b/g, '<span class="tok-keyword">$1</span>');
    // 5. Restore placeholders
    html = html.replace(/\x00K(\d+)\x00/g, (_, i) => keys[Number(i)] ?? '');
    html = html.replace(/\x00S(\d+)\x00/g, (_, i) => strings[Number(i)] ?? '');
  } else if (language === 'bash') {
    // Comments
    html = html.replace(/(^|\n)(#[^\n]*)/g, '$1<span class="tok-comment">$2</span>');
    // Strings (single + double quoted)
    html = html.replace(/'([^']*)'/g, '<span class="tok-string">\'$1\'</span>');
    html = html.replace(/"([^"]*)"/g, '<span class="tok-string">"$1"</span>');
    // Flags
    html = html.replace(/(^|\s)(--?[A-Za-z][A-Za-z0-9-]*)/g, '$1<span class="tok-flag">$2</span>');
    // curl commands
    html = html.replace(/\b(curl|--request|--url|--header|--data)\b/g, '<span class="tok-keyword">$1</span>');
  }

  return html;
}

export function ApiCodeBlock({
  code,
  label,
  badge,
  badgeColor = 'gray',
  language = 'graphql',
}: ApiCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose overflow-hidden rounded-lg border border-fd-border bg-[#1e1e2e] dark:bg-[#11111b]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <div className="flex items-center gap-2">
          {badge && (
            <span
              className={cn(
                'rounded px-1.5 py-0.5 text-xs font-medium',
                badgeColors[badgeColor],
              )}
            >
              {badge}
            </span>
          )}
          {label && (
            <span className="text-xs font-medium text-gray-400">{label}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      {/* Code body */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code
          className="font-mono text-[#cdd6f4]"
          dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
        />
      </pre>
    </div>
  );
}