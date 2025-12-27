# AGENTS.md — Beddel Protocol Developer Guide

> **Language Policy**: The native language of the Beddel protocol is **English**. All code, comments, commit messages, documentation, and agent manifests **must be written in English**. This ensures consistency, broader accessibility, and seamless integration with AI agents.

This document provides essential context for AI agents and developers working on the `packages/beddel` codebase. It complements `README.md` with implementation details, navigation guides, and operational instructions.

---

## What is Beddel?

**Beddel Protocol** is a **Sequential Pipeline Executor** that parses YAML workflow definitions and executes steps sequentially. Unlike traditional "agent wrappers", Beddel is a **declarative pipeline executor** built on the Vercel AI SDK v6.

| Concept       | Definition                                               |
|---------------|----------------------------------------------------------|
| **Workflow**  | A linear list of steps defined in YAML                   |
| **Agent**     | Just one step type (`llm`) within the workflow           |
| **Streaming** | Native `streamText` support, returns `Response` immediately |
| **Primitive** | A handler function for a step type (llm, output-generator, call-agent) |

---

## Technology Stack

| Category        | Technology              | Version | Purpose                               |
|-----------------|-------------------------|---------|---------------------------------------|
| **Language**    | TypeScript              | 5.x     | Primary development language          |
| **Runtime**     | Node.js / Edge          | 20+     | JavaScript runtime                    |
| **AI Core**     | `ai`                    | 6.x     | Vercel AI SDK Core                    |
| **AI Provider** | `@ai-sdk/google`        | 3.x     | Google Gemini integration             |
| **AI Provider** | `@ai-sdk/amazon-bedrock`| 4.x     | Amazon Bedrock integration            |
| **AI Provider** | `@ai-sdk/openai`        | 1.x     | OpenRouter integration (400+ models)  |
| **Validation**  | `zod`                   | 3.x     | Schema validation for tools           |
| **YAML Parser** | `js-yaml`               | 4.x     | Secure YAML parsing (FAILSAFE_SCHEMA) |
| **Framework**   | Next.js App Router      | 14+     | API route hosting (consumer-side)     |

---

## Source Tree Overview

```
packages/beddel/
├── src/
│   ├── index.ts                  # Main server exports (Node.js deps)
│   ├── server.ts                 # Server handler barrel export
│   ├── client.ts                 # Client exports (types only, browser-safe)
│   ├── agents/                   # Built-in agents (bundled with package)
│   │   ├── index.ts              # Built-in agents registry
│   │   ├── assistant.yaml        # Google Gemini assistant
│   │   ├── assistant-bedrock.yaml # Amazon Bedrock assistant
│   │   └── assistant-openrouter.yaml # OpenRouter assistant
│   ├── core/
│   │   ├── parser.ts             # YAML parsing (FAILSAFE_SCHEMA)
│   │   ├── workflow.ts           # WorkflowExecutor class
│   │   └── variable-resolver.ts  # $variable.path resolution
│   ├── primitives/
│   │   ├── index.ts              # Handler registry (handlerRegistry)
│   │   ├── llm.ts                # streamText/generateText wrapper
│   │   └── output.ts             # JSON transform primitive
│   ├── providers/
│   │   └── index.ts              # Provider registry (google, bedrock, openrouter)
│   ├── server/
│   │   └── handler.ts            # createBeddelHandler factory
│   ├── tools/
│   │   └── index.ts              # Tool registry (calculator, getCurrentTime)
│   └── types/
│       └── index.ts              # Type definitions
├── examples/
│   └── agents/
│       └── assistant.yaml        # Sample streaming assistant
├── docs/
│   ├── architecture/             # Sharded Architecture documents
│   ├── prd/                      # Sharded PRD documents
│   └── prompts.md                # Implementation prompts
├── package.json
└── tsconfig.json
```

---

## Bundle Separation (Entry Points)

Beddel exports three distinct bundles to support different runtime environments:

| Import Path      | Entry File   | Contents                                               | Use Case                 |
|------------------|--------------|--------------------------------------------------------|--------------------------|
| `beddel`         | `index.ts`   | Full API: `loadYaml`, `WorkflowExecutor`, registries   | Internal usage, handlers |
| `beddel/server`  | `server.ts`  | `createBeddelHandler`, `BeddelHandlerOptions`          | Next.js API Routes       |
| `beddel/client`  | `client.ts`  | Types only: `ParsedYaml`, `ExecutionContext`, etc.     | Client Components        |

