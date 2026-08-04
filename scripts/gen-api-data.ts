#!/usr/bin/env bun
/**
 * gen-api-data.ts
 *
 * Reads all GraphQL schema files from the gateway, merges them into one SDL,
 * parses types/enums/inputs/operations, then also parses REST controllers
 * (Elysia .post('/api/...', ...)) to produce a fully typed api-data.ts
 * for the documentation site.
 *
 * Key design decisions:
 * - Input types are inlined: if a mutation takes `input: CreateBusinessInput!`,
 *   the `params` array contains ONE param `input` with `children` = the expanded
 *   fields of that input type (recursively, including nested input types).
 * - Return types are fully expanded: `Business! { id: ID!, name: String!, ... }`
 *   with nested custom types inlined as literal objects.
 * - Enums are resolved: enum values are embedded in the type description.
 * - REST controllers are parsed from source files and merged into the same
 *   operations array as GraphQL operations.
 *
 * Usage:
 *   bun run scripts/gen-api-data.ts
 *
 * Output: src/lib/api-data.ts (overwrites)
 */

import * as fs from 'fs';
import * as path from 'path';

// ─── Paths ───────────────────────────────────────────────────────────────────

const GRAPHQL_MODULES_DIR =
  'C:\\Users\\User\\Desktop\\WORK2025\\rwa-backend-new2\\services\\gateway\\src\\graphql\\modules';
const CONTROLLERS_DIR =
  'C:\\Users\\User\\Desktop\\WORK2025\\rwa-backend-new2\\services\\gateway\\src\\controllers';
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'lib', 'api-data.ts');

// ─── Types ───────────────────────────────────────────────────────────────────

interface GraphqlField {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

interface InputType {
  name: string;
  fields: GraphqlField[];
}

interface OutputType {
  name: string;
  fields: GraphqlField[];
}

interface EnumDef {
  name: string;
  values: string[];
}

interface Operation {
  name: string;
  kind: 'Query' | 'Mutation' | 'Subscription';
  params: GraphqlField[];
  returnType: string;
  description: string;
}

interface ModuleSchema {
  moduleName: string;
  types: OutputType[];
  inputs: InputType[];
  enums: EnumDef[];
  operations: Operation[];
  comments: Record<string, string>; // field/param name → comment from # ...
}

interface RestParam {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

interface RestEndpoint {
  module: string;
  subgroup: string;
  name: string;
  method: string;
  path: string;
  description: string;
  params: RestParam[];
  headers: { name: string; type: string; required: boolean; description: string }[];
  returnType: string;
}

// ─── Module metadata (preserved from existing file) ──────────────────────────

const apiModuleMeta: Record<string, { label: string; icon: string }> = {
  'ai-assistant': { label: 'AI Assistant', icon: 'Bot' },
  'ai-evaluator': { label: 'AI Evaluator', icon: 'Sparkles' },
  'auth': { label: 'Authentication', icon: 'Lock' },
  'blog': { label: 'Blog', icon: 'Newspaper' },
  'charts': { label: 'Charts', icon: 'BarChart3' },
  'company': { label: 'Companies', icon: 'Building2' },
  'dao': { label: 'Governance (DAO)', icon: 'Landmark' },
  'documents': { label: 'Documents', icon: 'FileText' },
  'faq': { label: 'FAQ', icon: 'HelpCircle' },
  'gallery': { label: 'Gallery', icon: 'Image' },
  'loyalty': { label: 'Loyalty & Referrals', icon: 'Gift' },
  'portfolio': { label: 'Portfolio', icon: 'Wallet' },
  'questions': { label: 'Questions', icon: 'MessageCircle' },
  'reactions': { label: 'Reactions', icon: 'Heart' },
  'rwa': { label: 'Pools & Businesses', icon: 'Circle' },
  'signers-manager': { label: 'Signers Manager', icon: 'PenLine' },
  'testnet-faucet': { label: 'Testnet Faucet', icon: 'Coins' },
  'api-keys': { label: 'API Keys', icon: 'Key' },
  'webhooks': { label: 'Webhooks', icon: 'Webhook' },
};

const apiSubgroupLabels: Record<string, string> = {
  'answers': 'Answers',
  'assistants': 'Assistants',
  'blogs': 'Blogs',
  'businesses': 'Businesses',
  'company': 'Companies',
  'documents': 'Documents',
  'folders': 'Folders',
  'galleries': 'Galleries',
  'images': 'Images',
  'members': 'Members',
  'messages': 'Messages',
  'permissions': 'Permissions',
  'pools': 'Pools',
  'posts': 'Posts',
  'questions': 'Questions',
  'rest': 'REST Endpoints',
  'topics': 'Topics',
  'api-keys': 'API Keys',
  'webhooks': 'Webhooks',
};

// ─── SDL Parser ──────────────────────────────────────────────────────────────

/**
 * Parse a single GraphQL SDL file into structured data.
 * We don't use a full GraphQL parser — the schemas are simple enough
 * for a line-based parser. We handle:
 *   - scalar X
 *   - enum X { ... }
 *   - type X { ... }
 *   - input X { ... }
 *   - extend type Query/Mutation/Subscription { ... }
 *   - # comments before fields/operations
 */
function parseSdlFile(filePath: string, moduleName: string): ModuleSchema {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const types: OutputType[] = [];
  const inputs: InputType[] = [];
  const enums: EnumDef[] = [];
  const operations: Operation[] = [];
  const comments: Record<string, string> = {};

  let i = 0;
  let pendingComment = '';

  function strip(s: string): string {
    return s.trim().replace(/#.*$/, '').trim();
  }

  function parseFieldLine(line: string): GraphqlField | null {
    // Matches:  fieldName: Type!  or  fieldName: [Type!]!  or  fieldName(arg: Type): RetType
    const cleaned = strip(line);
    if (!cleaned || cleaned.startsWith('#')) return null;

    // Operation line: name(args): RetType!
    // Field line: name: Type
    // We need to distinguish: operations have (...) before the colon
    const opMatch = cleaned.match(/^(\w+)\s*\(([^)]*)\)\s*:\s*(.+)$/);
    if (opMatch) {
      const [, opName, argsStr, retType] = opMatch;
      return {
        name: opName,
        type: retType.trim(),
        required: retType.trim().endsWith('!'),
      };
    }

    const fieldMatch = cleaned.match(/^(\w+)\s*:\s*(.+)$/);
    if (fieldMatch) {
      const [, fieldName, fieldType] = fieldMatch;
      return {
        name: fieldName,
        type: fieldType.trim(),
        required: fieldType.trim().endsWith('!'),
      };
    }

    return null;
  }

  function parseOperationArgs(argsStr: string): GraphqlField[] {
    if (!argsStr.trim()) return [];
    // Split by comma, but respect nesting (e.g. input: FooBar!)
    const parts = splitArgs(argsStr);
    return parts
      .map((part) => {
        const m = part.trim().match(/^(\w+)\s*:\s*(.+)$/);
        if (!m) return null;
        const [, name, type] = m;
        return {
          name,
          type: type.trim(),
          required: type.trim().endsWith('!'),
        };
      })
      .filter((x): x is GraphqlField => x !== null);
  }

  function processOpBlock(
    opLines: string[],
    kind: Operation['kind'],
    operations: Operation[],
    comment: string,
  ): void {
    if (opLines.length === 0) return;

    // Join all lines into one, then parse
    const joined = opLines.join(' ').replace(/\s+/g, ' ').trim();
    if (!joined) return;

    // Operation with args: name(args): RetType!
    const opWithArgsMatch = joined.match(/^(\w+)\s*\(([^)]*)\)\s*:\s*(.+)$/);
    if (opWithArgsMatch) {
      const [, opName, argsStr, retType] = opWithArgsMatch;
      operations.push({
        name: opName,
        kind,
        params: parseOperationArgs(argsStr),
        returnType: retType.trim(),
        description: comment || generateOpDescription(opName, kind),
      });
      return;
    }

    // Operation without args: name: RetType!
    const opNoArgsMatch = joined.match(/^(\w+)\s*:\s*(.+)$/);
    if (opNoArgsMatch) {
      const [, opName, retType] = opNoArgsMatch;
      operations.push({
        name: opName,
        kind,
        params: [],
        returnType: retType.trim(),
        description: comment || generateOpDescription(opName, kind),
      });
    }
  }

