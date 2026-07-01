import type { ApiOperation, ApiParam } from '@/lib/api-data';

// ── Generate example GraphQL query/mutation/subscription string ──

function generateGraphqlExample(op: ApiOperation): string {
  const { name, type, params, returnType } = op;

  // Build args string
  const args = params
    .map((p) => {
      const exampleVal = getExampleValue(p.name, p.type, p);
      return `${p.name}: ${exampleVal}`;
    })
    .join(', ');

  // Build a simple selection of fields from the return type
  const selection = generateSelection(returnType);

  const opType = type.toLowerCase(); // query | mutation | subscription

  if (type === 'Query' || type === 'Mutation' || type === 'Subscription') {
    const argsPart = args ? `(${args})` : '';
    return `${opType} ${name} {\n  ${name}${argsPart} {\n    ${selection}\n  }\n}`;
  }

  return '';
}

// Generate example value for a parameter
function getExampleValue(paramName: string, paramType: string, param?: ApiParam): string {
  const baseType = paramType.replace(/[![\]]/g, '');

  if (paramName === 'id') return '"0x123..."';
  if (paramName === 'poolAddress') return '"0xPoolContractAddress..."';
  if (paramName === 'startTime') return '1704067200000';
  if (paramName === 'endTime') return '1735689600000';
  if (paramName === 'interval') return '"1h"';
  if (paramName === 'parentId') return '"business-uuid-or-pool-uuid"';
  if (paramName === 'parentType') return '"business"';
  if (paramName === 'limit') return '10';
  if (paramName === 'offset') return '0';

  // Type-based defaults
  if (baseType === 'String') return '"example"';
  if (baseType === 'Int' || baseType === 'Float') return '0';
  if (baseType === 'Boolean') return 'false';
  if (baseType === 'ID') return '"0x123..."';

  // Input types — expand children if available
  if (param && param.children && param.children.length > 0) {
    const fields = param.children
      .map((child) => {
        const val = getExampleValue(child.name, child.type, child);
        return `${child.name}: ${val}`;
      })
      .join(', ');
    return `{ ${fields} }`;
  }

  // PaginationInput without children
  if (paramName === 'pagination') return '{ limit: 10, offset: 0 }';

  // Input types — show field stubs
  if (paramType.includes('Input') || paramType.includes('Filter')) {
    return '{}';
  }

  // Fallback
  return paramType.endsWith('!') ? '"value"' : 'null';
}

// Generate a basic field selection from return type
function generateSelection(returnType: string): string {
  // The returnType is now a fully expanded literal with \\n for newlines.
  // Extract field names from it for the selection.
  // Pattern: "fieldName: Type" — we just want the fieldName
  const lines = returnType.replace(/\\n/g, '\n').split('\n');
  const fields: string[] = [];

  for (const line of lines) {
    const match = line.match(/^\s*(\w+):\s*(.+)/);
    if (match) {
      const [, fieldName, fieldType] = match;
      // If the field type is a custom type with { ... }, include a sub-selection
      if (fieldType.includes('{')) {
        const subFields = extractSubFields(fieldType);
        fields.push(`${fieldName} { ${subFields} }`);
      } else {
        fields.push(fieldName);
      }
    }
  }

  if (fields.length > 0) {
    // Limit to reasonable number of fields for example
    return fields.slice(0, 8).join('\n    ');
  }

  // Fallback: use type name based selection
  const baseType = returnType.replace(/[![\]]/g, '');
  return generateTypeSpecificSelection(baseType);
}

function extractSubFields(typeStr: string): string {
  // Extract field names from a nested type literal
  const matches = typeStr.match(/\w+:/g) || [];
  return matches.slice(0, 4).map((m) => m.replace(':', '')).join(' ');
}