> [!IMPORTANT]
> The `beddel` and `beddel/server` entry points use Node.js APIs (`fs/promises`).  
> **Never import these in client/browser code.** Use `beddel/client` for type imports.

---

## Core Components

### Parser (`src/core/parser.ts`)

**Responsibility:** Load and parse YAML workflow definitions securely.

- Uses `FAILSAFE_SCHEMA` from `js-yaml` to prevent code execution attacks
- Blocks dangerous YAML tags: `!!js/function`, `!!js/regexp`, custom tags
- Returns typed `ParsedYaml` object

### WorkflowExecutor (`src/core/workflow.ts`)

**Responsibility:** Execute workflow steps sequentially, managing context and variable storage.

**Critical Behaviors:**
- If a handler returns a `Response` instance (streaming), execution stops immediately
- Non-Response results are stored in `context.variables` for subsequent steps
- Follows the **Early Return Pattern** for streaming responses

### Variable Resolver (`src/core/variable-resolver.ts`)

**Responsibility:** Resolve `$input.*` and `$stepResult.*` variable references.

| Pattern                | Example                    | Description                     |
|------------------------|----------------------------|---------------------------------|
| `$input.*`             | `$input.messages`          | Access request input data       |
| `$stepResult.varName.*`| `$stepResult.llmOutput.text`| Access step result by name     |
| `$varName.*`           | `$llmOutput.usage`         | Legacy: direct variable access  |

### LLM Primitive (`src/primitives/llm.ts`)

**Responsibility:** Execute LLM calls with dual-mode support.

- `stream: true` → `streamText()` → `result.toUIMessageStreamResponse()`
- `stream: false` → `generateText()` → `{ text, usage }`
- Uses `createModel()` from provider registry for dynamic provider selection
- Uses `dynamicTool()` for registry-based tool creation
- Uses `stopWhen: stepCountIs(5)` for multi-step tool loops
- Supports `onFinish` / `onError` lifecycle callbacks

**AI SDK v6 Compatibility:**
- Frontend (`useChat`) sends `UIMessage[]` with `{ parts: [...] }` format
- Backend (`streamText`/`generateText`) expects `ModelMessage[]` with `{ content: ... }`
- `convertToModelMessages()` bridges this gap automatically
- `toUIMessageStreamResponse()` returns the correct stream format for `useChat`

**Environment:** 
- Google: Requires `GEMINI_API_KEY`
- Bedrock: Requires `AWS_REGION` (defaults to `us-east-1`) and `AWS_BEARER_TOKEN_BEDROCK` or standard AWS credentials

### Provider Registry (`src/providers/index.ts`)

**Responsibility:** Register and provide LLM provider implementations.

**Built-in Providers:**
- `google` — Google Gemini via `@ai-sdk/google` (requires `GEMINI_API_KEY`)
- `bedrock` — Amazon Bedrock via `@ai-sdk/amazon-bedrock` (requires `AWS_REGION`, defaults to `us-east-1`)
- `openrouter` — OpenRouter via `@ai-sdk/openai` (requires `OPENROUTER_API_KEY`, 400+ models)

**Environment Variables for Bedrock:**
- `AWS_REGION` — AWS region (required, defaults to `us-east-1`)
- `AWS_BEARER_TOKEN_BEDROCK` — API key for Bedrock (or use standard AWS credentials)

**Key Functions:**
- `registerProvider(name, implementation)` — Add custom providers
- `createModel(provider, config)` — Create LanguageModel from registry

### Tool Registry (`src/tools/index.ts`)

**Built-in Tools:**
- `calculator` — Evaluate mathematical expressions
- `getCurrentTime` — Get current ISO timestamp

---

## Extensibility APIs (Expansion Pack Pattern)

Beddel follows the **Expansion Pack Pattern** for extensibility:

### `registerPrimitive(type, handler)`

Add custom step types to the workflow engine.

```typescript
import { registerPrimitive } from 'beddel';

registerPrimitive('http-fetch', async (config, context) => {
  const response = await fetch(config.url);
  return { data: await response.json() };
});
```

### `registerTool(name, implementation)`

Add custom tools for LLM function calling.

```typescript
import { registerTool } from 'beddel';
import { z } from 'zod';

registerTool('weatherLookup', {
  description: 'Get weather for a city',
  parameters: z.object({ city: z.string() }),
  execute: async ({ city }) => fetchWeather(city),
});
```

### `registerCallback(name, fn)`

Add lifecycle hooks for streaming completion.

```typescript
import { registerCallback } from 'beddel';

registerCallback('persistConversation', async ({ text, usage }) => {
  await db.saveMessage(text, usage);
});
```

