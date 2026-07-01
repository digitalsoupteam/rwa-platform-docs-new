import type { ApiParam, ApiHeader } from '@/lib/api-data';

// ── Parameter table row — like Uniswap's parameter rows ──
// Shows: name (mono), type badge, required badge, description
// If param has children (expanded input type), renders them nested with indentation.

interface ApiParamRowProps {
  param: ApiParam | ApiHeader;
  depth?: number;
}

export function ApiParamRow({ param, depth = 0 }: ApiParamRowProps) {
  const hasChildren = 'children' in param && param.children && param.children.length > 0;
  const indentClass = depth > 0 ? `ml-${depth * 6}` : '';

  return (
    <div className="flex flex-col gap-1 border-b border-fd-border py-3 last:border-b-0 sm:flex-row sm:items-start sm:gap-4">
      {/* Name */}
      <div className={`sm:w-48 sm:shrink-0 ${indentClass}`}>
        <code className="text-sm font-medium text-fd-foreground">{param.name}</code>
        {depth > 0 && (
          <span className="ml-2 text-xs text-fd-muted-foreground">↳</span>
        )}
      </div>
      {/* Badges + description */}
      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Type badge */}
          <span className="rounded px-1.5 py-0.5 text-xs font-mono text-fd-muted-foreground">
            {param.type}
          </span>
          {/* Required badge */}
          {param.required && (
            <span className="rounded bg-fd-primary/10 px-1.5 py-0.5 text-xs font-medium text-fd-primary">
              required
            </span>
          )}
          {!param.required && (
            <span className="rounded px-1.5 py-0.5 text-xs text-fd-muted-foreground">
              optional
            </span>
          )}
        </div>
        {param.description && (
          <p className="text-sm text-fd-muted-foreground">{param.description}</p>
        )}
        {/* Render children (expanded input fields) */}
        {hasChildren && (
          <div className="mt-3 rounded-lg border border-fd-border bg-fd-muted/30 p-3">
            <div className="mb-2 text-xs font-medium text-fd-muted-foreground">
              {('type' in param && (param as ApiParam).type?.replace(/[![\]]/g, '')) || 'Fields'}:
            </div>
            <div className="flex flex-col">
              {('children' in param ? param.children : [])!.map((child, i) => (
                <ApiParamRow key={i} param={child} depth={depth + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Parameter table — section with title and rows ──

interface ApiParamTableProps {
  title: string;
  params: (ApiParam | ApiHeader)[];
  emptyMessage?: string;
}

export function ApiParamTable({ title, params, emptyMessage }: ApiParamTableProps) {
  if (params.length === 0 && !emptyMessage) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold text-fd-foreground">{title}</h2>
      {params.length > 0 ? (
        <div className="rounded-lg border border-fd-border">
          <div className="px-4">
            {params.map((param, i) => (
              <ApiParamRow key={i} param={param} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-fd-muted-foreground">
          {emptyMessage ?? 'No parameters required.'}
        </p>
      )}
    </section>
  );
}