function generateTypeSpecificSelection(baseType: string): string {
  const commonFields = ['id', 'createdAt', 'updatedAt'];

  const typeFields: Record<string, string[]> = {
    Business: ['id', 'name', 'ownerId', 'chainId', 'riskScore', 'createdAt'],
    Pool: ['id', 'name', 'businessId', 'chainId', 'poolAddress', 'riskScore', 'createdAt'],
    Company: ['id', 'name', 'description', 'ownerId', 'createdAt'],
    CompanyWithDetails: ['id', 'name', 'description', 'ownerId', 'users { id userId name }', 'createdAt'],
    Document: ['id', 'name', 'fileId', 'url', 'mimeType', 'size', 'createdAt'],
    Folder: ['id', 'name', 'parentId', 'createdAt'],
    Gallery: ['id', 'name', 'parentId', 'createdAt'],
    Image: ['id', 'name', 'url', 'mimeType', 'size', 'createdAt'],
    Blog: ['id', 'name', 'ownerId', 'createdAt'],
    Post: ['id', 'title', 'content', 'createdAt'],
    FaqTopic: ['id', 'name', 'createdAt'],
    FaqAnswer: ['id', 'question', 'answer', 'order', 'createdAt'],
    Topic: ['id', 'name', 'createdAt'],
    Question: ['id', 'text', 'answered', 'likesCount', 'createdAt'],
    Answer: ['text', 'userId', 'createdAt'],
    Reaction: ['id', 'parentId', 'parentType', 'reaction', 'createdAt'],
    EntityReactionsResponse: ['reactions', 'userReactions'],
    PriceData: ['id', 'poolAddress', 'timestamp', 'price', 'createdAt'],
    OhlcData: ['timestamp', 'open', 'high', 'low', 'close'],
    VolumeData: ['timestamp', 'mintVolume', 'burnVolume'],
    PoolTransaction: ['id', 'transactionType', 'userAddress', 'timestamp', 'rwaAmount', 'holdAmount'],
    TokenBalance: ['id', 'tokenAddress', 'balance', 'lastUpdateBlock'],
    Transaction: ['id', 'from', 'to', 'transactionHash', 'amount', 'createdAt'],
    Staking: ['id', 'staker', 'amount', 'lastStakeTimestamp', 'chainId'],
    Proposal: ['id', 'proposalId', 'proposer', 'description', 'state', 'startTime', 'endTime'],
    Vote: ['id', 'proposalId', 'voterWallet', 'support', 'weight', 'createdAt'],
    StakingHistory: ['id', 'staker', 'amount', 'operation', 'chainId'],
    TimelockTask: ['id', 'txHash', 'target', 'eta', 'executed'],
    TreasuryWithdraw: ['id', 'recipient', 'token', 'amount', 'createdAt'],
    Fees: ['id', 'userWallet', 'buyCommissionAmount', 'sellCommissionAmount', 'createdAt'],
    Referral: ['id', 'userWallet', 'referrerWallet', 'createdAt'],
    ReferrerWithdraw: ['id', 'referrerWallet', 'totalWithdrawnAmount', 'taskId', 'createdAt'],
    ReferrerClaimHistory: ['id', 'referralWallet', 'amount', 'transactionHash', 'createdAt'],
    Assistant: ['id', 'name', 'contextPreferences'],
    Message: ['id', 'assistantId', 'text'],
    IdResponse: ['id'],
    Evaluation: ['id', 'entityType', 'status', 'riskScore', 'reasoning', 'factors { name impact detail }', 'createdAt'],
    FaucetRequest: ['id', 'tokenType', 'amount', 'transactionHash', 'createdAt'],
    UnlockTimeResponse: ['gasUnlockTime', 'holdUnlockTime', 'platformUnlockTime'],
    SignatureTask: ['id', 'hash', 'requiredSignatures', 'expired', 'completed', 'signatures { signer signature }'],
    AuthTokens: ['userId', 'wallet', 'accessToken', 'refreshToken'],
    RefreshToken: ['tokenId', 'userId', 'expiresAt', 'createdAt'],
    RevokeTokensResult: ['revokedCount'],
    Member: ['id', 'userId', 'name', 'createdAt'],
    Permission: ['id', 'permission', 'entity', 'createdAt'],
    ApprovalSignaturesResponse: ['taskId'],
    PriceUpdateEvent: ['poolAddress', 'timestamp', 'price'],
    TransactionEvent: ['poolAddress', 'timestamp', 'transactionType', 'userAddress'],
    SocialLink: ['type', 'url'],
    ApiKey: ['id', 'name', 'prefix', 'userId', 'wallet', 'createdAt'],
    CreateApiKeyResult: ['id', 'name', 'prefix', 'key', 'createdAt'],
    WebhookEndpoint: ['id', 'url', 'events', 'description', 'active', 'createdAt'],
    CreateWebhookEndpointResult: ['id', 'url', 'events', 'description', 'active', 'secret', 'createdAt'],
  };

  const fields = typeFields[baseType] ?? commonFields;
  return fields.join('\n    ');
}

