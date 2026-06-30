// ═══════════════════════════════════════════════════════════════
// API Data Registry — auto-generated from gateway GraphQL schemas
// All GraphQL operations + REST endpoints in one typed source.
// ═══════════════════════════════════════════════════════════════

export type ApiOperationType = 'Query' | 'Mutation' | 'Subscription' | 'REST';

export interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description?: string;
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
export const apiModuleMeta: Record<string, { label: string; icon: string }> = {
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

// ── Subgroup display labels ──
export const apiSubgroupLabels: Record<string, string> = {
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

// ── All operations ──
export const apiOperations: ApiOperation[] = [
  // ═══════ AI Assistant ═══════
  {
    module: 'ai-assistant',
    subgroup: 'assistants',
    name: 'getAssistant',
    type: 'Query',
    description: 'Retrieve a single AI assistant by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Assistant! { id: ID!, userId: String!, name: String!, contextPreferences: [AssistantContext!]! }',
    endpoint: '/graphql',
  },
  {
    module: 'ai-assistant',
    subgroup: 'assistants',
    name: 'getUserAssistants',
    type: 'Query',
    description: 'Retrieve all assistants for the authenticated user',
    params: [
      { name: 'pagination', type: 'PaginationInput', required: false, description: 'Pagination settings (limit, offset, sort)' },
    ],
    returnType: '[Assistant!]! [{ id: ID!, userId: String!, name: String!, contextPreferences: [AssistantContext!]! }]',
    endpoint: '/graphql',
  },
  {
    module: 'ai-assistant',
    subgroup: 'messages',
    name: 'getMessage',
    type: 'Query',
    description: 'Retrieve a single message by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Message! { id: ID!, assistantId: ID!, text: String! }',
    endpoint: '/graphql',
  },
  {
    module: 'ai-assistant',
    subgroup: 'messages',
    name: 'getMessageHistory',
    type: 'Query',
    description: 'Retrieve message history for an assistant',
    params: [
      { name: 'assistantId', type: 'ID!', required: true, description: 'Assistant ID' },
      { name: 'pagination', type: 'PaginationInput', required: false, description: 'Pagination settings (limit, offset, sort)' },
    ],
    returnType: '[Message!]! [{ id: ID!, assistantId: ID!, text: String! }]',
    endpoint: '/graphql',
  },
  {
    module: 'ai-assistant',
    subgroup: 'assistants',
    name: 'createAssistant',
    type: 'Mutation',
    description: 'Create a new AI assistant',
    params: [
      { name: 'input', type: 'CreateAssistantInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Assistant! { id: ID!, userId: String!, name: String!, contextPreferences: [AssistantContext!]! }',
    endpoint: '/graphql',
  },
  {
    module: 'ai-assistant',
    subgroup: 'assistants',
    name: 'updateAssistant',
    type: 'Mutation',
    description: 'Update an existing AI assistant',
    params: [
      { name: 'input', type: 'UpdateAssistantInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Assistant! { id: ID!, userId: String!, name: String!, contextPreferences: [AssistantContext!]! }',
    endpoint: '/graphql',
  },
  {
    module: 'ai-assistant',
    subgroup: 'assistants',
    name: 'deleteAssistant',
    type: 'Mutation',
    description: 'Delete an AI assistant by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'IdResponse! { id: ID! }',
    endpoint: '/graphql',
  },
  {
    module: 'ai-assistant',
    subgroup: 'messages',
    name: 'createMessage',
    type: 'Mutation',
    description: 'Send a message to an AI assistant and get a response',
    params: [
      { name: 'input', type: 'CreateMessageInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: '[Message!]! [{ id: ID!, assistantId: ID!, text: String! }]',
    endpoint: '/graphql',
  },
  {
    module: 'ai-assistant',
    subgroup: 'messages',
    name: 'updateMessage',
    type: 'Mutation',
    description: 'Update an existing message',
    params: [
      { name: 'input', type: 'UpdateMessageInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Message! { id: ID!, assistantId: ID!, text: String! }',
    endpoint: '/graphql',
  },
  {
    module: 'ai-assistant',
    subgroup: 'messages',
    name: 'deleteMessage',
    type: 'Mutation',
    description: 'Delete a message by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'IdResponse! { id: ID! }',
    endpoint: '/graphql',
  },

  // ═══════ AI Evaluator ═══════
  {
    module: 'ai-evaluator',
    subgroup: 'ai-evaluator',
    name: 'getEvaluation',
    type: 'Query',
    description: 'Retrieve a single AI evaluation by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Evaluation! { id: ID!, entityType: EvaluationEntityType!, parentId: String!, grandParentId: String!, ownerId: String!, ownerType: String!, status: String!, riskScore: Int, reasoning: String, factors: [EvaluationFactor!]!, stage1Response: String, stage2Response: String, evaluatedDocuments: [EvaluationDocumentRef!]!, evaluatedImages: [EvaluationImageRef!]!, modelUsed: String, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'ai-evaluator',
    subgroup: 'ai-evaluator',
    name: 'getEvaluations',
    type: 'Query',
    description: 'Retrieve AI evaluations with filtering and pagination',
    params: [
      { name: 'input', type: 'GetEvaluationsInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Evaluation!]! [{ id: ID!, entityType: EvaluationEntityType!, parentId: String!, grandParentId: String!, ownerId: String!, ownerType: String!, status: String!, riskScore: Int, reasoning: String, factors: [EvaluationFactor!]!, stage1Response: String, stage2Response: String, evaluatedDocuments: [EvaluationDocumentRef!]!, evaluatedImages: [EvaluationImageRef!]!, modelUsed: String, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },

  // ═══════ Auth ═══════
  {
    module: 'auth',
    subgroup: 'auth',
    name: 'getUserTokens',
    type: 'Query',
    description: 'Retrieve all refresh tokens for the authenticated user',
    params: [],
    returnType: '[RefreshToken!]! [{ tokenId: String!, userId: String!, tokenHash: String!, expiresAt: Int!, createdAt: Int!, updatedAt: Int! }]',
    endpoint: '/graphql',
  },
  {
    module: 'auth',
    subgroup: 'auth',
    name: 'authenticate',
    type: 'Mutation',
    description: 'Authenticate with a wallet signature to obtain access and refresh tokens',
    params: [
      { name: 'input', type: 'AuthenticateInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'AuthTokens! { userId: String!, wallet: String!, accessToken: String!, refreshToken: String! }',
    endpoint: '/graphql',
  },
  {
    module: 'auth',
    subgroup: 'auth',
    name: 'refreshToken',
    type: 'Mutation',
    description: 'Exchange a refresh token for a new pair of access and refresh tokens',
    params: [
      { name: 'input', type: 'RefreshTokenInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'AuthTokens! { userId: String!, wallet: String!, accessToken: String!, refreshToken: String! }',
    endpoint: '/graphql',
  },
  {
    module: 'auth',
    subgroup: 'auth',
    name: 'revokeTokens',
    type: 'Mutation',
    description: 'Revoke one or more refresh tokens',
    params: [
      { name: 'input', type: 'RevokeTokensInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'RevokeTokensResult! { revokedCount: Int! }',
    endpoint: '/graphql',
  },

  // ═══════ Blog ═══════
  {
    module: 'blog',
    subgroup: 'blogs',
    name: 'getBlog',
    type: 'Query',
    description: 'Retrieve a single blog by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Blog! { id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'blog',
    subgroup: 'blogs',
    name: 'getBlogs',
    type: 'Query',
    description: 'Retrieve a list of blogs with filtering and pagination',
    params: [
      { name: 'input', type: 'GetBlogsFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Blog!]! [{ id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'blog',
    subgroup: 'posts',
    name: 'getPost',
    type: 'Query',
    description: 'Retrieve a single post by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Post! { id: ID!, blogId: String!, title: String!, content: String!, images: [String!]!, documents: [String!]!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'blog',
    subgroup: 'posts',
    name: 'getPosts',
    type: 'Query',
    description: 'Retrieve a list of posts with filtering and pagination',
    params: [
      { name: 'input', type: 'GetPostsFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Post!]! [{ id: ID!, blogId: String!, title: String!, content: String!, images: [String!]!, documents: [String!]!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'blog',
    subgroup: 'blogs',
    name: 'createBlog',
    type: 'Mutation',
    description: 'Create a new blog',
    params: [
      { name: 'input', type: 'CreateBlogInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Blog! { id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'blog',
    subgroup: 'blogs',
    name: 'updateBlog',
    type: 'Mutation',
    description: 'Update an existing blog',
    params: [
      { name: 'input', type: 'UpdateBlogInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Blog! { id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'blog',
    subgroup: 'blogs',
    name: 'deleteBlog',
    type: 'Mutation',
    description: 'Delete a blog by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },
  {
    module: 'blog',
    subgroup: 'posts',
    name: 'createPost',
    type: 'Mutation',
    description: 'Create a new post in a blog',
    params: [
      { name: 'input', type: 'CreatePostInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Post! { id: ID!, blogId: String!, title: String!, content: String!, images: [String!]!, documents: [String!]!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'blog',
    subgroup: 'posts',
    name: 'updatePost',
    type: 'Mutation',
    description: 'Update an existing post',
    params: [
      { name: 'input', type: 'UpdatePostInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Post! { id: ID!, blogId: String!, title: String!, content: String!, images: [String!]!, documents: [String!]!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'blog',
    subgroup: 'posts',
    name: 'deletePost',
    type: 'Mutation',
    description: 'Delete a post by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },

  // ═══════ Charts ═══════
  {
    module: 'charts',
    subgroup: 'charts',
    name: 'getRawPriceData',
    type: 'Query',
    description: 'Retrieve raw price data for a pool within a time range',
    params: [
      { name: 'input', type: 'GetRawPriceDataInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: '[PriceData!]! [{ id: String!, poolAddress: String!, timestamp: Float!, blockNumber: Float!, realHoldReserve: String!, virtualHoldReserve: String!, virtualRwaReserve: String!, price: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'charts',
    subgroup: 'charts',
    name: 'getOhlcPriceData',
    type: 'Query',
    description: 'Retrieve OHLC (candlestick) price data for a pool',
    params: [
      { name: 'input', type: 'GetOhlcPriceDataInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: '[OhlcData!]! [{ timestamp: Float!, open: String!, high: String!, low: String!, close: String! }]',
    endpoint: '/graphql',
  },
  {
    module: 'charts',
    subgroup: 'charts',
    name: 'getPoolTransactions',
    type: 'Query',
    description: 'Retrieve transaction history for a pool',
    params: [
      { name: 'input', type: 'GetPoolTransactionsInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: '[PoolTransaction!]! [{ id: String!, poolAddress: String!, transactionType: String!, userAddress: String!, timestamp: Float!, rwaAmount: String!, holdAmount: String!, bonusAmount: String!, holdFee: String!, bonusFee: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'charts',
    subgroup: 'charts',
    name: 'getVolumeData',
    type: 'Query',
    description: 'Retrieve volume data for a pool within a time range',
    params: [
      { name: 'input', type: 'GetVolumeDataInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: '[VolumeData!]! [{ timestamp: Float!, mintVolume: String!, burnVolume: String! }]',
    endpoint: '/graphql',
  },
  {
    module: 'charts',
    subgroup: 'charts',
    name: 'priceUpdates',
    type: 'Subscription',
    description: 'Subscribe to real-time price update events for a pool',
    params: [
      { name: 'poolAddress', type: 'String!', required: true, description: 'Pool contract address' },
    ],
    returnType: 'PriceUpdateEvent! { poolAddress: String!, timestamp: Float!, price: String!, realHoldReserve: String!, virtualHoldReserve: String!, virtualRwaReserve: String! }',
    endpoint: '/graphql',
  },
  {
    module: 'charts',
    subgroup: 'charts',
    name: 'transactionUpdates',
    type: 'Subscription',
    description: 'Subscribe to real-time transaction events for a pool',
    params: [
      { name: 'poolAddress', type: 'String!', required: true, description: 'Pool contract address' },
    ],
    returnType: 'TransactionEvent! { poolAddress: String!, timestamp: Float!, transactionType: String!, userAddress: String!, rwaAmount: String!, holdAmount: String!, bonusAmount: String, holdFee: String!, bonusFee: String }',
    endpoint: '/graphql',
  },

  // ═══════ Company ═══════
  {
    module: 'company',
    subgroup: 'company',
    name: 'getCompany',
    type: 'Query',
    description: 'Retrieve a company with its members and permissions',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'CompanyWithDetails! { id: ID!, name: String!, description: String!, ownerId: String!, country: String, socials: [SocialLink!]!, users: [UserWithPermissions!]!, createdAt: Int!, updatedAt: Int! }',
    endpoint: '/graphql',
  },
  {
    module: 'company',
    subgroup: 'company',
    name: 'getCompanies',
    type: 'Query',
    description: 'Retrieve a list of companies with filtering and pagination',
    params: [
      { name: 'input', type: 'GetCompaniesInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Company!]! [{ id: ID!, name: String!, description: String!, ownerId: String!, country: String, socials: [SocialLink!]!, createdAt: Int!, updatedAt: Int! }]',
    endpoint: '/graphql',
  },
  {
    module: 'company',
    subgroup: 'company',
    name: 'createCompany',
    type: 'Mutation',
    description: 'Create a new company',
    params: [
      { name: 'input', type: 'CreateCompanyInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Company! { id: ID!, name: String!, description: String!, ownerId: String!, country: String, socials: [SocialLink!]!, createdAt: Int!, updatedAt: Int! }',
    endpoint: '/graphql',
  },
  {
    module: 'company',
    subgroup: 'company',
    name: 'updateCompany',
    type: 'Mutation',
    description: 'Update an existing company',
    params: [
      { name: 'input', type: 'UpdateCompanyInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Company! { id: ID!, name: String!, description: String!, ownerId: String!, country: String, socials: [SocialLink!]!, createdAt: Int!, updatedAt: Int! }',
    endpoint: '/graphql',
  },
  {
    module: 'company',
    subgroup: 'company',
    name: 'deleteCompany',
    type: 'Mutation',
    description: 'Delete a company by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },
  {
    module: 'company',
    subgroup: 'members',
    name: 'addMember',
    type: 'Mutation',
    description: 'Add a member to a company',
    params: [
      { name: 'input', type: 'AddMemberInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Member! { id: ID!, userId: String!, name: String!, createdAt: Int!, updatedAt: Int! }',
    endpoint: '/graphql',
  },
  {
    module: 'company',
    subgroup: 'members',
    name: 'removeMember',
    type: 'Mutation',
    description: 'Remove a member from a company',
    params: [
      { name: 'input', type: 'RemoveMemberInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },
  {
    module: 'company',
    subgroup: 'permissions',
    name: 'grantPermission',
    type: 'Mutation',
    description: 'Grant a permission to a company member',
    params: [
      { name: 'input', type: 'GrantPermissionInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Permission! { id: ID!, permission: String!, entity: String, createdAt: Int!, updatedAt: Int! }',
    endpoint: '/graphql',
  },
  {
    module: 'company',
    subgroup: 'permissions',
    name: 'revokePermission',
    type: 'Mutation',
    description: 'Revoke a permission from a company member',
    params: [
      { name: 'input', type: 'RevokePermissionInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },

  // ═══════ DAO ═══════
  {
    module: 'dao',
    subgroup: 'dao',
    name: 'getStaking',
    type: 'Query',
    description: 'Retrieve staking records with filtering and pagination',
    params: [
      { name: 'input', type: 'GetStakingFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Staking!]! [{ id: ID!, staker: String!, amount: String!, lastStakeTimestamp: Float!, chainId: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'dao',
    subgroup: 'dao',
    name: 'getProposals',
    type: 'Query',
    description: 'Retrieve governance proposals with filtering and pagination',
    params: [
      { name: 'input', type: 'GetProposalsFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Proposal!]! [{ id: ID!, proposalId: String!, proposer: String!, target: String!, data: String!, description: String!, startTime: Float!, endTime: Float!, state: String!, chainId: String!, transactionHash: String!, logIndex: Float!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'dao',
    subgroup: 'dao',
    name: 'getVotes',
    type: 'Query',
    description: 'Retrieve governance votes with filtering and pagination',
    params: [
      { name: 'input', type: 'GetVotesFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Vote!]! [{ id: ID!, proposalId: String!, chainId: String!, governanceAddress: String!, voterWallet: String!, support: Boolean!, weight: String!, reason: String!, transactionHash: String!, logIndex: Float!, blockNumber: Float!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'dao',
    subgroup: 'dao',
    name: 'getStakingHistory',
    type: 'Query',
    description: 'Retrieve staking history records with filtering and pagination',
    params: [
      { name: 'input', type: 'GetStakingHistoryFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[StakingHistory!]! [{ id: ID!, staker: String!, amount: String!, operation: String!, chainId: String!, transactionHash: String!, logIndex: Float!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'dao',
    subgroup: 'dao',
    name: 'getTimelockTasks',
    type: 'Query',
    description: 'Retrieve timelock tasks with filtering and pagination',
    params: [
      { name: 'input', type: 'GetTimelockTasksFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[TimelockTask!]! [{ id: ID!, txHash: String!, target: String!, data: String!, eta: Float!, executed: Boolean!, chainId: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'dao',
    subgroup: 'dao',
    name: 'getTreasuryWithdraws',
    type: 'Query',
    description: 'Retrieve treasury withdrawal records with filtering and pagination',
    params: [
      { name: 'input', type: 'GetTreasuryWithdrawsFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[TreasuryWithdraw!]! [{ id: ID!, recipient: String!, token: String!, amount: String!, chainId: String!, transactionHash: String!, logIndex: Float!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },

  // ═══════ Documents ═══════
  {
    module: 'documents',
    subgroup: 'documents',
    name: 'getDocument',
    type: 'Query',
    description: 'Retrieve a single document by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Document! { id: ID!, folderId: String!, name: String!, fileId: String!, path: String!, url: String!, mimeType: String!, size: Float!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'documents',
    subgroup: 'documents',
    name: 'getDocuments',
    type: 'Query',
    description: 'Retrieve a list of documents with filtering and pagination',
    params: [
      { name: 'input', type: 'GetDocumentsFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Document!]! [{ id: ID!, folderId: String!, name: String!, fileId: String!, path: String!, url: String!, mimeType: String!, size: Float!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'documents',
    subgroup: 'folders',
    name: 'getFolder',
    type: 'Query',
    description: 'Retrieve a single folder by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Folder! { id: ID!, name: String!, parentId: String!, ownerId: String!, ownerType: String!, creator: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'documents',
    subgroup: 'folders',
    name: 'getFolders',
    type: 'Query',
    description: 'Retrieve a list of folders with filtering and pagination',
    params: [
      { name: 'input', type: 'GetFoldersFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Folder!]! [{ id: ID!, name: String!, parentId: String!, ownerId: String!, ownerType: String!, creator: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'documents',
    subgroup: 'documents',
    name: 'createDocument',
    type: 'Mutation',
    description: 'Create a new document (GraphQL Upload scalar)',
    params: [
      { name: 'input', type: 'CreateDocumentInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Document! { id: ID!, folderId: String!, name: String!, fileId: String!, path: String!, url: String!, mimeType: String!, size: Float!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'documents',
    subgroup: 'documents',
    name: 'updateDocument',
    type: 'Mutation',
    description: 'Update an existing document',
    params: [
      { name: 'input', type: 'UpdateDocumentInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Document! { id: ID!, folderId: String!, name: String!, fileId: String!, path: String!, url: String!, mimeType: String!, size: Float!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'documents',
    subgroup: 'documents',
    name: 'deleteDocument',
    type: 'Mutation',
    description: 'Delete a document by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },
  {
    module: 'documents',
    subgroup: 'folders',
    name: 'createFolder',
    type: 'Mutation',
    description: 'Create a new folder',
    params: [
      { name: 'input', type: 'CreateFolderInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Folder! { id: ID!, name: String!, parentId: String!, ownerId: String!, ownerType: String!, creator: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'documents',
    subgroup: 'folders',
    name: 'updateFolder',
    type: 'Mutation',
    description: 'Update an existing folder',
    params: [
      { name: 'input', type: 'UpdateFolderInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Folder! { id: ID!, name: String!, parentId: String!, ownerId: String!, ownerType: String!, creator: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'documents',
    subgroup: 'folders',
    name: 'deleteFolder',
    type: 'Mutation',
    description: 'Delete a folder by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },

  // ═══════ FAQ ═══════
  {
    module: 'faq',
    subgroup: 'topics',
    name: 'getFaqTopic',
    type: 'Query',
    description: 'Retrieve a single FAQ topic by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'FaqTopic! { id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'faq',
    subgroup: 'topics',
    name: 'getFaqTopics',
    type: 'Query',
    description: 'Retrieve a list of FAQ topics with filtering and pagination',
    params: [
      { name: 'input', type: 'GetFaqTopicsFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[FaqTopic!]! [{ id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'faq',
    subgroup: 'answers',
    name: 'getFaqAnswer',
    type: 'Query',
    description: 'Retrieve a single FAQ answer by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'FaqAnswer! { id: ID!, topicId: String!, question: String!, answer: String!, order: Int!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'faq',
    subgroup: 'answers',
    name: 'getFaqAnswers',
    type: 'Query',
    description: 'Retrieve a list of FAQ answers with filtering and pagination',
    params: [
      { name: 'input', type: 'GetFaqAnswersFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[FaqAnswer!]! [{ id: ID!, topicId: String!, question: String!, answer: String!, order: Int!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'faq',
    subgroup: 'topics',
    name: 'createFaqTopic',
    type: 'Mutation',
    description: 'Create a new FAQ topic',
    params: [
      { name: 'input', type: 'CreateFaqTopicInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'FaqTopic! { id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'faq',
    subgroup: 'topics',
    name: 'updateFaqTopic',
    type: 'Mutation',
    description: 'Update an existing FAQ topic',
    params: [
      { name: 'input', type: 'UpdateFaqTopicInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'FaqTopic! { id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'faq',
    subgroup: 'topics',
    name: 'deleteFaqTopic',
    type: 'Mutation',
    description: 'Delete a FAQ topic by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },
  {
    module: 'faq',
    subgroup: 'answers',
    name: 'createFaqAnswer',
    type: 'Mutation',
    description: 'Create a new FAQ answer',
    params: [
      { name: 'input', type: 'CreateFaqAnswerInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'FaqAnswer! { id: ID!, topicId: String!, question: String!, answer: String!, order: Int!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'faq',
    subgroup: 'answers',
    name: 'updateFaqAnswer',
    type: 'Mutation',
    description: 'Update an existing FAQ answer',
    params: [
      { name: 'input', type: 'UpdateFaqAnswerInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'FaqAnswer! { id: ID!, topicId: String!, question: String!, answer: String!, order: Int!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'faq',
    subgroup: 'answers',
    name: 'deleteFaqAnswer',
    type: 'Mutation',
    description: 'Delete a FAQ answer by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },

  // ═══════ Gallery ═══════
  {
    module: 'gallery',
    subgroup: 'galleries',
    name: 'getGallery',
    type: 'Query',
    description: 'Retrieve a single gallery by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Gallery! { id: ID!, name: String!, parentId: String!, ownerId: String!, ownerType: String!, creator: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'gallery',
    subgroup: 'galleries',
    name: 'getGalleries',
    type: 'Query',
    description: 'Retrieve a list of galleries with filtering and pagination',
    params: [
      { name: 'input', type: 'GetGalleriesFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Gallery!]! [{ id: ID!, name: String!, parentId: String!, ownerId: String!, ownerType: String!, creator: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'gallery',
    subgroup: 'images',
    name: 'getImage',
    type: 'Query',
    description: 'Retrieve a single image by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Image! { id: ID!, galleryId: String!, name: String!, description: String!, fileId: String!, path: String!, url: String!, mimeType: String!, size: Float!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'gallery',
    subgroup: 'images',
    name: 'getImages',
    type: 'Query',
    description: 'Retrieve a list of images with filtering and pagination',
    params: [
      { name: 'input', type: 'GetImagesFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Image!]! [{ id: ID!, galleryId: String!, name: String!, description: String!, fileId: String!, path: String!, url: String!, mimeType: String!, size: Float!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'gallery',
    subgroup: 'galleries',
    name: 'createGallery',
    type: 'Mutation',
    description: 'Create a new gallery',
    params: [
      { name: 'input', type: 'CreateGalleryInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Gallery! { id: ID!, name: String!, parentId: String!, ownerId: String!, ownerType: String!, creator: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'gallery',
    subgroup: 'galleries',
    name: 'updateGallery',
    type: 'Mutation',
    description: 'Update an existing gallery',
    params: [
      { name: 'input', type: 'UpdateGalleryInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Gallery! { id: ID!, name: String!, parentId: String!, ownerId: String!, ownerType: String!, creator: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'gallery',
    subgroup: 'galleries',
    name: 'deleteGallery',
    type: 'Mutation',
    description: 'Delete a gallery by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },
  {
    module: 'gallery',
    subgroup: 'images',
    name: 'createImage',
    type: 'Mutation',
    description: 'Create a new image in a gallery (GraphQL Upload scalar)',
    params: [
      { name: 'input', type: 'CreateImageInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Image! { id: ID!, galleryId: String!, name: String!, description: String!, fileId: String!, path: String!, url: String!, mimeType: String!, size: Float!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'gallery',
    subgroup: 'images',
    name: 'updateImage',
    type: 'Mutation',
    description: 'Update an existing image',
    params: [
      { name: 'input', type: 'UpdateImageInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Image! { id: ID!, galleryId: String!, name: String!, description: String!, fileId: String!, path: String!, url: String!, mimeType: String!, size: Float!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'gallery',
    subgroup: 'images',
    name: 'deleteImage',
    type: 'Mutation',
    description: 'Delete an image by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },

  // ═══════ Loyalty ═══════
  {
    module: 'loyalty',
    subgroup: 'loyalty',
    name: 'getFees',
    type: 'Query',
    description: 'Retrieve fee records with filtering and pagination',
    params: [
      { name: 'input', type: 'GetFeesFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Fees!]! [{ id: ID!, userWallet: String!, userId: String!, chainId: String!, tokenAddress: String!, buyCommissionAmount: String!, sellCommissionAmount: String!, tokenCreationCommissionAmount: String!, poolCreationCommissionAmount: String!, referralRewardAmount: String!, buyCommissionCount: Int!, sellCommissionCount: Int!, tokenCreationCommissionCount: Int!, poolCreationCommissionCount: Int!, referralRewardCount: Int!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'loyalty',
    subgroup: 'loyalty',
    name: 'getReferrals',
    type: 'Query',
    description: 'Retrieve referral records with filtering and pagination',
    params: [
      { name: 'input', type: 'GetReferralsFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Referral!]! [{ id: ID!, userWallet: String!, userId: String!, referrerWallet: String, referrerId: String, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'loyalty',
    subgroup: 'loyalty',
    name: 'getReferrerWithdraws',
    type: 'Query',
    description: 'Retrieve referrer withdrawal records with filtering and pagination',
    params: [
      { name: 'input', type: 'GetReferrerWithdrawsFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[ReferrerWithdraw!]! [{ id: ID!, referrerWallet: String!, referrerId: String!, chainId: String!, tokenAddress: String!, totalWithdrawnAmount: String!, taskId: String, taskExpiredAt: Float, taskCooldown: Float, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'loyalty',
    subgroup: 'loyalty',
    name: 'getReferrerClaimHistory',
    type: 'Query',
    description: 'Retrieve referrer claim history with filtering and pagination',
    params: [
      { name: 'input', type: 'GetReferrerClaimHistoryFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[ReferrerClaimHistory!]! [{ id: ID!, referrerWallet: String!, referrerId: String!, referralWallet: String!, chainId: String!, tokenAddress: String!, amount: String!, transactionHash: String!, logIndex: Int!, blockNumber: Int!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'loyalty',
    subgroup: 'loyalty',
    name: 'registerReferral',
    type: 'Mutation',
    description: 'Register a new referral under a referrer',
    params: [
      { name: 'input', type: 'RegisterReferralInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Referral! { id: ID!, userWallet: String!, userId: String!, referrerWallet: String, referrerId: String, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'loyalty',
    subgroup: 'loyalty',
    name: 'createReferrerWithdrawTask',
    type: 'Mutation',
    description: 'Create a withdrawal task for referrer rewards',
    params: [
      { name: 'input', type: 'CreateReferrerWithdrawTaskInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'ReferrerWithdraw! { id: ID!, referrerWallet: String!, referrerId: String!, chainId: String!, tokenAddress: String!, totalWithdrawnAmount: String!, taskId: String, taskExpiredAt: Float, taskCooldown: Float, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },

  // ═══════ Portfolio ═══════
  {
    module: 'portfolio',
    subgroup: 'portfolio',
    name: 'getBalances',
    type: 'Query',
    description: 'Retrieve token balances for the authenticated user',
    params: [
      { name: 'input', type: 'GetBalancesInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: '[TokenBalance!]! [{ id: String!, owner: String!, tokenAddress: String!, tokenId: String!, poolAddress: String!, chainId: String!, balance: Int!, lastUpdateBlock: Int!, createdAt: Int!, updatedAt: Int! }]',
    endpoint: '/graphql',
  },
  {
    module: 'portfolio',
    subgroup: 'portfolio',
    name: 'getTransactions',
    type: 'Query',
    description: 'Retrieve transaction history for the authenticated user',
    params: [
      { name: 'input', type: 'GetTransactionsInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: '[Transaction!]! [{ id: String!, from: String!, to: String!, tokenAddress: String!, tokenId: String!, poolAddress: String!, chainId: String!, transactionHash: String!, blockNumber: Int!, amount: Int!, createdAt: Int!, updatedAt: Int! }]',
    endpoint: '/graphql',
  },

  // ═══════ Questions ═══════
  {
    module: 'questions',
    subgroup: 'topics',
    name: 'getTopic',
    type: 'Query',
    description: 'Retrieve a single questions topic by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Topic! { id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'questions',
    subgroup: 'topics',
    name: 'getTopics',
    type: 'Query',
    description: 'Retrieve a list of questions topics with filtering and pagination',
    params: [
      { name: 'input', type: 'GetTopicsFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Topic!]! [{ id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'questions',
    subgroup: 'questions',
    name: 'getQuestion',
    type: 'Query',
    description: 'Retrieve a single question by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Question! { id: ID!, topicId: String!, text: String!, answer: Answer, answered: Boolean!, likesCount: Int!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'questions',
    subgroup: 'questions',
    name: 'getQuestions',
    type: 'Query',
    description: 'Retrieve a list of questions with filtering and pagination',
    params: [
      { name: 'input', type: 'GetQuestionsFilterInput', required: false, description: 'Input object with operation parameters' },
    ],
    returnType: '[Question!]! [{ id: ID!, topicId: String!, text: String!, answer: Answer, answered: Boolean!, likesCount: Int!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'questions',
    subgroup: 'topics',
    name: 'createTopic',
    type: 'Mutation',
    description: 'Create a new questions topic',
    params: [
      { name: 'input', type: 'CreateTopicInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Topic! { id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'questions',
    subgroup: 'topics',
    name: 'updateTopic',
    type: 'Mutation',
    description: 'Update an existing questions topic',
    params: [
      { name: 'input', type: 'UpdateTopicInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Topic! { id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'questions',
    subgroup: 'topics',
    name: 'deleteTopic',
    type: 'Mutation',
    description: 'Delete a questions topic by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },
  {
    module: 'questions',
    subgroup: 'questions',
    name: 'createQuestion',
    type: 'Mutation',
    description: 'Create a new question in a topic',
    params: [
      { name: 'input', type: 'CreateQuestionInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Question! { id: ID!, topicId: String!, text: String!, answer: Answer, answered: Boolean!, likesCount: Int!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'questions',
    subgroup: 'questions',
    name: 'updateQuestionText',
    type: 'Mutation',
    description: 'Update the text of an existing question',
    params: [
      { name: 'input', type: 'UpdateQuestionTextInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Question! { id: ID!, topicId: String!, text: String!, answer: Answer, answered: Boolean!, likesCount: Int!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'questions',
    subgroup: 'questions',
    name: 'createQuestionAnswer',
    type: 'Mutation',
    description: 'Create an answer for a question',
    params: [
      { name: 'input', type: 'CreateQuestionAnswerInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Question! { id: ID!, topicId: String!, text: String!, answer: Answer, answered: Boolean!, likesCount: Int!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'questions',
    subgroup: 'questions',
    name: 'updateQuestionAnswer',
    type: 'Mutation',
    description: 'Update the answer for a question',
    params: [
      { name: 'input', type: 'UpdateQuestionAnswerInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Question! { id: ID!, topicId: String!, text: String!, answer: Answer, answered: Boolean!, likesCount: Int!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'questions',
    subgroup: 'questions',
    name: 'deleteQuestion',
    type: 'Mutation',
    description: 'Delete a question by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },
  {
    module: 'questions',
    subgroup: 'questions',
    name: 'toggleQuestionLike',
    type: 'Mutation',
    description: 'Toggle the like status of a question',
    params: [
      { name: 'questionId', type: 'ID!', required: true, description: 'Question ID' },
    ],
    returnType: 'Boolean!',
    endpoint: '/graphql',
  },

  // ═══════ Reactions ═══════
  {
    module: 'reactions',
    subgroup: 'reactions',
    name: 'getEntityReactions',
    type: 'Query',
    description: 'Retrieve reactions for a specific entity',
    params: [
      { name: 'parentId', type: 'String!', required: true, description: 'Parent entity ID' },
      { name: 'parentType', type: 'String!', required: true, description: 'Parent entity type' },
    ],
    returnType: 'EntityReactionsResponse! { reactions: JSON!, userReactions: [String!]! }',
    endpoint: '/graphql',
  },
  {
    module: 'reactions',
    subgroup: 'reactions',
    name: 'getReactions',
    type: 'Query',
    description: 'Retrieve reactions with filtering and pagination',
    params: [
      { name: 'input', type: 'GetReactionsFilterInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: '[Reaction!]! [{ id: ID!, parentId: String!, parentType: String!, userId: String!, reaction: String!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'reactions',
    subgroup: 'reactions',
    name: 'setReaction',
    type: 'Mutation',
    description: 'Set a reaction on an entity',
    params: [
      { name: 'input', type: 'SetReactionInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Reaction! { id: ID!, parentId: String!, parentType: String!, userId: String!, reaction: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'reactions',
    subgroup: 'reactions',
    name: 'resetReaction',
    type: 'Mutation',
    description: 'Remove a reaction from an entity',
    params: [
      { name: 'input', type: 'SetReactionInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Reaction { id: ID!, parentId: String!, parentType: String!, userId: String!, reaction: String!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },

  // ═══════ RWA ═══════
  {
    module: 'rwa',
    subgroup: 'businesses',
    name: 'getBusiness',
    type: 'Query',
    description: 'Retrieve a single business by its ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Business! { id: ID!, chainId: String!, name: String!, ownerId: String!, ownerType: String!, ownerWallet: String, tokenAddress: String, description: String, tags: [String!], riskScore: Int, image: String, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, country: String, businessType: String, socials: [SocialLink!]!, paused: Boolean!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'businesses',
    name: 'getBusinesses',
    type: 'Query',
    description: 'Retrieve a list of businesses with filtering, sorting, and pagination',
    params: [
      { name: 'input', type: 'FilterInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: '[Business!]! [{ id: ID!, chainId: String!, name: String!, ownerId: String!, ownerType: String!, ownerWallet: String, tokenAddress: String, description: String, tags: [String!], riskScore: Int, image: String, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, country: String, businessType: String, socials: [SocialLink!]!, paused: Boolean!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'pools',
    name: 'getPool',
    type: 'Query',
    description: 'Retrieve a single pool by its ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Pool! { id: ID!, ownerId: String!, ownerType: String!, ownerWallet: String, name: String!, businessId: String!, description: String, chainId: String!, tags: [String!], riskScore: Int, image: String, rwaAddress: String!, poolAddress: String, holdToken: String, tokenId: String, entryFeePercent: String, exitFeePercent: String, expectedHoldAmount: String, expectedRwaAmount: String, expectedBonusAmount: String, rewardPercent: String, priceImpactPercent: String, liquidityCoefficient: String, awaitCompletionExpired: Boolean!, floatingOutTranchesTimestamps: Boolean!, fixedSell: Boolean!, allowEntryBurn: Boolean!, paused: Boolean!, entryPeriodStart: Float, entryPeriodExpired: Float, completionPeriodExpired: Float, floatingTimestampOffset: Float!, fullReturnTimestamp: Float, k: String, realHoldReserve: String, virtualHoldReserve: String, virtualRwaReserve: String, isTargetReached: Boolean!, isFullyReturned: Boolean!, totalClaimedAmount: String, totalReturnedAmount: String, awaitingBonusAmount: String, awaitingRwaAmount: String, outgoingTranchesBalance: String, outgoingTranches: [OutgoingTranche!]!, incomingTranches: [IncomingTranche!]!, lastCompletedIncomingTranche: Int!, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'pools',
    name: 'getPools',
    type: 'Query',
    description: 'Retrieve a list of pools with filtering, sorting, and pagination',
    params: [
      { name: 'input', type: 'FilterInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: '[Pool!]! [{ id: ID!, ownerId: String!, ownerType: String!, ownerWallet: String, name: String!, businessId: String!, description: String, chainId: String!, tags: [String!], riskScore: Int, image: String, rwaAddress: String!, poolAddress: String, holdToken: String, tokenId: String, entryFeePercent: String, exitFeePercent: String, expectedHoldAmount: String, expectedRwaAmount: String, expectedBonusAmount: String, rewardPercent: String, priceImpactPercent: String, liquidityCoefficient: String, awaitCompletionExpired: Boolean!, floatingOutTranchesTimestamps: Boolean!, fixedSell: Boolean!, allowEntryBurn: Boolean!, paused: Boolean!, entryPeriodStart: Float, entryPeriodExpired: Float, completionPeriodExpired: Float, floatingTimestampOffset: Float!, fullReturnTimestamp: Float, k: String, realHoldReserve: String, virtualHoldReserve: String, virtualRwaReserve: String, isTargetReached: Boolean!, isFullyReturned: Boolean!, totalClaimedAmount: String, totalReturnedAmount: String, awaitingBonusAmount: String, awaitingRwaAmount: String, outgoingTranchesBalance: String, outgoingTranches: [OutgoingTranche!]!, incomingTranches: [IncomingTranche!]!, lastCompletedIncomingTranche: Int!, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, createdAt: Float!, updatedAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'businesses',
    name: 'createBusinessWithAI',
    type: 'Mutation',
    description: 'Create a new business using AI-generated content from a description',
    params: [
      { name: 'input', type: 'CreateBusinessWithAIInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Business! { id: ID!, chainId: String!, name: String!, ownerId: String!, ownerType: String!, ownerWallet: String, tokenAddress: String, description: String, tags: [String!], riskScore: Int, image: String, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, country: String, businessType: String, socials: [SocialLink!]!, paused: Boolean!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'businesses',
    name: 'createBusiness',
    type: 'Mutation',
    description: 'Create a new business entity with the provided parameters',
    params: [
      { name: 'input', type: 'CreateBusinessInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Business! { id: ID!, chainId: String!, name: String!, ownerId: String!, ownerType: String!, ownerWallet: String, tokenAddress: String, description: String, tags: [String!], riskScore: Int, image: String, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, country: String, businessType: String, socials: [SocialLink!]!, paused: Boolean!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'businesses',
    name: 'editBusiness',
    type: 'Mutation',
    description: 'Update an existing business entity',
    params: [
      { name: 'input', type: 'EditBusinessInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Business! { id: ID!, chainId: String!, name: String!, ownerId: String!, ownerType: String!, ownerWallet: String, tokenAddress: String, description: String, tags: [String!], riskScore: Int, image: String, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, country: String, businessType: String, socials: [SocialLink!]!, paused: Boolean!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'businesses',
    name: 'updateBusinessRiskScore',
    type: 'Mutation',
    description: 'Trigger an AI risk score evaluation for a business',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Business! { id: ID!, chainId: String!, name: String!, ownerId: String!, ownerType: String!, ownerWallet: String, tokenAddress: String, description: String, tags: [String!], riskScore: Int, image: String, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, country: String, businessType: String, socials: [SocialLink!]!, paused: Boolean!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'businesses',
    name: 'requestBusinessApprovalSignatures',
    type: 'Mutation',
    description: 'Request multi-sig approval signatures for business token deployment',
    params: [
      { name: 'input', type: 'RequestBusinessApprovalSignaturesInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'ApprovalSignaturesResponse! { taskId: String! }',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'businesses',
    name: 'rejectBusinessApprovalSignatures',
    type: 'Mutation',
    description: 'Reject pending approval signatures for a business',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Boolean!',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'pools',
    name: 'createPoolWithAI',
    type: 'Mutation',
    description: 'Create a new pool using AI-generated parameters from a description',
    params: [
      { name: 'input', type: 'CreatePoolWithAIInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Pool! { id: ID!, ownerId: String!, ownerType: String!, ownerWallet: String, name: String!, businessId: String!, description: String, chainId: String!, tags: [String!], riskScore: Int, image: String, rwaAddress: String!, poolAddress: String, holdToken: String, tokenId: String, entryFeePercent: String, exitFeePercent: String, expectedHoldAmount: String, expectedRwaAmount: String, expectedBonusAmount: String, rewardPercent: String, priceImpactPercent: String, liquidityCoefficient: String, awaitCompletionExpired: Boolean!, floatingOutTranchesTimestamps: Boolean!, fixedSell: Boolean!, allowEntryBurn: Boolean!, paused: Boolean!, entryPeriodStart: Float, entryPeriodExpired: Float, completionPeriodExpired: Float, floatingTimestampOffset: Float!, fullReturnTimestamp: Float, k: String, realHoldReserve: String, virtualHoldReserve: String, virtualRwaReserve: String, isTargetReached: Boolean!, isFullyReturned: Boolean!, totalClaimedAmount: String, totalReturnedAmount: String, awaitingBonusAmount: String, awaitingRwaAmount: String, outgoingTranchesBalance: String, outgoingTranches: [OutgoingTranche!]!, incomingTranches: [IncomingTranche!]!, lastCompletedIncomingTranche: Int!, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'pools',
    name: 'createPool',
    type: 'Mutation',
    description: 'Create a new pool associated with a business',
    params: [
      { name: 'input', type: 'CreatePoolInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Pool! { id: ID!, ownerId: String!, ownerType: String!, ownerWallet: String, name: String!, businessId: String!, description: String, chainId: String!, tags: [String!], riskScore: Int, image: String, rwaAddress: String!, poolAddress: String, holdToken: String, tokenId: String, entryFeePercent: String, exitFeePercent: String, expectedHoldAmount: String, expectedRwaAmount: String, expectedBonusAmount: String, rewardPercent: String, priceImpactPercent: String, liquidityCoefficient: String, awaitCompletionExpired: Boolean!, floatingOutTranchesTimestamps: Boolean!, fixedSell: Boolean!, allowEntryBurn: Boolean!, paused: Boolean!, entryPeriodStart: Float, entryPeriodExpired: Float, completionPeriodExpired: Float, floatingTimestampOffset: Float!, fullReturnTimestamp: Float, k: String, realHoldReserve: String, virtualHoldReserve: String, virtualRwaReserve: String, isTargetReached: Boolean!, isFullyReturned: Boolean!, totalClaimedAmount: String, totalReturnedAmount: String, awaitingBonusAmount: String, awaitingRwaAmount: String, outgoingTranchesBalance: String, outgoingTranches: [OutgoingTranche!]!, incomingTranches: [IncomingTranche!]!, lastCompletedIncomingTranche: Int!, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'pools',
    name: 'editPool',
    type: 'Mutation',
    description: 'Update an existing pool configuration',
    params: [
      { name: 'input', type: 'EditPoolInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'Pool! { id: ID!, ownerId: String!, ownerType: String!, ownerWallet: String, name: String!, businessId: String!, description: String, chainId: String!, tags: [String!], riskScore: Int, image: String, rwaAddress: String!, poolAddress: String, holdToken: String, tokenId: String, entryFeePercent: String, exitFeePercent: String, expectedHoldAmount: String, expectedRwaAmount: String, expectedBonusAmount: String, rewardPercent: String, priceImpactPercent: String, liquidityCoefficient: String, awaitCompletionExpired: Boolean!, floatingOutTranchesTimestamps: Boolean!, fixedSell: Boolean!, allowEntryBurn: Boolean!, paused: Boolean!, entryPeriodStart: Float, entryPeriodExpired: Float, completionPeriodExpired: Float, floatingTimestampOffset: Float!, fullReturnTimestamp: Float, k: String, realHoldReserve: String, virtualHoldReserve: String, virtualRwaReserve: String, isTargetReached: Boolean!, isFullyReturned: Boolean!, totalClaimedAmount: String, totalReturnedAmount: String, awaitingBonusAmount: String, awaitingRwaAmount: String, outgoingTranchesBalance: String, outgoingTranches: [OutgoingTranche!]!, incomingTranches: [IncomingTranche!]!, lastCompletedIncomingTranche: Int!, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'pools',
    name: 'updatePoolRiskScore',
    type: 'Mutation',
    description: 'Trigger an AI risk score evaluation for a pool',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Pool! { id: ID!, ownerId: String!, ownerType: String!, ownerWallet: String, name: String!, businessId: String!, description: String, chainId: String!, tags: [String!], riskScore: Int, image: String, rwaAddress: String!, poolAddress: String, holdToken: String, tokenId: String, entryFeePercent: String, exitFeePercent: String, expectedHoldAmount: String, expectedRwaAmount: String, expectedBonusAmount: String, rewardPercent: String, priceImpactPercent: String, liquidityCoefficient: String, awaitCompletionExpired: Boolean!, floatingOutTranchesTimestamps: Boolean!, fixedSell: Boolean!, allowEntryBurn: Boolean!, paused: Boolean!, entryPeriodStart: Float, entryPeriodExpired: Float, completionPeriodExpired: Float, floatingTimestampOffset: Float!, fullReturnTimestamp: Float, k: String, realHoldReserve: String, virtualHoldReserve: String, virtualRwaReserve: String, isTargetReached: Boolean!, isFullyReturned: Boolean!, totalClaimedAmount: String, totalReturnedAmount: String, awaitingBonusAmount: String, awaitingRwaAmount: String, outgoingTranchesBalance: String, outgoingTranches: [OutgoingTranche!]!, incomingTranches: [IncomingTranche!]!, lastCompletedIncomingTranche: Int!, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'pools',
    name: 'requestPoolApprovalSignatures',
    type: 'Mutation',
    description: 'Request multi-sig approval signatures for pool deployment',
    params: [
      { name: 'input', type: 'RequestPoolApprovalSignaturesInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'ApprovalSignaturesResponse! { taskId: String! }',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'pools',
    name: 'rejectPoolApprovalSignatures',
    type: 'Mutation',
    description: 'Reject pending approval signatures for a pool',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'Boolean!',
    endpoint: '/graphql',
  },
  {
    module: 'rwa',
    subgroup: 'pools',
    name: 'poolDeployed',
    type: 'Subscription',
    description: 'Subscribe to real-time pool deployment events',
    params: [],
    returnType: 'Pool! { id: ID!, ownerId: String!, ownerType: String!, ownerWallet: String, name: String!, businessId: String!, description: String, chainId: String!, tags: [String!], riskScore: Int, image: String, rwaAddress: String!, poolAddress: String, holdToken: String, tokenId: String, entryFeePercent: String, exitFeePercent: String, expectedHoldAmount: String, expectedRwaAmount: String, expectedBonusAmount: String, rewardPercent: String, priceImpactPercent: String, liquidityCoefficient: String, awaitCompletionExpired: Boolean!, floatingOutTranchesTimestamps: Boolean!, fixedSell: Boolean!, allowEntryBurn: Boolean!, paused: Boolean!, entryPeriodStart: Float, entryPeriodExpired: Float, completionPeriodExpired: Float, floatingTimestampOffset: Float!, fullReturnTimestamp: Float, k: String, realHoldReserve: String, virtualHoldReserve: String, virtualRwaReserve: String, isTargetReached: Boolean!, isFullyReturned: Boolean!, totalClaimedAmount: String, totalReturnedAmount: String, awaitingBonusAmount: String, awaitingRwaAmount: String, outgoingTranchesBalance: String, outgoingTranches: [OutgoingTranche!]!, incomingTranches: [IncomingTranche!]!, lastCompletedIncomingTranche: Int!, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, createdAt: Float!, updatedAt: Float! }',
    endpoint: '/graphql',
  },

  // ═══════ Signers Manager ═══════
  {
    module: 'signers-manager',
    subgroup: 'signers-manager',
    name: 'getSignatureTask',
    type: 'Query',
    description: 'Retrieve a signature task by ID',
    params: [
      { name: 'input', type: 'GetSignatureTaskInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'SignatureTask! { id: ID!, ownerId: String!, ownerType: String!, hash: String!, requiredSignatures: Int!, expired: Float!, completed: Boolean!, signatures: [Signature!] }',
    endpoint: '/graphql',
  },

  // ═══════ Testnet Faucet ═══════
  {
    module: 'testnet-faucet',
    subgroup: 'testnet-faucet',
    name: 'getHistory',
    type: 'Query',
    description: 'Retrieve faucet request history for the authenticated user',
    params: [
      { name: 'pagination', type: 'PaginationInput', required: false, description: 'Pagination settings (limit, offset, sort)' },
    ],
    returnType: '[FaucetRequest!]! [{ id: ID!, userId: String!, wallet: String!, tokenType: FaucetTokenType!, amount: Float!, transactionHash: String!, createdAt: Float! }]',
    endpoint: '/graphql',
  },
  {
    module: 'testnet-faucet',
    subgroup: 'testnet-faucet',
    name: 'getUnlockTime',
    type: 'Query',
    description: 'Retrieve token unlock times for the authenticated user',
    params: [],
    returnType: 'UnlockTimeResponse! { gasUnlockTime: Float!, holdUnlockTime: Float!, platformUnlockTime: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'testnet-faucet',
    subgroup: 'testnet-faucet',
    name: 'requestGas',
    type: 'Mutation',
    description: 'Request gas tokens from the faucet',
    params: [
      { name: 'input', type: 'RequestTokenInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'FaucetRequest! { id: ID!, userId: String!, wallet: String!, tokenType: FaucetTokenType!, amount: Float!, transactionHash: String!, createdAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'testnet-faucet',
    subgroup: 'testnet-faucet',
    name: 'requestHold',
    type: 'Mutation',
    description: 'Request HOLD tokens from the faucet',
    params: [
      { name: 'input', type: 'RequestTokenInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'FaucetRequest! { id: ID!, userId: String!, wallet: String!, tokenType: FaucetTokenType!, amount: Float!, transactionHash: String!, createdAt: Float! }',
    endpoint: '/graphql',
  },
  {
    module: 'testnet-faucet',
    subgroup: 'testnet-faucet',
    name: 'requestPlatform',
    type: 'Mutation',
    description: 'Request platform tokens from the faucet',
    params: [
      { name: 'input', type: 'RequestTokenInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'FaucetRequest! { id: ID!, userId: String!, wallet: String!, tokenType: FaucetTokenType!, amount: Float!, transactionHash: String!, createdAt: Float! }',
    endpoint: '/graphql',
  },

  // ═══════ API Keys ═══════
  {
    module: 'api-keys',
    subgroup: 'api-keys',
    name: 'getApiKeys',
    type: 'Query',
    description: 'Retrieve all API keys for the authenticated user',
    params: [],
    returnType: '[ApiKey!]! [{ id: ID!, name: String!, prefix: String!, userId: String!, wallet: String!, createdAt: Int!, updatedAt: Int! }]',
    endpoint: '/graphql',
  },
  {
    module: 'api-keys',
    subgroup: 'api-keys',
    name: 'getApiKey',
    type: 'Query',
    description: 'Retrieve a single API key by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ApiKey! { id: ID!, name: String!, prefix: String!, userId: String!, wallet: String!, createdAt: Int!, updatedAt: Int! }',
    endpoint: '/graphql',
  },
  {
    module: 'api-keys',
    subgroup: 'api-keys',
    name: 'createApiKey',
    type: 'Mutation',
    description: 'Create a new API key',
    params: [
      { name: 'input', type: 'CreateApiKeyInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'CreateApiKeyResult! { id: ID!, name: String!, prefix: String!, key: String!, createdAt: Int! }',
    endpoint: '/graphql',
  },
  {
    module: 'api-keys',
    subgroup: 'api-keys',
    name: 'updateApiKey',
    type: 'Mutation',
    description: 'Update an existing API key name',
    params: [
      { name: 'input', type: 'UpdateApiKeyInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'ApiKey! { id: ID!, name: String!, prefix: String!, userId: String!, wallet: String!, createdAt: Int!, updatedAt: Int! }',
    endpoint: '/graphql',
  },
  {
    module: 'api-keys',
    subgroup: 'api-keys',
    name: 'deleteApiKey',
    type: 'Mutation',
    description: 'Delete an API key by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },

  // ═══════ Webhooks ═══════
  {
    module: 'webhooks',
    subgroup: 'webhooks',
    name: 'getWebhookEndpoints',
    type: 'Query',
    description: 'Retrieve all webhook endpoints for the authenticated user',
    params: [],
    returnType: '[WebhookEndpoint!]! [{ id: ID!, userId: String!, url: String!, events: [String!]!, description: String, active: Boolean!, rateLimitPerMinute: Int!, createdAt: String!, updatedAt: String! }]',
    endpoint: '/graphql',
  },
  {
    module: 'webhooks',
    subgroup: 'webhooks',
    name: 'getWebhookEndpoint',
    type: 'Query',
    description: 'Retrieve a single webhook endpoint by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'WebhookEndpoint! { id: ID!, userId: String!, url: String!, events: [String!]!, description: String, active: Boolean!, rateLimitPerMinute: Int!, createdAt: String!, updatedAt: String! }',
    endpoint: '/graphql',
  },
  {
    module: 'webhooks',
    subgroup: 'webhooks',
    name: 'createWebhookEndpoint',
    type: 'Mutation',
    description: 'Create a new webhook endpoint',
    params: [
      { name: 'input', type: 'CreateWebhookEndpointInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'CreateWebhookEndpointResult! { id: ID!, url: String!, events: [String!]!, description: String, active: Boolean!, rateLimitPerMinute: Int!, secret: String!, createdAt: String! }',
    endpoint: '/graphql',
  },
  {
    module: 'webhooks',
    subgroup: 'webhooks',
    name: 'updateWebhookEndpoint',
    type: 'Mutation',
    description: 'Update an existing webhook endpoint',
    params: [
      { name: 'input', type: 'UpdateWebhookEndpointInput!', required: true, description: 'Input object with operation parameters' },
    ],
    returnType: 'WebhookEndpoint! { id: ID!, userId: String!, url: String!, events: [String!]!, description: String, active: Boolean!, rateLimitPerMinute: Int!, createdAt: String!, updatedAt: String! }',
    endpoint: '/graphql',
  },
  {
    module: 'webhooks',
    subgroup: 'webhooks',
    name: 'deleteWebhookEndpoint',
    type: 'Mutation',
    description: 'Delete a webhook endpoint by ID',
    params: [
      { name: 'id', type: 'ID!', required: true, description: 'The unique identifier' },
    ],
    returnType: 'ID!',
    endpoint: '/graphql',
  },

  // ═══════ REST ═══════
  {
    module: 'rwa',
    subgroup: 'businesses',
    name: 'uploadBusinessImage',
    type: 'REST',
    description: 'Upload an image for a business entity (multipart/form-data)',
    params: [
      { name: 'file', type: 'File', required: true, description: 'Image file to upload' },
      { name: 'businessId', type: 'String', required: true, description: 'ID of the business to attach the image to' },
    ],
    headers: [
      { name: 'Authorization', type: 'string', required: true, description: 'Bearer JWT access token' },
      { name: 'Content-Type', type: 'string', required: true, description: 'multipart/form-data' },
    ],
    returnType: 'JSON',
    endpoint: '/api/business/uploadImage',
    method: 'POST',
    path: '/api/business/uploadImage',
  },
  {
    module: 'rwa',
    subgroup: 'pools',
    name: 'uploadPoolImage',
    type: 'REST',
    description: 'Upload an image for a pool (multipart/form-data)',
    params: [
      { name: 'file', type: 'File', required: true, description: 'Image file to upload' },
      { name: 'poolId', type: 'String', required: true, description: 'ID of the pool to attach the image to' },
    ],
    headers: [
      { name: 'Authorization', type: 'string', required: true, description: 'Bearer JWT access token' },
      { name: 'Content-Type', type: 'string', required: true, description: 'multipart/form-data' },
    ],
    returnType: 'JSON',
    endpoint: '/api/pool/uploadImage',
    method: 'POST',
    path: '/api/pool/uploadImage',
  },
  {
    module: 'documents',
    subgroup: 'documents',
    name: 'uploadDocument',
    type: 'REST',
    description: 'Upload a document to a folder (multipart/form-data)',
    params: [
      { name: 'file', type: 'File', required: true, description: 'Document file to upload' },
      { name: 'folderId', type: 'String', required: true, description: 'ID of the target folder' },
      { name: 'name', type: 'String', required: true, description: 'Display name for the document' },
    ],
    headers: [
      { name: 'Authorization', type: 'string', required: true, description: 'Bearer JWT access token' },
      { name: 'Content-Type', type: 'string', required: true, description: 'multipart/form-data' },
    ],
    returnType: 'JSON',
    endpoint: '/api/documents/createDocument',
    method: 'POST',
    path: '/api/documents/createDocument',
  },
  {
    module: 'gallery',
    subgroup: 'images',
    name: 'uploadImage',
    type: 'REST',
    description: 'Upload an image to a gallery (multipart/form-data)',
    params: [
      { name: 'file', type: 'File', required: true, description: 'Image file to upload' },
      { name: 'galleryId', type: 'String', required: true, description: 'ID of the target gallery' },
      { name: 'name', type: 'String', required: true, description: 'Display name for the image' },
      { name: 'description', type: 'String', required: true, description: 'Description of the image' },
    ],
    headers: [
      { name: 'Authorization', type: 'string', required: true, description: 'Bearer JWT access token' },
      { name: 'Content-Type', type: 'string', required: true, description: 'multipart/form-data' },
    ],
    returnType: 'JSON',
    endpoint: '/api/gallery/createImage',
    method: 'POST',
    path: '/api/gallery/createImage',
  },
];

// ── GraphQL type definitions for output types ──
// Maps type name → comma-separated field definitions
export const typeDefs: Record<string, string> = {
  User: 'userId: String!, wallet: String!, createdAt: Int!, updatedAt: Int!',
  AuthTokens: 'userId: String!, wallet: String!, accessToken: String!, refreshToken: String!',
  RefreshToken: 'tokenId: String!, userId: String!, tokenHash: String!, expiresAt: Int!, createdAt: Int!, updatedAt: Int!',
  RevokeTokensResult: 'revokedCount: Int!',
  Assistant: 'id: ID!, userId: String!, name: String!, contextPreferences: [AssistantContext!]!',
  Message: 'id: ID!, assistantId: ID!, text: String!',
  IdResponse: 'id: ID!',
  EvaluationFactor: 'name: String!, impact: String!, detail: String!',
  EvaluationDocumentRef: 'id: String!, name: String!, mimeType: String!',
  EvaluationImageRef: 'id: String!, name: String!',
  Evaluation: 'id: ID!, entityType: EvaluationEntityType!, parentId: String!, grandParentId: String!, ownerId: String!, ownerType: String!, status: String!, riskScore: Int, reasoning: String, factors: [EvaluationFactor!]!, stage1Response: String, stage2Response: String, evaluatedDocuments: [EvaluationDocumentRef!]!, evaluatedImages: [EvaluationImageRef!]!, modelUsed: String, createdAt: Float!, updatedAt: Float!',
  Blog: 'id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float!',
  Post: 'id: ID!, blogId: String!, title: String!, content: String!, images: [String!]!, documents: [String!]!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float!',
  PriceData: 'id: String!, poolAddress: String!, timestamp: Float!, blockNumber: Float!, realHoldReserve: String!, virtualHoldReserve: String!, virtualRwaReserve: String!, price: String!, createdAt: Float!, updatedAt: Float!',
  OhlcData: 'timestamp: Float!, open: String!, high: String!, low: String!, close: String!',
  VolumeData: 'timestamp: Float!, mintVolume: String!, burnVolume: String!',
  PoolTransaction: 'id: String!, poolAddress: String!, transactionType: String!, userAddress: String!, timestamp: Float!, rwaAmount: String!, holdAmount: String!, bonusAmount: String!, holdFee: String!, bonusFee: String!, createdAt: Float!, updatedAt: Float!',
  PriceUpdateEvent: 'poolAddress: String!, timestamp: Float!, price: String!, realHoldReserve: String!, virtualHoldReserve: String!, virtualRwaReserve: String!',
  TransactionEvent: 'poolAddress: String!, timestamp: Float!, transactionType: String!, userAddress: String!, rwaAmount: String!, holdAmount: String!, bonusAmount: String, holdFee: String!, bonusFee: String',
  SocialLink: 'type: String!, url: String!',
  Company: 'id: ID!, name: String!, description: String!, ownerId: String!, country: String, socials: [SocialLink!]!, createdAt: Int!, updatedAt: Int!',
  Member: 'id: ID!, userId: String!, name: String!, createdAt: Int!, updatedAt: Int!',
  UserPermission: 'id: ID!, permission: String!, entity: String',
  UserWithPermissions: 'id: ID!, userId: String!, name: String!, permissions: [UserPermission!]!',
  Permission: 'id: ID!, permission: String!, entity: String, createdAt: Int!, updatedAt: Int!',
  CompanyWithDetails: 'id: ID!, name: String!, description: String!, ownerId: String!, country: String, socials: [SocialLink!]!, users: [UserWithPermissions!]!, createdAt: Int!, updatedAt: Int!',
  Staking: 'id: ID!, staker: String!, amount: String!, lastStakeTimestamp: Float!, chainId: String!, createdAt: Float!, updatedAt: Float!',
  Proposal: 'id: ID!, proposalId: String!, proposer: String!, target: String!, data: String!, description: String!, startTime: Float!, endTime: Float!, state: String!, chainId: String!, transactionHash: String!, logIndex: Float!, createdAt: Float!, updatedAt: Float!',
  Vote: 'id: ID!, proposalId: String!, chainId: String!, governanceAddress: String!, voterWallet: String!, support: Boolean!, weight: String!, reason: String!, transactionHash: String!, logIndex: Float!, blockNumber: Float!, createdAt: Float!, updatedAt: Float!',
  StakingHistory: 'id: ID!, staker: String!, amount: String!, operation: String!, chainId: String!, transactionHash: String!, logIndex: Float!, createdAt: Float!, updatedAt: Float!',
  TimelockTask: 'id: ID!, txHash: String!, target: String!, data: String!, eta: Float!, executed: Boolean!, chainId: String!, createdAt: Float!, updatedAt: Float!',
  TreasuryWithdraw: 'id: ID!, recipient: String!, token: String!, amount: String!, chainId: String!, transactionHash: String!, logIndex: Float!, createdAt: Float!, updatedAt: Float!',
  Document: 'id: ID!, folderId: String!, name: String!, fileId: String!, path: String!, url: String!, mimeType: String!, size: Float!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float!',
  Folder: 'id: ID!, name: String!, parentId: String!, ownerId: String!, ownerType: String!, creator: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float!',
  FaqTopic: 'id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float!',
  FaqAnswer: 'id: ID!, topicId: String!, question: String!, answer: String!, order: Int!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float!',
  Gallery: 'id: ID!, name: String!, parentId: String!, ownerId: String!, ownerType: String!, creator: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float!',
  Image: 'id: ID!, galleryId: String!, name: String!, description: String!, fileId: String!, path: String!, url: String!, mimeType: String!, size: Float!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float!',
  Fees: 'id: ID!, userWallet: String!, userId: String!, chainId: String!, tokenAddress: String!, buyCommissionAmount: String!, sellCommissionAmount: String!, tokenCreationCommissionAmount: String!, poolCreationCommissionAmount: String!, referralRewardAmount: String!, buyCommissionCount: Int!, sellCommissionCount: Int!, tokenCreationCommissionCount: Int!, poolCreationCommissionCount: Int!, referralRewardCount: Int!, createdAt: Float!, updatedAt: Float!',
  Referral: 'id: ID!, userWallet: String!, userId: String!, referrerWallet: String, referrerId: String, createdAt: Float!, updatedAt: Float!',
  ReferrerWithdraw: 'id: ID!, referrerWallet: String!, referrerId: String!, chainId: String!, tokenAddress: String!, totalWithdrawnAmount: String!, taskId: String, taskExpiredAt: Float, taskCooldown: Float, createdAt: Float!, updatedAt: Float!',
  ReferrerClaimHistory: 'id: ID!, referrerWallet: String!, referrerId: String!, referralWallet: String!, chainId: String!, tokenAddress: String!, amount: String!, transactionHash: String!, logIndex: Int!, blockNumber: Int!, createdAt: Float!, updatedAt: Float!',
  TokenBalance: 'id: String!, owner: String!, tokenAddress: String!, tokenId: String!, poolAddress: String!, chainId: String!, balance: Int!, lastUpdateBlock: Int!, createdAt: Int!, updatedAt: Int!',
  Transaction: 'id: String!, from: String!, to: String!, tokenAddress: String!, tokenId: String!, poolAddress: String!, chainId: String!, transactionHash: String!, blockNumber: Int!, amount: Int!, createdAt: Int!, updatedAt: Int!',
  Answer: 'text: String!, userId: String!, createdAt: Float!, updatedAt: Float!',
  Topic: 'id: ID!, name: String!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float!',
  Question: 'id: ID!, topicId: String!, text: String!, answer: Answer, answered: Boolean!, likesCount: Int!, ownerId: String!, ownerType: String!, creator: String!, parentId: String!, grandParentId: String!, createdAt: Float!, updatedAt: Float!',
  Reaction: 'id: ID!, parentId: String!, parentType: String!, userId: String!, reaction: String!, createdAt: Float!, updatedAt: Float!',
  EntityReactionsResponse: 'reactions: JSON!, userReactions: [String!]!',
  Business: 'id: ID!, chainId: String!, name: String!, ownerId: String!, ownerType: String!, ownerWallet: String, tokenAddress: String, description: String, tags: [String!], riskScore: Int, image: String, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, country: String, businessType: String, socials: [SocialLink!]!, paused: Boolean!, createdAt: Float!, updatedAt: Float!',
  OutgoingTranche: 'amount: String!, timestamp: Float!, executedAmount: String!',
  IncomingTranche: 'amount: String!, expiredAt: Float!, returnedAmount: String!',
  Pool: 'id: ID!, ownerId: String!, ownerType: String!, ownerWallet: String, name: String!, businessId: String!, description: String, chainId: String!, tags: [String!], riskScore: Int, image: String, rwaAddress: String!, poolAddress: String, holdToken: String, tokenId: String, entryFeePercent: String, exitFeePercent: String, expectedHoldAmount: String, expectedRwaAmount: String, expectedBonusAmount: String, rewardPercent: String, priceImpactPercent: String, liquidityCoefficient: String, awaitCompletionExpired: Boolean!, floatingOutTranchesTimestamps: Boolean!, fixedSell: Boolean!, allowEntryBurn: Boolean!, paused: Boolean!, entryPeriodStart: Float, entryPeriodExpired: Float, completionPeriodExpired: Float, floatingTimestampOffset: Float!, fullReturnTimestamp: Float, k: String, realHoldReserve: String, virtualHoldReserve: String, virtualRwaReserve: String, isTargetReached: Boolean!, isFullyReturned: Boolean!, totalClaimedAmount: String, totalReturnedAmount: String, awaitingBonusAmount: String, awaitingRwaAmount: String, outgoingTranchesBalance: String, outgoingTranches: [OutgoingTranche!]!, incomingTranches: [IncomingTranche!]!, lastCompletedIncomingTranche: Int!, approvalSignaturesTaskId: String, approvalSignaturesTaskExpired: Float, riskScoreEvaluationProcess: Boolean!, createdAt: Float!, updatedAt: Float!',
  ApprovalSignaturesResponse: 'taskId: String!',
  Signature: 'signer: String!, signature: String!',
  SignatureTask: 'id: ID!, ownerId: String!, ownerType: String!, hash: String!, requiredSignatures: Int!, expired: Float!, completed: Boolean!, signatures: [Signature!]',
  FaucetRequest: 'id: ID!, userId: String!, wallet: String!, tokenType: FaucetTokenType!, amount: Float!, transactionHash: String!, createdAt: Float!',
  UnlockTimeResponse: 'gasUnlockTime: Float!, holdUnlockTime: Float!, platformUnlockTime: Float!',
  ApiKey: 'id: ID!, name: String!, prefix: String!, userId: String!, wallet: String!, createdAt: Int!, updatedAt: Int!',
  CreateApiKeyResult: 'id: ID!, name: String!, prefix: String!, key: String!, createdAt: Int!',
  WebhookEndpoint: 'id: ID!, userId: String!, url: String!, events: [String!]!, description: String, active: Boolean!, rateLimitPerMinute: Int!, createdAt: String!, updatedAt: String!',
  CreateWebhookEndpointResult: 'id: ID!, url: String!, events: [String!]!, description: String, active: Boolean!, rateLimitPerMinute: Int!, secret: String!, createdAt: String!',
};

// ── Input type field definitions ──
// Maps input type name → array of {name, type, required}
export const inputDefs: Record<string, string> = {
  AuthenticateInput: 'wallet: String!, signature: String!, timestamp: Int!',
  RefreshTokenInput: 'refreshToken: String!',
  RevokeTokensInput: 'tokenHashes: [String!]!',
  CreateAssistantInput: 'name: String!, contextPreferences: [AssistantContext!]!',
  UpdateAssistantInput: 'id: ID!, name: String, contextPreferences: [AssistantContext!]',
  CreateMessageInput: 'assistantId: ID!, text: String!',
  UpdateMessageInput: 'id: ID!, text: String!',
  EvaluationFilterInput: 'entityType: EvaluationEntityType, parentId: String, grandParentId: String, ownerId: String',
  EvaluationSortInput: 'createdAt: String, riskScore: String',
  GetEvaluationsInput: 'filter: EvaluationFilterInput, sort: EvaluationSortInput, limit: Int, offset: Int',
  CreateBlogInput: 'name: String!, parentId: String!, type: BlogParentTypes!',
  UpdateBlogInput: 'id: ID!, updateData: UpdateBlogDataInput!',
  UpdateBlogDataInput: 'name: String!',
  CreatePostInput: 'blogId: String!, title: String!, content: String!, images: [String!], documents: [String!]',
  UpdatePostInput: 'id: ID!, updateData: UpdatePostDataInput!',
  UpdatePostDataInput: 'title: String, content: String, images: [String!], documents: [String!]',
  GetBlogsFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetPostsFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetRawPriceDataInput: 'poolAddress: String!, startTime: Float!, endTime: Float!, limit: Int, offset: Int, sort: JSON',
  GetOhlcPriceDataInput: 'poolAddress: String!, interval: String!, startTime: Float!, endTime: Float!, limit: Int',
  GetPoolTransactionsInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetVolumeDataInput: 'poolAddress: String!, interval: String!, startTime: Float!, endTime: Float!, limit: Int',
  SocialLinkInput: 'type: String!, url: String!',
  CreateCompanyInput: 'name: String!, description: String!, country: String, socials: [SocialLinkInput!]',
  UpdateCompanyInput: 'id: ID!, updateData: UpdateCompanyDataInput!',
  UpdateCompanyDataInput: 'name: String, description: String, country: String, socials: [SocialLinkInput!]',
  AddMemberInput: 'companyId: ID!, userId: String!, name: String!',
  GrantPermissionInput: 'companyId: ID!, memberId: ID!, userId: String!, permission: String!, entity: String!',
  GetCompaniesInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  RemoveMemberInput: 'id: ID!, companyId: ID!',
  RevokePermissionInput: 'id: ID!, companyId: ID!',
  GetStakingFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetProposalsFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetVotesFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetStakingHistoryFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetTimelockTasksFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetTreasuryWithdrawsFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  CreateDocumentInput: 'folderId: String!, name: String!, file: Upload!',
  UpdateDocumentInput: 'id: ID!, updateData: UpdateDocumentDataInput!',
  UpdateDocumentDataInput: 'name: String',
  CreateFolderInput: 'name: String!, parentId: String!, type: ParentTypes!',
  UpdateFolderInput: 'id: ID!, updateData: UpdateFolderDataInput!',
  UpdateFolderDataInput: 'name: String!',
  GetDocumentsFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetFoldersFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  CreateFaqTopicInput: 'name: String!, parentId: String!, type: FaqParentTypes!',
  UpdateFaqTopicInput: 'id: ID!, updateData: UpdateFaqTopicDataInput!',
  UpdateFaqTopicDataInput: 'name: String!',
  CreateFaqAnswerInput: 'topicId: String!, question: String!, answer: String!, order: Int',
  UpdateFaqAnswerInput: 'id: ID!, updateData: UpdateFaqAnswerDataInput!',
  UpdateFaqAnswerDataInput: 'question: String, answer: String, order: Int',
  GetFaqTopicsFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetFaqAnswersFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  CreateGalleryInput: 'name: String!, parentId: String!, type: GalleryParentTypes!',
  UpdateGalleryInput: 'id: ID!, updateData: UpdateGalleryDataInput!',
  UpdateGalleryDataInput: 'name: String!',
  CreateImageInput: 'galleryId: String!, name: String!, description: String!, file: Upload',
  UpdateImageInput: 'id: ID!, updateData: UpdateImageDataInput!',
  UpdateImageDataInput: 'name: String, description: String',
  GetGalleriesFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetImagesFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  RegisterReferralInput: 'referrerId: String',
  CreateReferrerWithdrawTaskInput: 'chainId: String!, tokenAddress: String!, amount: String!',
  GetFeesFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetReferralsFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetReferrerWithdrawsFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetReferrerClaimHistoryFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetBalancesInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetTransactionsInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  CreateTopicInput: 'name: String!, parentId: String!, type: ParentTypes!',
  UpdateTopicInput: 'id: ID!, updateData: UpdateTopicDataInput!',
  UpdateTopicDataInput: 'name: String!',
  CreateQuestionInput: 'topicId: String!, text: String!',
  UpdateQuestionTextInput: 'id: ID!, updateData: UpdateQuestionTextDataInput!',
  UpdateQuestionTextDataInput: 'text: String!',
  CreateQuestionAnswerInput: 'id: ID!, text: String!',
  UpdateQuestionAnswerInput: 'id: ID!, updateData: UpdateQuestionAnswerDataInput!',
  UpdateQuestionAnswerDataInput: 'text: String!',
  GetTopicsFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetQuestionsFilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  SetReactionInput: 'parentId: String!, parentType: ParentType!, reaction: ReactionType!',
  GetReactionsFilterInput: 'filter: JSON!, sort: JSON, limit: Int, offset: Int',
  CreateBusinessWithAIInput: 'description: String!, ownerId: String!, ownerType: BusinessOwnerType!, chainId: String!',
  CreateBusinessInput: 'name: String!, ownerId: String!, ownerType: BusinessOwnerType!, chainId: String!, description: String, tags: [String!], country: String, businessType: BusinessType, socials: [SocialLinkInput!]',
  EditBusinessInput: 'id: ID!, updateData: EditBusinessDataInput!',
  EditBusinessDataInput: 'name: String, description: String, tags: [String!], chainId: String, country: String, businessType: BusinessType, socials: [SocialLinkInput!]',
  CreatePoolWithAIInput: 'description: String!, businessId: String!',
  CreatePoolInput: 'name: String!, businessId: String!, entryFeePercent: String, exitFeePercent: String, expectedHoldAmount: String, expectedRwaAmount: String, rewardPercent: String, entryPeriodStart: Float, entryPeriodExpired: Float, completionPeriodExpired: Float, awaitCompletionExpired: Boolean, floatingOutTranchesTimestamps: Boolean, fixedSell: Boolean, allowEntryBurn: Boolean, priceImpactPercent: String, outgoingTranches: [OutgoingTrancheInput!], incomingTranches: [IncomingTrancheInput!], description: String, tags: [String!]',
  EditPoolInput: 'id: ID!, updateData: EditPoolDataInput!',
  EditPoolDataInput: 'chainId: String, name: String, entryFeePercent: String, exitFeePercent: String, expectedHoldAmount: String, expectedRwaAmount: String, rewardPercent: String, entryPeriodStart: Float, entryPeriodExpired: Float, completionPeriodExpired: Float, awaitCompletionExpired: Boolean, floatingOutTranchesTimestamps: Boolean, fixedSell: Boolean, allowEntryBurn: Boolean, priceImpactPercent: String, outgoingTranches: [OutgoingTrancheInput!], incomingTranches: [IncomingTrancheInput!], description: String, tags: [String!]',
  OutgoingTrancheInput: 'amount: String!, timestamp: Float!, executedAmount: String!',
  IncomingTrancheInput: 'amount: String!, expiredAt: Float!, returnedAmount: String!',
  RequestBusinessApprovalSignaturesInput: 'id: ID!, ownerWallet: String!, deployerWallet: String!, createRWAFee: String!',
  RequestPoolApprovalSignaturesInput: 'id: ID!, ownerWallet: String!, deployerWallet: String!, createPoolFeeRatio: String!',
  FilterInput: 'filter: JSON, sort: JSON, limit: Int, offset: Int',
  GetSignatureTaskInput: 'taskId: String!',
  RequestTokenInput: 'amount: Float!',
  CreateApiKeyInput: 'name: String!',
  UpdateApiKeyInput: 'id: ID!, name: String!',
  CreateWebhookEndpointInput: 'url: String!, events: [String!]!, description: String, rateLimitPerMinute: Int',
  UpdateWebhookEndpointInput: 'id: ID!, url: String, events: [String!], description: String, active: Boolean, rateLimitPerMinute: Int',
};

// ── Helper: format a GraphQL type with fields into a nice multi-line string ──
export function formatReturnType(returnType: string): string {
  // If it doesn't have { ... }, it's a scalar — return as-is
  if (!returnType.includes('{')) return returnType;
  
  // Extract the outer type name and the inner fields
  const match = returnType.match(/^(\[?([\w!]+)\]?!?)\s*\{\s*(.+)\s*\}$/s);
  if (!match) {
    // Try without brackets: "TypeName! { fields }"
    const match2 = returnType.match(/^([\w!]+)\s*\{\s*(.+)\s*\}$/s);
    if (!match2) return returnType;
    const outerType = match2[1];
    const fields = match2[2];
    return `${outerType} {\n${formatBlock(fields)}}`;
  }
  // With brackets: "[TypeName!]! { fields }"
  const outerType = match[1];
  const fields = match[3];
  return `${outerType} {\n${formatBlock(fields)}}`;
}

function formatBlock(fields: string): string {
  return fields.split(', ').map(f => `  ${f}`).join('\n');
}

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