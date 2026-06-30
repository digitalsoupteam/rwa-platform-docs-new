import { getApiOperation, apiModuleMeta, apiSubgroupLabels, inputDefs, formatReturnType } from '@/lib/api-data';
import { ApiParamTable } from './api-param-table';
import { ApiExamplePanel } from './api-example-panel';
import { Lock, ArrowUpRight } from 'lucide-react';

// ── Main API endpoint component: 2-column layout ──
// Left: title, description, params, headers, return type
// Right: sticky code panel with request/response examples
// Used in MDX: <ApiEndpoint module="rwa" operation="getBusiness" />

interface ApiEndpointProps {
  module: string;
  operation: string;
}

export function ApiEndpoint({ module, operation }: ApiEndpointProps) {
  const op = getApiOperation(module, operation);

  if (!op) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400">
        API operation not found: {module}/{operation}
      </div>
    );
  }

  const moduleLabel = apiModuleMeta[module]?.label ?? module;
  const subgroupLabel = apiSubgroupLabels[op.subgroup] ?? op.subgroup;

  const typeBadge: Record<string, string> = {
    Query: 'bg-blue-500/10 text-blue-500',
    Mutation: 'bg-amber-500/10 text-amber-500',
    Subscription: 'bg-purple-500/10 text-purple-500',
    REST: 'bg-emerald-500/10 text-emerald-500',
  };

  // Find input types from params
  const inputParams = op.params.filter(p => p.name === 'input' && p.type.endsWith('!'));
  const inputTypeName = op.params.find(p => p.name === 'input')?.type.replace(/[![\]]/g, '') ?? null;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px] xl:gap-12">
      {/* ── Left column: documentation ── */}
      <div className="min-w-0">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-fd-muted-foreground">
          <span>{moduleLabel}</span>
          <span className="text-fd-border">/</span>
          <span>{subgroupLabel}</span>
          <span className="text-fd-border">/</span>
          <code className="font-mono text-fd-foreground">{op.name}</code>
        </div>

        {/* Title */}
        <div className="mb-2 flex items-center gap-3">
          <h1 className="text-3xl font-bold text-fd-foreground">{op.name}</h1>
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-semibold uppercase ${typeBadge[op.type]}`}
          >
            {op.type}
          </span>
        </div>

        {/* Description */}
        <p className="mb-6 text-base text-fd-muted-foreground">{op.description}</p>

        {/* Endpoint path (for REST) */}
        {op.type === 'REST' && op.path && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-fd-border px-4 py-3">
            <ArrowUpRight className="size-4 text-emerald-500" />
            <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-xs font-bold text-emerald-500">
              {op.method}
            </span>
            <code className="font-mono text-sm text-fd-foreground">{op.path}</code>
          </div>
        )}

        {/* Authorization section */}
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <Lock className="size-4 text-fd-muted-foreground" />
            <h2 className="text-lg font-semibold text-fd-foreground">Authorization</h2>
          </div>
          <div className="rounded-lg border border-fd-border">
            <div className="px-4">
              <div className="flex flex-col gap-1 border-b border-fd-border py-3 last:border-b-0 sm:flex-row sm:items-start sm:gap-4">
                <div className="sm:w-48 sm:shrink-0">
                  <code className="text-sm font-medium text-fd-foreground">Authorization</code>
                </div>
                <div className="flex flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="rounded px-1.5 py-0.5 text-xs font-mono text-fd-muted-foreground">
                      string
                    </span>
                    <span className="rounded bg-fd-primary/10 px-1.5 py-0.5 text-xs font-medium text-fd-primary">
                      required
                    </span>
                    <span className="rounded px-1.5 py-0.5 text-xs text-fd-muted-foreground">
                      header
                    </span>
                  </div>
                  <p className="text-sm text-fd-muted-foreground">
                    Bearer JWT access token. Obtain via the <code className="text-fd-foreground">authenticate</code> mutation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Parameters section (for REST) or Arguments (for GraphQL) */}
        {op.type === 'REST' ? (
          <ApiParamTable title="Parameters" params={op.params} />
        ) : (
          <ApiParamTable
            title="Arguments"
            params={op.params}
            emptyMessage="This operation takes no arguments."
          />
        )}

        {/* Input Type section — shows expanded fields for GraphQL input types */}
        {inputTypeName && inputDefs[inputTypeName] && (
          <section className="mt-8">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-lg font-semibold text-fd-foreground">Input Type</h2>
              <code className="rounded-md bg-fd-primary/10 px-1.5 py-0.5 text-xs font-mono text-fd-primary">
                {inputTypeName}
              </code>
            </div>
            <div className="rounded-lg border border-fd-border">
              <div className="p-3">
                <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-fd-foreground">
                  <code>{renderInputTypeFields(inputTypeName, inputDefs, 0)}</code>
                </pre>
              </div>
            </div>
          </section>
        )}

        {/* Headers section (for REST) */}
        {op.headers && op.headers.length > 0 && (
          <ApiParamTable title="Headers" params={op.headers} />
        )}

        {/* Return type */}
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-fd-foreground">Return Type</h2>
          <div className="rounded-lg border border-fd-border">
            <div className="p-3">
              <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-fd-foreground">
                <code>{formatReturnType(op.returnType)}</code>
              </pre>
            </div>
          </div>
        </section>
      </div>

      {/* ── Right column: sticky code panel ── */}
      <div className="hidden lg:block">
        <div className="sticky top-20">
          <ApiExamplePanel operation={op} />
        </div>
      </div>

      {/* ── Mobile: code panel inline (not sticky) ── */}
      <div className="lg:hidden">
        <ApiExamplePanel operation={op} />
      </div>
    </div>
  );
}

// Recursively render input type fields with proper indentation
function renderInputTypeFields(typeName: string, defs: Record<string, string>, depth: number): string {
  const fieldsStr = defs[typeName];
  if (!fieldsStr) return `  // ${typeName} — type not found`;

  const indent = '  '.repeat(depth + 1);
  const closeIndent = '  '.repeat(depth);

  const fields = fieldsStr.split(', ').map(f => {
    const [name, type] = f.split(': ');
    if (!type) return `${indent}${f}`;
    // Check if the type references another input type
    const baseType = type.replace(/[![\]]/g, '');
    if (defs[baseType]) {
      // Nested input type
      const nestedFields = renderInputTypeFields(baseType, defs, depth + 1);
      return `${indent}${name}: ${type} {\n${nestedFields}${indent}}`;
    }
    return `${indent}${f}`;
  });

  return fields.join('\n');
}