### `registerProvider(name, implementation)`

Add custom LLM providers for dynamic model selection.

```typescript
import { registerProvider } from 'beddel';
import { createOpenAI } from '@ai-sdk/openai';

registerProvider('openai', {
  createModel: (config) => {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return openai(config.model || 'gpt-4');
  },
});
```

---

## YAML Agent Structure

YAML files define a **Pipeline** of sequential steps:

```yaml
metadata:
  name: "Agent Name"
  version: "1.0.0"

workflow:
  - id: "step-1"
    type: "llm"           # Primitive type
    config:
      provider: "google"  # Optional: 'google' (default), 'bedrock', 'openrouter', or custom
      model: "gemini-2.0-flash-exp"
      stream: true        # true = streaming, false = blocking
      system: "System prompt"
      messages: "$input.messages"
      tools:              # Optional: tools for function calling
        - name: "calculator"
      onFinish: "callbackName"   # Optional: lifecycle hook
    result: "stepOutput"  # Optional: variable name for result
```

---

## Consumer Setup Flow

### 1. Create API Route

```typescript
// app/api/beddel/chat/route.ts
import { createBeddelHandler } from 'beddel/server';

export const POST = createBeddelHandler({
  agentsPath: 'src/agents',      // Optional, default: 'src/agents'
  disableBuiltinAgents: false,   // Optional, default: false
});
```

**Handler Options:**

| Option                | Type      | Default        | Description                                      |
|-----------------------|-----------|----------------|--------------------------------------------------|
| `agentsPath`          | `string`  | `'src/agents'` | Path to user-defined agents (relative to CWD)    |
| `disableBuiltinAgents`| `boolean` | `false`        | Disable built-in agents bundled with the package |

---

## Built-in Agents

Beddel includes ready-to-use agents that work out of the box. These are available automatically without any configuration.

| Agent ID               | Provider    | Model                              | Description                    |
|------------------------|-------------|------------------------------------|--------------------------------|
| `assistant`            | Google      | `gemini-2.0-flash-exp`             | Fast streaming assistant       |
| `assistant-bedrock`    | Bedrock     | `us.meta.llama3-2-1b-instruct-v1:0`| Lightweight Llama 3.2 1B       |
| `assistant-openrouter` | OpenRouter  | `qwen/qwen3-14b:free`              | Free tier via OpenRouter       |

**Agent Resolution Order:**

```
1. User agents (src/agents/*.yaml) → allows override
2. Built-in agents (package) → fallback
```

Users can override any built-in agent by creating a file with the same name in their `agentsPath`.

**Example: Use built-in agent immediately**

```bash
# No setup needed - just call the built-in agent
curl -X POST http://localhost:3000/api/beddel/chat \
  -H "Content-Type: application/json" \
  -d '{"agentId": "assistant-openrouter", "messages": [{"role": "user", "content": "Hello!"}]}'
```

**Example: Override built-in agent**

```yaml
# src/agents/assistant.yaml (overrides built-in)
metadata:
  name: "My Custom Assistant"
  version: "1.0.0"

workflow:
  - id: "chat"
    type: "llm"
    config:
      provider: "google"
      model: "gemini-1.5-pro"  # Use different model
      stream: true
      system: "You are my custom assistant with special instructions."
      messages: "$input.messages"
```

---

### 2. Create YAML Agent

```yaml
# src/agents/assistant.yaml
metadata:
  name: "Streaming Assistant"
  version: "1.0.0"

workflow:
  - id: "chat-interaction"
    type: "llm"
    config:
      provider: "google"          # Optional: 'google' (default), 'bedrock', or 'openrouter'
      model: "gemini-2.0-flash-exp"
      stream: true
      system: "You are a helpful assistant."
      messages: "$input.messages"
```

**Using Amazon Bedrock:**

```yaml
# src/agents/assistant-bedrock.yaml
metadata:
  name: "Bedrock Assistant"
  version: "1.0.0"
  description: "Simple assistant using Llama 3.2 1B (lightweight)"

workflow:
  - id: "chat"
    type: "llm"
    config:
      provider: "bedrock"
      model: "us.meta.llama3-2-1b-instruct-v1:0"
      stream: true
      system: |
        You are a helpful, friendly assistant. Be concise and direct.
        Answer in the same language the user writes to you.
      messages: "$input.messages"
```

**Environment Variables:**

