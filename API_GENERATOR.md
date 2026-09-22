# API Reference Generator

The API documentation (GraphQL + REST) is generated from the backend sources by a single script.

## Sources

| What | Where |
|---|---|
| GraphQL schemas | `<backend>/services/gateway/src/graphql/modules/*/schema.graphql` |
| REST controllers | `<backend>/services/gateway/src/controllers/*.controller.ts` |
| Generator | `scripts/gen-api-data.ts` |
| Output | `src/lib/api-data.ts` (auto-generated — do not edit by hand) |

## When to run

After **any** change to the backend GraphQL schemas or REST controllers:
- added/removed a field in a type
- added/removed a mutation or query
- changed an input type
- added a new REST endpoint
- changed an enum

## How to update

```bash
# Run from the docs repo root.
# The backend checkout path can be passed as an argument or via an env var;
# without it the script uses its default local checkout path.

# 1. Generate api-data.ts from the schemas
bun run scripts/gen-api-data.ts /path/to/rwa-backend
# — or —
RWA_BACKEND_PATH=/path/to/rwa-backend bun run scripts/gen-api-data.ts

# 2. Check that TypeScript compiles without errors
bunx tsc --noEmit

# 3. (optional) run the dev server and check visually
bun run dev
```

If `tsc --noEmit` complains — it almost always means the schema contains something non-standard (a new custom scalar whose syntax the parser does not cover). Fix `scripts/gen-api-data.ts`, not the generated file.

## What is generated automatically

- **133 GraphQL operations** (Query / Mutation / Subscription) from 19 modules
- **5 REST endpoints** from Elysia controllers
- **65 types**, 101 input types, 13 enums
- Input types are inlined into `params` as `children` (recursively)
- Return types are fully expanded — nested custom types become literals
- Enum values are inlined into the description: `enum: like | dislike | love`
- MDX pages (`content/docs/api/**/*.mdx`) are **not** generated — create them manually when a new operation is added

## Structure of api-data.ts

```
apiModuleMeta       — { module: { label, icon } }     — module metadata
apiSubgroupLabels   — { subgroup: label }              — human-readable subgroup names
apiOperations       — ApiOperation[]                   — all operations (GraphQL + REST)
typeDefs            — Record<string, string>           — type fields (kept for backwards compatibility)
getApiOperation()   — lookup by module + name
getModuleOperations() — all operations of a module
formatReturnType()  — expands \n into multiline output
```

## Adding a new operation to the docs

1. Add the operation to the backend GraphQL schema
2. Run the generator (see above)
3. Create an MDX page at `content/docs/api/<module>/<subgroup>/<operation-name>.mdx`:

```mdx
---
title: operationName
description: Module — Mutation
---

<ApiEndpoint module="moduleName" operation="operationName" />
```

4. Add the page to `content/docs/api/<module>/<subgroup>/meta.json` in the `pages` array
5. `bunx tsc --noEmit` — make sure everything compiles