  function splitArgs(s: string): string[] {
    const processed = s.trim().replace(/\s+/g, ' ');
    if (!processed) return [];

    // Try comma split first
    let parts = processed.split(',').map((p) => p.trim()).filter(Boolean);

    // If single part but multiple args detected, split by arg pattern.
    // In GraphQL SDL, args can be separated by newlines (no commas).
    // Each arg is `name: type` where type is [Type!]! or Type! or Type
    if (parts.length === 1) {
      const argPattern = /\w+\s*:\s*(?:\[[\w!]+\]!?|[\w!]+)/g;
      const matches = processed.match(argPattern);
      if (matches && matches.length > 1) {
        parts = matches;
      }
    }

    return parts;
  }

  while (i < lines.length) {
    const rawLine = lines[i];
    const cleaned = strip(rawLine);

    // Track comments
    if (rawLine.trim().startsWith('#')) {
      const commentText = rawLine.trim().replace(/^#+\s?/, '');
      if (pendingComment) {
        pendingComment += ' ' + commentText;
      } else {
        pendingComment = commentText;
      }
      i++;
      continue;
    }

    if (!cleaned) {
      i++;
      // Don't reset pendingComment on empty lines — it might apply to next block
      continue;
    }

    // scalar X
    if (/^scalar\s+/.test(cleaned)) {
      pendingComment = '';
      i++;
      continue;
    }

    // enum X {
    const enumMatch = cleaned.match(/^enum\s+(\w+)\s*\{/);
    if (enumMatch) {
      const [, enumName] = enumMatch;
      const values: string[] = [];
      const enumComment = pendingComment;
      pendingComment = '';
      i++;
      while (i < lines.length && !lines[i].includes('}')) {
        const val = strip(lines[i]);
        if (val) values.push(val);
        i++;
      }
      i++; // skip closing }
      const ed: EnumDef = { name: enumName, values };
      enums.push(ed);
      if (enumComment) comments[enumName] = enumComment;
      continue;
    }

    // type X {
    const typeMatch = cleaned.match(/^type\s+(\w+)\s*\{/);
    if (typeMatch) {
      const [, typeName] = typeMatch;
      const typeComment = pendingComment;
      pendingComment = '';
      const fields: GraphqlField[] = [];
      i++;
      while (i < lines.length && !lines[i].includes('}')) {
        const f = parseFieldLine(lines[i]);
        const lineComment = lines[i].trim().startsWith('#')
          ? lines[i].trim().replace(/^#+\s?/, '')
          : '';
        if (f) {
          fields.push({
            ...f,
            ...(lineComment ? { description: lineComment } : {}),
          });
        }
        i++;
      }
      i++; // skip closing }
      types.push({ name: typeName, fields });
      if (typeComment) comments[typeName] = typeComment;
      continue;
    }

    // input X {
    const inputMatch = cleaned.match(/^input\s+(\w+)\s*\{/);
    if (inputMatch) {
      const [, inputName] = inputMatch;
      const inputComment = pendingComment;
      pendingComment = '';
      const fields: GraphqlField[] = [];
      i++;
      while (i < lines.length && !lines[i].includes('}')) {
        const f = parseFieldLine(lines[i]);
        const lineComment = lines[i].trim().startsWith('#')
          ? lines[i].trim().replace(/^#+\s?/, '')
          : '';
        if (f) {
          fields.push({
            ...f,
            ...(lineComment ? { description: lineComment } : {}),
          });
        }
        i++;
      }
      i++; // skip closing }
      inputs.push({ name: inputName, fields });
      if (inputComment) comments[inputName] = inputComment;
      continue;
    }

    // extend type Query/Mutation/Subscription {
    const extendMatch = cleaned.match(/^extend\s+type\s+(Query|Mutation|Subscription)\s*\{/);
    if (extendMatch) {
      const [, kind] = extendMatch;
      pendingComment = '';
      i++;

      // Accumulate lines until we close the extend block.
      // We need to handle multi-line operation signatures where
      // the operation args span multiple lines:
      //   getUserAssistants(
      //     pagination: PaginationInput
      //   ): [Assistant!]!
      //
      // Strategy: accumulate lines until we have a balanced `)` followed by `: RetType`
      let blockLines: string[] = [];
      let parenDepth = 0;
      let startedCollecting = false;

      while (i < lines.length) {
        const rawLine = lines[i];

        // Closing brace of the extend block
        // Only count it if we're not inside parentheses
        const testLine = strip(rawLine);
        if (testLine === '}' && parenDepth === 0) {
          // Process any remaining accumulated block
          if (blockLines.length > 0) {
            processOpBlock(blockLines, kind as Operation['kind'], operations, pendingComment);
            pendingComment = '';
            blockLines = [];
          }
          break;
        }

        // Comment line
        if (rawLine.trim().startsWith('#')) {
          // If we have accumulated op lines, process them first (comment belongs to next op)
          if (blockLines.length > 0 && startedCollecting) {
            processOpBlock(blockLines, kind as Operation['kind'], operations, pendingComment);
            pendingComment = '';
            blockLines = [];
            startedCollecting = false;
          }
          const commentText = rawLine.trim().replace(/^#+\s?/, '');
          pendingComment = pendingComment ? pendingComment + ' ' + commentText : commentText;
          i++;
          continue;
        }

        if (!testLine) {
          // Empty line — if we have accumulated op, process it
          if (blockLines.length > 0 && startedCollecting) {
            processOpBlock(blockLines, kind as Operation['kind'], operations, pendingComment);
            pendingComment = '';
            blockLines = [];
            startedCollecting = false;
          }
          i++;
          continue;
        }

        // Count parens to detect multi-line operation signatures
        for (const ch of testLine) {
          if (ch === '(') parenDepth++;
          if (ch === ')') parenDepth--;
        }

        // If this line opens a paren but doesn't close it, we're starting a multi-line op
        if (testLine.includes('(') && parenDepth > 0) {
          startedCollecting = true;
        }

        blockLines.push(testLine);

        // If parens are balanced and we have a `:`, we have a complete operation
        if (parenDepth === 0 && startedCollecting) {
          processOpBlock(blockLines, kind as Operation['kind'], operations, pendingComment);
          pendingComment = '';
          blockLines = [];
          startedCollecting = false;
        } else if (parenDepth === 0 && !startedCollecting) {
          // Single-line operation or something else
          processOpBlock(blockLines, kind as Operation['kind'], operations, pendingComment);
          pendingComment = '';
          blockLines = [];
        }

        i++;
      }
      i++; // skip closing }
      continue;
    }

    // type Query/Mutation/Subscription { (base.schema.graphql)
    const baseTypeMatch = cleaned.match(/^(type)\s+(Query|Mutation|Subscription)\s*\{/);
    if (baseTypeMatch) {
      pendingComment = '';
      i++;
      while (i < lines.length && !lines[i].includes('}')) {
        i++;
      }
      i++;
      continue;
    }

    pendingComment = '';
    i++;
  }

  return { moduleName, types, inputs, enums, operations, comments };
}

function generateOpDescription(name: string, kind: string): string {
  const isGet = name.startsWith('get');
  const isCreate = name.startsWith('create');
  const isUpdate = name.startsWith('update') || name.startsWith('edit');
  const isDelete = name.startsWith('delete') || name.startsWith('remove');
  const isReject = name.startsWith('reject');
  const isRequest = name.startsWith('request');
  const isRegister = name.startsWith('register');
  const isToggle = name.startsWith('toggle');
  const isReset = name.startsWith('reset');

  if (kind === 'Subscription') {
    return `Subscribe to real-time ${name} events`;
  }

  const entity = name
    .replace(/^(get|create|update|edit|delete|remove|reject|request|register|toggle|reset|set)/, '')
    .replace(/^(Business|Pool|Blog|Post|Document|Folder|Gallery|Image|FaqTopic|FaqAnswer|Topic|Question|Reaction|Member|Permission|ApiKey|WebhookEndpoint|Assistant|Message|Evaluation|SignatureTask|FaucetRequest|Staking|Proposal|Vote|StakingHistory|TimelockTask|TreasuryWithdraw|Fees|Referral|ReferrerWithdraw|ReferrerClaimHistory|TokenBalance|Transaction|Company|UserTokens|BusinessApprovalSignatures|PoolApprovalSignatures)/, (m) => m);

  if (isGet) return `Retrieve ${entity ? articleFor(entity) + ' ' + entity : 'data'}`;
  if (isCreate) return `Create a new ${entity || 'record'}`;
  if (isUpdate) return `Update an existing ${entity || 'record'}`;
  if (isDelete) return `Delete a ${entity || 'record'} by ID`;
  if (isReject) return `Reject pending ${entity || 'approval'}`;
  if (isRequest) return `Request ${entity || 'operation'}`;
  if (isRegister) return `Register a new ${entity || 'record'}`;
  if (isToggle) return `Toggle ${entity || 'a property'}`;
  if (isReset) return `Reset ${entity || 'data'}`;

  return `${name} operation`;
}

function articleFor(word: string): string {
  return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

// ─── Type resolver: inline custom types into field literals ──────────────────

/**
 * Build a global registry of all types, inputs, and enums across all modules.
 * Base types (SocialLink, PaginationInput, SortFieldInput, etc.) from
 * base.schema.graphql are included.
 */
interface GlobalRegistry {
  types: Map<string, OutputType>;
  inputs: Map<string, InputType>;
  enums: Map<string, EnumDef>;
  comments: Record<string, string>;
}

function buildGlobalRegistry(modules: ModuleSchema[]): GlobalRegistry {
  const types = new Map<string, OutputType>();
  const inputs = new Map<string, InputType>();
  const enums = new Map<string, EnumDef>();
  const comments: Record<string, string> = {};

  for (const mod of modules) {
    for (const t of mod.types) {
      types.set(t.name, t);
      if (mod.comments[t.name]) comments[t.name] = mod.comments[t.name];
    }
    for (const inp of mod.inputs) {
      inputs.set(inp.name, inp);
      if (mod.comments[inp.name]) comments[inp.name] = mod.comments[inp.name];
    }
    for (const e of mod.enums) {
      enums.set(e.name, e);
      if (mod.comments[e.name]) comments[e.name] = mod.comments[e.name];
    }
  }

  return { types, inputs, enums, comments };
}

/**
 * Resolve a GraphQL type string to its base type name (strips [ ] !).
 */
function baseTypeName(typeStr: string): string {
  return typeStr.replace(/[![\]]/g, '');
}

/**
 * Check if a type is a scalar (built-in or custom scalar).
 */
const SCALAR_TYPES = new Set([
  'String', 'Int', 'Float', 'Boolean', 'ID', 'JSON', 'Upload',
]);

function isScalar(typeName: string): boolean {
  return SCALAR_TYPES.has(typeName);
}

/**
 * Check if a type is an enum.
 */
function isEnum(typeName: string, reg: GlobalRegistry): boolean {
  return reg.enums.has(typeName);
}

/**
 * Format an enum type with its values inline:
 *   ReactionType (like | dislike | love | angry | sad | wow | haha)
 */
function formatEnumType(typeStr: string, reg: GlobalRegistry): string {
  const base = baseTypeName(typeStr);
  const enumDef = reg.enums.get(base);
  if (!enumDef) return typeStr;

  const values = enumDef.values.join(' | ');
  // Preserve original wrapper ([...]!)
  if (typeStr.startsWith('[')) {
    return `${typeStr} // ${values}`;
  }
  return `${typeStr} // ${values}`;
}

/**
 * Recursively expand a type's fields into a literal object string.
 * Used for return types and for children of input params.
 *
 * Example output for Business:
 *   Business! {
 *     id: ID!
 *     name: String!
 *     socials: [SocialLink!]! {
 *       type: String!
 *       url: String!
 *     }
 *     ...
 *   }
 *
 * For list types:
 *   [Business!]! {
 *     id: ID!
 *     ...
 *   }
 */
function expandTypeLiteral(
  typeStr: string,
  reg: GlobalRegistry,
  depth: number,
  visited: Set<string>,
): string {
  const base = baseTypeName(typeStr);

  // Scalars — return as-is, but expand enum values if applicable
  if (isScalar(base)) {
    return typeStr;
  }

  // Enums — append values
  if (isEnum(base, reg)) {
    return formatEnumType(typeStr, reg);
  }

  // Custom types — expand inline
  const typeDef = reg.types.get(base);
  if (typeDef && !visited.has(base)) {
    visited.add(base);
    const expanded = expandFields(typeDef.fields, reg, depth + 1, visited);
    visited.delete(base);
    return `${typeStr} {\n${expanded}\n${'  '.repeat(depth)}}`;
  }

  // Input types used as return types (rare but possible)
  const inputDef = reg.inputs.get(base);
  if (inputDef && !visited.has(base)) {
    visited.add(base);
    const expanded = expandFields(inputDef.fields, reg, depth + 1, visited);
    visited.delete(base);
    return `${typeStr} {\n${expanded}\n${'  '.repeat(depth)}}`;
  }

  // Unknown type — just return the type string
  return typeStr;
}

/**
 * Expand an array of fields into indented multi-line string.
 */
function expandFields(
  fields: GraphqlField[],
  reg: GlobalRegistry,
  depth: number,
  visited: Set<string>,
): string {
  const indent = '  '.repeat(depth);
  return fields
    .map((f) => {
      const base = baseTypeName(f.type);
      // If field type is a custom type/input/enum, expand inline
      if (!isScalar(base)) {
        const expanded = expandTypeLiteral(f.type, reg, depth, visited);
        return `${indent}${f.name}: ${expanded}`;
      }
      // Scalar or enum
      if (isEnum(base, reg)) {
        return `${indent}${f.name}: ${formatEnumType(f.type, reg)}`;
      }
      return `${indent}${f.name}: ${f.type}`;
    })
    .join('\n');
}

/**
 * Expand input type fields for use as children of an `input` param.
 * Returns array of {name, type, required, description?, children?}
 */
interface ExpandedParam {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  children?: ExpandedParam[];
}

function expandInputFields(
  inputName: string,
  reg: GlobalRegistry,
  visited: Set<string>,
): ExpandedParam[] | null {
  const inputDef = reg.inputs.get(inputName);
  if (!inputDef) return null;
  if (visited.has(inputName)) return null; // circular guard
  visited.add(inputName);

  const result = inputDef.fields.map((f): ExpandedParam => {
    const base = baseTypeName(f.type);
    const isCustomInput = reg.inputs.has(base) && !isScalar(base) && !isEnum(base, reg);

    if (isCustomInput) {
      const children = expandInputFields(base, reg, visited);
      return {
        name: f.name,
        type: f.type,
        required: f.required,
        ...(f.description ? { description: f.description } : {}),
        ...(children ? { children } : {}),
      };
    }

    // Enum — include values in description
    if (isEnum(base, reg)) {
      const enumDef = reg.enums.get(base)!;
      const enumValues = enumDef.values.join(' | ');
      return {
        name: f.name,
        type: f.type,
        required: f.required,
        description: f.description
          ? `${f.description} (enum: ${enumValues})`
          : `enum: ${enumValues}`,
      };
    }

    return {
      name: f.name,
      type: f.type,
      required: f.required,
      ...(f.description ? { description: f.description } : {}),
    };
  });

  visited.delete(inputName);
  return result;
}

// ─── REST Controller Parser ──────────────────────────────────────────────────

/**
 * Parse Elysia controller files to extract REST endpoints.
 * Looks for patterns like:
 *   .post('/api/path', handler, { body: t.Object({...}), response: t.Object({...}) })
 *   .get('/api/path', handler, { ... })
 */
function parseRestControllers(): RestEndpoint[] {
  const endpoints: RestEndpoint[] = [];

  if (!fs.existsSync(CONTROLLERS_DIR)) return endpoints;

  const files = fs.readdirSync(CONTROLLERS_DIR).filter((f) => f.endsWith('.controller.ts'));

  for (const file of files) {
    const filePath = path.join(CONTROLLERS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Find the route path and method
    const routeMatch = content.match(/\.(post|get|put|patch|delete)\s*\(\s*['"`]([^'"`]+)['"`]/);
    if (!routeMatch) continue;
    const [, method, routePath] = routeMatch;

    // Determine module and subgroup from path
    const { module, subgroup, name } = classifyRestRoute(routePath, file);

    // Parse body schema (t.Object fields)
    const bodyMatch = content.match(/body:\s*t\.Object\s*\(\s*\{([^}]+)\}/s);
    const params: RestParam[] = [];
    if (bodyMatch) {
      const bodyFields = bodyMatch[1];
      const fieldRegex = /(\w+):\s*t\.(\w+)(?:\(\s*\))?/g;
      let m;
      while ((m = fieldRegex.exec(bodyFields)) !== null) {
        const [, fieldName, fieldType] = m;
        const tsType = elysiaTypeToTs(fieldType);
        params.push({
          name: fieldName,
          type: tsType,
          required: !bodyFields.includes(`${fieldName}: t.Optional`),
        });
      }
    }

    // Parse response schema for return type
    const responseMatch = content.match(/response:\s*t\.Object\s*\(\s*\{([^}]+)\}/s);
    let returnType = 'JSON';
    if (responseMatch) {
      const responseFields = responseMatch[1];
      const fieldRegex = /(\w+):\s*t\.(\w+)(?:\(\s*\))?/g;
      const respFields: string[] = [];
      let m;
      while ((m = fieldRegex.exec(responseFields)) !== null) {
        const [, fieldName, fieldType] = m;
        const tsType = elysiaTypeToTs(fieldType);
        const isOptional = responseFields.includes(`${fieldName}: t.Optional`);
        respFields.push(`${fieldName}: ${tsType}${isOptional ? '' : '!'}`);
      }
      if (respFields.length > 0) {
        returnType = `{ ${respFields.join(', ')} }`;
      }
    }

    // Build description
    const description = generateRestDescription(name, routePath);

    endpoints.push({
      module,
      subgroup,
      name,
      method: method.toUpperCase(),
      path: routePath,
      description,
      params,
      headers: [
        { name: 'Authorization', type: 'string', required: true, description: 'Bearer JWT access token' },
        { name: 'Content-Type', type: 'string', required: true, description: 'multipart/form-data' },
      ],
      returnType,
    });
  }

  return endpoints;
}

function elysiaTypeToTs(t: string): string {
  const map: Record<string, string> = {
    String: 'String',
    Number: 'Float',
    Boolean: 'Boolean',
    File: 'File',
    Optional: 'String',
    Object: 'JSON',
    Array: 'JSON',
  };
  return map[t] || 'String';
}

function classifyRestRoute(routePath: string, fileName: string): { module: string; subgroup: string; name: string } {
  // /api/gallery/createImage → module: gallery, subgroup: images, name: uploadImage
  // /api/documents/createDocument → module: documents, subgroup: documents, name: uploadDocument
  // /api/business/uploadImage → module: rwa, subgroup: businesses, name: uploadBusinessImage
  // /api/pool/uploadImage → module: rwa, subgroup: pools, name: uploadPoolImage

  if (routePath.startsWith('/api/gallery/')) return { module: 'gallery', subgroup: 'images', name: 'uploadImage' };
  if (routePath.startsWith('/api/documents/')) return { module: 'documents', subgroup: 'documents', name: 'uploadDocument' };
  if (routePath.startsWith('/api/business/')) return { module: 'rwa', subgroup: 'businesses', name: 'uploadBusinessImage' };
  if (routePath.startsWith('/api/pool/')) return { module: 'rwa', subgroup: 'pools', name: 'uploadPoolImage' };

  // Fallback: derive from file name
  const baseName = fileName.replace('.controller.ts', '');
  return { module: 'rwa', subgroup: 'rest', name: baseName };
}

function generateRestDescription(name: string, routePath: string): string {
  if (name.includes('Image')) return `Upload an image (multipart/form-data)`;
  if (name.includes('Document')) return `Upload a document (multipart/form-data)`;
  return `REST endpoint at ${routePath}`;
}

// ─── Subgroup inference ──────────────────────────────────────────────────────

/**
 * Infer the subgroup for a GraphQL operation based on its name and module.
 * Maps operation names to subgroups matching the existing apiSubgroupLabels.
 */
function inferSubgroup(moduleName: string, opName: string): string {
  // Module-specific mappings
  const moduleSubgroups: Record<string, Record<string, string>> = {
    'rwa': {
      // Businesses
      getBusiness: 'businesses', getBusinesses: 'businesses',
      createBusiness: 'businesses', createBusinessWithAI: 'businesses',
      editBusiness: 'businesses', updateBusinessRiskScore: 'businesses',
      requestBusinessApprovalSignatures: 'businesses', rejectBusinessApprovalSignatures: 'businesses',
      // Pools
      getPool: 'pools', getPools: 'pools',
      createPool: 'pools', createPoolWithAI: 'pools',
      editPool: 'pools', updatePoolRiskScore: 'pools',
      requestPoolApprovalSignatures: 'pools', rejectPoolApprovalSignatures: 'pools',
      poolDeployed: 'pools',
    },
    'blog': {
      getBlog: 'blogs', getBlogs: 'blogs', createBlog: 'blogs', updateBlog: 'blogs', deleteBlog: 'blogs',
      getPost: 'posts', getPosts: 'posts', createPost: 'posts', updatePost: 'posts', deletePost: 'posts',
    },
    'documents': {
      getDocument: 'documents', getDocuments: 'documents',
      createDocument: 'documents', updateDocument: 'documents', deleteDocument: 'documents',
      getFolder: 'folders', getFolders: 'folders',
      createFolder: 'folders', updateFolder: 'folders', deleteFolder: 'folders',
    },
    'gallery': {
      getGallery: 'galleries', getGalleries: 'galleries',
      createGallery: 'galleries', updateGallery: 'galleries', deleteGallery: 'galleries',
      getImage: 'images', getImages: 'images',
      createImage: 'images', updateImage: 'images', deleteImage: 'images',
    },
    'faq': {
      getFaqTopic: 'topics', getFaqTopics: 'topics',
      createFaqTopic: 'topics', updateFaqTopic: 'topics', deleteFaqTopic: 'topics',
      getFaqAnswer: 'answers', getFaqAnswers: 'answers',
      createFaqAnswer: 'answers', updateFaqAnswer: 'answers', deleteFaqAnswer: 'answers',
    },
    'questions': {
      getTopic: 'topics', getTopics: 'topics',
      createTopic: 'topics', updateTopic: 'topics', deleteTopic: 'topics',
      getQuestion: 'questions', getQuestions: 'questions',
      createQuestion: 'questions', updateQuestionText: 'questions',
      createQuestionAnswer: 'questions', updateQuestionAnswer: 'questions',
      deleteQuestion: 'questions', toggleQuestionLike: 'questions',
    },
    'company': {
      getCompany: 'company', getCompanies: 'company',
      createCompany: 'company', updateCompany: 'company', deleteCompany: 'company',
      addMember: 'members', removeMember: 'members',
      grantPermission: 'permissions', revokePermission: 'permissions',
    },
    'ai-assistant': {
      getAssistant: 'assistants', getUserAssistants: 'assistants',
      createAssistant: 'assistants', updateAssistant: 'assistants', deleteAssistant: 'assistants',
      getMessage: 'messages', getMessageHistory: 'messages',
      createMessage: 'messages', updateMessage: 'messages', deleteMessage: 'messages',
    },
  };

  const moduleMap = moduleSubgroups[moduleName];
  if (moduleMap && moduleMap[opName]) return moduleMap[opName];

  // Default: use module name as subgroup
  return moduleName;
}

// ─── Code generation ─────────────────────────────────────────────────────────

function generateApiOperation(
  mod: ModuleSchema,
  op: Operation,
  reg: GlobalRegistry,
): string {
  const subgroup = inferSubgroup(mod.moduleName, op.name);

  // Process params — inline input type children
  const paramsCode = op.params
    .map((p) => {
      const base = baseTypeName(p.type);
      const isInputType = reg.inputs.has(base) && !isScalar(base);

      if (isInputType) {
        // Expand input fields as children
        const children = expandInputFields(base, reg, new Set());
        const childrenStr = children ? `, children: ${formatExpandedParams(children, 1)}` : '';
        return `      { name: '${p.name}', type: '${p.type}', required: ${p.required}, description: '${escapeStr(p.description ?? 'Input object with operation parameters')}'${childrenStr} }`;
      }

      // Enum param — include values in description
      if (isEnum(base, reg)) {
        const enumDef = reg.enums.get(base)!;
        const enumValues = enumDef.values.join(' | ');
        const desc = `${p.description ? p.description + '. ' : ''}enum: ${enumValues}`;
        return `      { name: '${p.name}', type: '${p.type}', required: ${p.required}, description: '${escapeStr(desc)}' }`;
      }

      return `      { name: '${p.name}', type: '${p.type}', required: ${p.required}${p.description ? `, description: '${escapeStr(p.description)}'` : ''} }`;
    })
    .join(',\n');

  // Process return type — expand inline
  const expandedReturn = expandTypeLiteral(op.returnType, reg, 0, new Set());
  const returnTypeStr = expandedReturn.replace(/\n/g, '\\n').replace(/'/g, "\\'");

  return `  {
    module: '${mod.moduleName}',
    subgroup: '${subgroup}',
    name: '${op.name}',
    type: '${op.kind}',
    description: '${escapeStr(op.description)}',
    params: [
${paramsCode || '      '}
    ],
    returnType: '${returnTypeStr}',
    endpoint: '/graphql',
  }`;
}

function formatExpandedParams(params: ExpandedParam[], indent: number): string {
  const pad = '  '.repeat(indent);
  const innerPad = '  '.repeat(indent + 1);
  return `[\n${params
    .map((p) => {
      let line = `${innerPad}{ name: '${p.name}', type: '${p.type}', required: ${p.required}`;
      if (p.description) line += `, description: '${escapeStr(p.description)}'`;
      if (p.children && p.children.length > 0) {
        line += `, children: ${formatExpandedParams(p.children, indent + 2)}`;
      }
      line += ' }';
      return line;
    })
    .join(',\n')}\n${pad}]`;
}

function generateRestOperation(ep: RestEndpoint): string {
  const paramsCode = ep.params
    .map((p) => `      { name: '${p.name}', type: '${p.type}', required: ${p.required}, description: '${escapeStr(p.description ?? '')}' }`)
    .join(',\n');

  const headersCode = ep.headers
    .map((h) => `      { name: '${h.name}', type: '${h.type}', required: ${h.required}, description: '${escapeStr(h.description)}' }`)
    .join(',\n');

  return `  {
    module: '${ep.module}',
    subgroup: '${ep.subgroup}',
    name: '${ep.name}',
    type: 'REST',
    description: '${escapeStr(ep.description)}',
    params: [
${paramsCode || '      '}
    ],
    headers: [
${headersCode}
    ],
    returnType: '${escapeStr(ep.returnType)}',
    endpoint: '${ep.path}',
    method: '${ep.method}',
    path: '${ep.path}',
  }`;
}

function generateTypeDefs(reg: GlobalRegistry): string {
  const entries: string[] = [];

  for (const [name, typeDef] of reg.types) {
    const fieldsStr = typeDef.fields
      .map((f) => {
        const base = baseTypeName(f.type);
        if (isEnum(base, reg)) {
          return `${f.name}: ${formatEnumType(f.type, reg)}`;
        }
        return `${f.name}: ${f.type}`;
      })
      .join(', ');
    entries.push(`  ${name}: '${escapeStr(fieldsStr)}'`);
  }

  return entries.join(',\n');
}

function escapeStr(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  // Read all entries — directories contain schema.graphql inside, base.schema.graphql is a file
  const entries = fs.readdirSync(GRAPHQL_MODULES_DIR).sort();
  const modules: ModuleSchema[] = [];

  for (const entry of entries) {
    const entryPath = path.join(GRAPHQL_MODULES_DIR, entry);
    const stat = fs.statSync(entryPath);

    if (stat.isDirectory()) {
      // Subdirectory with schema.graphql inside (e.g. modules/auth/schema.graphql)
      const schemaFile = path.join(entryPath, 'schema.graphql');
      if (fs.existsSync(schemaFile)) {
        const schema = parseSdlFile(schemaFile, entry);
        modules.push(schema);
      }
    } else if (entry.endsWith('.graphql')) {
      // Direct .graphql file (e.g. base.schema.graphql)
      const moduleName = entry.replace('.schema.graphql', '').replace('.graphql', '');
      const schema = parseSdlFile(entryPath, moduleName);
      modules.push(schema);
    }
  }

  // Build global registry
  const reg = buildGlobalRegistry(modules);

  // Parse REST controllers
  const restEndpoints = parseRestControllers();

  // Generate operations array
  const graphqlOps: string[] = [];
  for (const mod of modules) {
    if (mod.moduleName === 'base') continue;
    if (mod.operations.length === 0) continue;

    graphqlOps.push(`  // ═══════ ${apiModuleMeta[mod.moduleName]?.label ?? mod.moduleName} ═══════`);
    for (const op of mod.operations) {
      graphqlOps.push(generateApiOperation(mod, op, reg) + ',');
    }
  }

  // Add REST operations
  if (restEndpoints.length > 0) {
    graphqlOps.push('  // ═══════ REST ═══════');
    for (const ep of restEndpoints) {
      graphqlOps.push(generateRestOperation(ep) + ',');
    }
  }

  // Generate typeDefs
  const typeDefsCode = generateTypeDefs(reg);

  // Assemble final file
  const output = `// ═══════════════════════════════════════════════════════════════
// API Data Registry — AUTO-GENERATED by scripts/gen-api-data.ts
// Source: services/gateway/src/graphql/modules/*.graphql + controllers/*.ts
// DO NOT EDIT MANUALLY — run \`bun run scripts/gen-api-data.ts\` to regenerate.
// ═══════════════════════════════════════════════════════════════

export type ApiOperationType = 'Query' | 'Mutation' | 'Subscription' | 'REST';

export interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  children?: ApiParam[];
}

export interface ApiHeader {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface ApiOperation {
  module: string;
  subgroup: string;
  name: string;
  type: ApiOperationType;
  description: string;
  params: ApiParam[];
  headers?: ApiHeader[];
  returnType: string;
  endpoint: string;
  method?: string;
  path?: string;
}

// ── Module metadata ──
export const apiModuleMeta: Record<string, { label: string; icon: string }> = ${JSON.stringify(apiModuleMeta, null, 2)};

// ── Subgroup display labels ──
export const apiSubgroupLabels: Record<string, string> = ${JSON.stringify(apiSubgroupLabels, null, 2)};

// ── All operations ──
export const apiOperations: ApiOperation[] = [
${graphqlOps.join('\n')}
];

// ── GraphQL type definitions for output types ──
// Maps type name → comma-separated field definitions
export const typeDefs: Record<string, string> = {
${typeDefsCode}
};

// ── Lookup by module + operation name ──
export function getApiOperation(module: string, name: string): ApiOperation | undefined {
  return apiOperations.find((op) => op.module === module && op.name === name);
}

// ── Get all operations for a module ──
export function getModuleOperations(module: string): ApiOperation[] {
  return apiOperations.filter((op) => op.module === module);
}

// ── Get subgroups for a module ──
export function getModuleSubgroups(module: string): string[] {
  const ops = getModuleOperations(module);
  return [...new Set(ops.map((op) => op.subgroup))];
}

// ── Get operations for a module + subgroup ──
export function getSubgroupOperations(module: string, subgroup: string): ApiOperation[] {
  return apiOperations.filter((op) => op.module === module && op.subgroup === subgroup);
}

// ── Get all module names ──
export function getApiModules(): string[] {
  return [...new Set(apiOperations.map((op) => op.module))];
}

// ── Helper: format a GraphQL type with fields into a nice multi-line string ──
export function formatReturnType(returnType: string): string {
  // The returnType is already pre-formatted with \\n for newlines from the generator.
  // Just convert \\n to actual newlines.
  return returnType.replace(/\\\\n/g, '\\n');
}
`;

  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  console.log(`✓ Generated ${OUTPUT_FILE}`);
  console.log(`  Modules: ${modules.filter((m) => m.moduleName !== 'base').length}`);
  console.log(`  GraphQL operations: ${modules.reduce((acc, m) => acc + m.operations.length, 0)}`);
  console.log(`  REST endpoints: ${restEndpoints.length}`);
  console.log(`  Types: ${reg.types.size}, Inputs: ${reg.inputs.size}, Enums: ${reg.enums.size}`);
}

main();