```bash
# For Google Gemini
GEMINI_API_KEY=your_api_key_here

# For Amazon Bedrock
AWS_REGION=us-east-1
AWS_BEARER_TOKEN_BEDROCK=your_bedrock_api_key
# Or use standard AWS credentials:
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key

# For OpenRouter (400+ models)
OPENROUTER_API_KEY=your_openrouter_api_key
```

**Using OpenRouter:**

```yaml
# src/agents/assistant-openrouter.yaml
metadata:
  name: "OpenRouter Assistant"
  version: "1.0.0"

workflow:
  - id: "chat"
    type: "llm"
    config:
      provider: "openrouter"
      model: "qwen/qwen3-14b:free"  # or any model from openrouter.ai/models
      stream: true
      system: "You are a helpful assistant."
      messages: "$input.messages"
```

### 3. Test with curl

```bash
curl -X POST http://localhost:3000/api/beddel/chat \
  -H "Content-Type: application/json" \
  -d '{"agentId": "assistant", "messages": [{"role": "user", "content": "Hello!"}]}'
```

---

## Architectural Patterns

| Pattern                  | Description                                                      |
|--------------------------|------------------------------------------------------------------|
| **Sequential Pipeline**  | Workflow steps execute in order; first `Response` breaks the loop |
| **Expansion Pack**       | Primitives, tools, callbacks, providers registered in extensible maps |
| **Early Return**         | Streaming responses return immediately to prevent buffering      |
| **Registry Pattern**     | Decouples YAML definitions from implementation details           |
| **Bundle Separation**    | Three entry points prevent Node.js deps in client bundles        |

---

## Documentation References

Detailed documentation is available in `packages/beddel/docs/`:

| Document                           | Purpose                                    |
|------------------------------------|--------------------------------------------|
| `architecture/api-reference.md`    | Complete API documentation for all exports |
| `architecture/components.md`       | Component responsibilities and interfaces  |
| `architecture/core-workflows.md`   | Consumer setup and execution flow diagrams |
| `architecture/high-level-architecture.md` | High-level overview and patterns     |
| `architecture/source-tree.md`      | Source tree and bundle separation          |
| `architecture/tech-stack.md`       | Technology stack details                   |
| `prd/goals-context.md`             | Goals and background context               |
| `prd/requirements.md`              | Requirements and success criteria          |
| `prompts.md`                       | Implementation prompts for each task       |

---

## Key Implementation Notes

1. **Security First:** YAML parser uses `FAILSAFE_SCHEMA` — no code execution possible
2. **Streaming Native:** `stream: true` returns `Response` via `toUIMessageStreamResponse()`
3. **AI SDK v6:** Uses `convertToModelMessages()` to bridge `UIMessage[]` → `ModelMessage[]`
4. **Tool Loops:** When tools exist, `stopWhen: stepCountIs(5)` enables multi-step loops
5. **Callbacks:** `onFinish` and `onError` execute after streaming completes
6. **Placeholder:** `call-agent` primitive is registered but not yet implemented
7. **Multi-Provider:** Supports Google (default), Amazon Bedrock, and OpenRouter via `provider` config

---

## Type Definitions

Key types exported from `beddel/client`:

```typescript
interface ParsedYaml {
  metadata: YamlMetadata;
  workflow: WorkflowStep[];
}

interface WorkflowStep {
  id: string;
  type: string;  // 'llm' | 'output-generator' | 'call-agent' | custom
  config: StepConfig;
  result?: string;
}

interface ExecutionContext {
  input: unknown;
  variables: Map<string, unknown>;
}

type PrimitiveHandler = (
  config: StepConfig,
  context: ExecutionContext
) => Promise<Response | Record<string, unknown>>;

interface ProviderImplementation {
  createModel: (config: ProviderConfig) => LanguageModel;
}

interface ProviderConfig {
  model: string;
  [key: string]: unknown;
}
```

---

## Change Log

| Date       | Version | Description              |
|------------|---------|--------------------------|
| 2024-12-24 | 1.0.0   | Initial AGENTS.md release |
| 2024-12-24 | 1.0.1   | AI SDK v6 compatibility: UIMessage/ModelMessage conversion |
| 2024-12-25 | 1.0.2   | Provider registry: registerProvider, createModel, bedrock support |
| 2024-12-25 | 1.0.3   | Bedrock region fix: AWS_REGION env var support, updated examples |
| 2024-12-26 | 1.0.3   | OpenRouter provider: 400+ models via @ai-sdk/openai |
| 2024-12-26 | 1.0.3   | Built-in agents: assistant, assistant-bedrock, assistant-openrouter bundled with package |