// ── Generate example JSON response ──

function generateJsonResponse(op: ApiOperation): string {
  const { returnType, type } = op;
  const baseType = returnType.replace(/[![\]]/g, '');

  // For list types, wrap in array
  const isList = returnType.includes('[');

  // Build example object
  const exampleObj = buildExampleObject(baseType);

  if (type === 'Subscription') {
    return JSON.stringify(
      {
        data: {
          [op.name]: exampleObj,
        },
      },
      null,
      2,
    );
  }

  if (isList) {
    return JSON.stringify(
      {
        data: {
          [op.name]: [exampleObj],
        },
      },
      null,
      2,
    );
  }

  // Scalar returns
  if (baseType === 'Boolean') {
    return JSON.stringify({ data: { [op.name]: true } }, null, 2);
  }
  if (baseType === 'ID' || baseType === 'String') {
    return JSON.stringify({ data: { [op.name]: '<value>' } }, null, 2);
  }
  if (baseType === 'JSON') {
    return JSON.stringify({ data: { [op.name]: { success: true } } }, null, 2);
  }

  return JSON.stringify({ data: { [op.name]: exampleObj } }, null, 2);
}

function buildExampleObject(typeName: string): Record<string, unknown> {
  const examples: Record<string, Record<string, unknown>> = {
    Business: {
      id: '<ID>',
      name: '<String>',
      ownerId: '<String>',
      ownerType: 'company',
      chainId: '<String>',
      riskScore: 0,
      paused: false,
      createdAt: 1700000000000,
      updatedAt: 1700000000000,
    },
    Pool: {
      id: '<ID>',
      name: '<String>',
      businessId: '<String>',
      chainId: '<String>',
      poolAddress: '<String>',
      riskScore: 0,
      paused: false,
      createdAt: 1700000000000,
    },
    Company: { id: '<ID>', name: '<String>', description: '<String>', ownerId: '<String>', createdAt: 1700000000000 },
    CompanyWithDetails: { id: '<ID>', name: '<String>', description: '<String>', ownerId: '<String>', users: [], createdAt: 1700000000000 },
    Document: { id: '<ID>', name: '<String>', fileId: '<String>', url: '<String>', mimeType: '<String>', size: 0, createdAt: 1700000000000 },
    Folder: { id: '<ID>', name: '<String>', parentId: '<String>', createdAt: 1700000000000 },
    Gallery: { id: '<ID>', name: '<String>', parentId: '<String>', createdAt: 1700000000000 },
    Image: { id: '<ID>', name: '<String>', url: '<String>', mimeType: '<String>', size: 0, createdAt: 1700000000000 },
    Blog: { id: '<ID>', name: '<String>', ownerId: '<String>', createdAt: 1700000000000 },
    Post: { id: '<ID>', title: '<String>', content: '<String>', images: [], documents: [], createdAt: 1700000000000 },
    FaqTopic: { id: '<ID>', name: '<String>', createdAt: 1700000000000 },
    FaqAnswer: { id: '<ID>', question: '<String>', answer: '<String>', order: 0, createdAt: 1700000000000 },
    Topic: { id: '<ID>', name: '<String>', createdAt: 1700000000000 },
    Question: { id: '<ID>', text: '<String>', answered: false, likesCount: 0, createdAt: 1700000000000 },
    Reaction: { id: '<ID>', parentId: '<String>', parentType: '<String>', reaction: 'like', createdAt: 1700000000000 },
    EntityReactionsResponse: { reactions: { like: 0 }, userReactions: [] },
    PriceData: { id: '<String>', poolAddress: '<String>', timestamp: 1700000000000, price: '<String>' },
    OhlcData: { timestamp: 1700000000000, open: '<String>', high: '<String>', low: '<String>', close: '<String>' },
    VolumeData: { timestamp: 1700000000000, mintVolume: '<String>', burnVolume: '<String>' },
    PoolTransaction: { id: '<String>', transactionType: 'MINT', userAddress: '<String>', timestamp: 1700000000000, rwaAmount: '<String>' },
    TokenBalance: { id: '<String>', tokenAddress: '<String>', balance: 0, lastUpdateBlock: 0 },
    Transaction: { id: '<String>', from: '<String>', to: '<String>', transactionHash: '<String>', amount: 0, createdAt: 1700000000000 },
    Staking: { id: '<ID>', staker: '<String>', amount: '<String>', lastStakeTimestamp: 1700000000000, chainId: '<String>' },
    Proposal: { id: '<ID>', proposalId: '<String>', proposer: '<String>', description: '<String>', state: 'active', startTime: 1700000000000, endTime: 1700000000000 },
    Vote: { id: '<ID>', proposalId: '<String>', voterWallet: '<String>', support: true, weight: '<String>' },
    StakingHistory: { id: '<ID>', staker: '<String>', amount: '<String>', operation: '<String>', chainId: '<String>' },
    TimelockTask: { id: '<ID>', txHash: '<String>', target: '<String>', eta: 1700000000000, executed: false },
    TreasuryWithdraw: { id: '<ID>', recipient: '<String>', token: '<String>', amount: '<String>' },
    Fees: { id: '<ID>', userWallet: '<String>', buyCommissionAmount: '<String>', sellCommissionAmount: '<String>' },
    Referral: { id: '<ID>', userWallet: '<String>', referrerWallet: '<String>' },
    ReferrerWithdraw: { id: '<ID>', referrerWallet: '<String>', totalWithdrawnAmount: '<String>', taskId: '<String>' },
    ReferrerClaimHistory: { id: '<ID>', referralWallet: '<String>', amount: '<String>', transactionHash: '<String>' },
    Assistant: { id: '<ID>', name: '<String>', contextPreferences: ['investor_base'] },
    Message: { id: '<ID>', assistantId: '<ID>', text: '<String>' },
    IdResponse: { id: '<ID>' },
    Evaluation: { id: '<ID>', entityType: 'business', status: 'completed', riskScore: 0, reasoning: '<String>' },
    FaucetRequest: { id: '<ID>', tokenType: 'gas', amount: 0, transactionHash: '<String>' },
    UnlockTimeResponse: { gasUnlockTime: 0, holdUnlockTime: 0, platformUnlockTime: 0 },
    SignatureTask: { id: '<ID>', hash: '<String>', requiredSignatures: 1, expired: 0, completed: false, signatures: [] },
    AuthTokens: { userId: '<String>', wallet: '<String>', accessToken: '<String>', refreshToken: '<String>' },
    RefreshToken: { tokenId: '<String>', userId: '<String>', expiresAt: 0, createdAt: 0 },
    RevokeTokensResult: { revokedCount: 1 },
    Member: { id: '<ID>', userId: '<String>', name: '<String>', createdAt: 1700000000000 },
    Permission: { id: '<ID>', permission: '<String>', entity: '<String>', createdAt: 1700000000000 },
    ApprovalSignaturesResponse: { taskId: '<String>' },
    PriceUpdateEvent: { poolAddress: '<String>', timestamp: 1700000000000, price: '<String>' },
    TransactionEvent: { poolAddress: '<String>', timestamp: 1700000000000, transactionType: 'MINT', userAddress: '<String>' },
    ApiKey: { id: '<ID>', name: '<String>', prefix: '<String>', userId: '<String>', wallet: '<String>', createdAt: 1700000000, updatedAt: 1700000000 },
    CreateApiKeyResult: { id: '<ID>', name: '<String>', prefix: '<String>', key: '<String>', createdAt: 1700000000 },
    WebhookEndpoint: { id: '<ID>', url: '<String>', events: ['pool.created'], description: '<String>', active: true, rateLimitPerMinute: 60, createdAt: '<String>' },
    CreateWebhookEndpointResult: { id: '<ID>', url: '<String>', events: ['pool.created'], description: '<String>', active: true, rateLimitPerMinute: 60, secret: '<String>', createdAt: '<String>' },
  };

  return examples[typeName] ?? { id: '<ID>' };
}

// ── Generate cURL example for REST ──

function generateCurlExample(op: ApiOperation): string {
  if (op.type !== 'REST' || !op.path) return '';

  const headerLines = (op.headers ?? []).map((h) =>
    `  --header '${h.name}: ${h.name === 'Authorization' ? 'Bearer <token>' : h.description ?? '<value>'}'`,
  );

  // Build form data
  const formFields = op.params
    .filter((p) => p.type !== 'File')
    .map((p) => `  --form '${p.name}=<value>'`)
    .join('\n');

  const fileField = op.params.find((p) => p.type === 'File');
  const fileLine = fileField ? `  --form '${fileField.name}=@/path/to/file'` : '';

  const allLines = [
    `curl --request ${op.method ?? 'POST'} \\`,
    `  --url 'https://api.slices.com${op.path}' \\`,
    ...headerLines.map((h) => h + ' \\'),
  ];

  const formData = [fileLine, formFields].filter(Boolean).join('\\\n');
  if (formData) {
    allLines.push(formData);
  } else {
    // Remove trailing backslash from last header
    allLines[allLines.length - 1] = allLines[allLines.length - 1].replace(/ \\$/, '');
  }

  return allLines.join('\n');
}

// ── Generate REST JSON response ──

function generateRestJsonResponse(op: ApiOperation): string {
  // If returnType is a structured object string, try to parse it
  if (op.returnType.startsWith('{')) {
    // It's a literal object type — build example from it
    const example: Record<string, unknown> = {};
    const fieldRegex = /(\w+):\s*(\w+)(!?)/g;
    let m;
    while ((m = fieldRegex.exec(op.returnType)) !== null) {
      const [, fieldName, fieldType] = m;
      example[fieldName] = getExampleForType(fieldType);
    }
    return JSON.stringify(example, null, 2);
  }

  return JSON.stringify(
    {
      id: '<ID>',
      url: '<String>',
      mimeType: '<String>',
      size: 0,
      createdAt: 1700000000000,
    },
    null,
    2,
  );
}

function getExampleForType(typeName: string): unknown {
  if (typeName === 'String') return '<String>';
  if (typeName === 'Float' || typeName === 'Int') return 0;
  if (typeName === 'Boolean') return false;
  return null;
}

// ── Public API ──

export function generateRequestExample(op: ApiOperation): { code: string; language: 'graphql' | 'bash' } {
  if (op.type === 'REST') {
    return { code: generateCurlExample(op), language: 'bash' };
  }
  return { code: generateGraphqlExample(op), language: 'graphql' };
}

export function generateResponseExample(op: ApiOperation): { code: string; language: 'json' } {
  if (op.type === 'REST') {
    return { code: generateRestJsonResponse(op), language: 'json' };
  }
  return { code: generateJsonResponse(op), language: 'json' };
}

export function getEndpointDisplay(op: ApiOperation): { method: string; path: string } {
  if (op.type === 'REST' && op.path) {
    return { method: op.method ?? 'POST', path: op.path };
  }
  return { method: op.type.toUpperCase(), path: '/graphql' };
}