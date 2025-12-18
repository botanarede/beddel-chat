# Beddel Alpha Example

**A Next.js application demonstrating the Beddel declarative agent runtime with custom TypeScript implementations.**

This repository showcases how to use the `beddel` npm package to build secure, declarative AI agents with full TypeScript code-behind support.

---

## 🏗️ Repository Structure

This is a **monorepo** containing:

- **`/packages/beddel`** - The Beddel core package (synced to [`botanarede/beddel-alpha`](https://github.com/botanarede/beddel-alpha))
- **`/agents`** - Example custom agents with TypeScript implementations
- **`/app`** - Next.js application showcasing Beddel features
- **`/components`** - UI components for the demo

### Related Repositories

- 📦 **Core Package**: [github.com/botanarede/beddel-alpha](https://github.com/botanarede/beddel-alpha)
- 🎯 **Example App**: [github.com/botanarede/beddel-alpha-example](https://github.com/botanarede/beddel-alpha-example) (this repo)
- 📚 **npm Package**: [npmjs.com/package/beddel](https://www.npmjs.com/package/beddel)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **pnpm** (recommended) or npm
- **Gemini API Key** (for AI-powered agents)
- **Upstash KV credentials** (optional, for API/GraphQL routes)

### Installation

```bash
# Clone the repository
git clone https://github.com/botanarede/beddel-alpha-example.git
cd beddel-alpha-example

# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Required for AI agents
GEMINI_API_KEY="your_gemini_api_key_here"

# Optional: For API/GraphQL routes
KV_REST_API_URL="your_upstash_kv_url"
KV_REST_API_TOKEN="your_upstash_kv_token"
```

### Run Development Server

```bash
# Start the Next.js development server
pnpm dev
```

Visit:
- **Main App**: http://localhost:3000
- **Beddel Demo**: http://localhost:3000/beddel-alpha

### Run Storybook (Optional)

```bash
pnpm storybook
```

---

## 📚 What's Included

### Built-in Agents

The example includes three built-in agents from the Beddel package:

1. **Joker Agent** (`joker.execute`) - Generates jokes using Gemini Flash
2. **Translator Agent** (`translator.execute`) - Translates text between languages
3. **Image Generator** (`image.generate`) - Creates images with different styles

### Custom Agents with TypeScript

Example custom agents demonstrating code-behind functionality:

#### `/agents/my-chat.ts` + `/agents/my-chat.yaml`

A chat agent with full TypeScript implementation:

```typescript
// agents/my-chat.ts
export const chatHandler = async ({ input, variables, context }) => {
  context.log("Processing chat message");
  
  const message = input.message || "";
  const history = input.messages || [];
  
  // Your custom logic here
  return { 
    response: `Processed: "${message}"`,
    history,
    timestamp: new Date().toISOString()
  };
};
```

```yaml
# agents/my-chat.yaml
logic:
  workflow:
    - name: process
      type: custom-action
      action:
        function: "my-chat/chatHandler"
        result: response
```

---

## 🛠️ Development Workflow

### Using the Local Package

By default, the app uses the published `beddel` package from npm. To use the local package in `packages/beddel`:

```bash
# The workspace is already configured via pnpm-workspace.yaml
# Just run the dev server - it will use the local package
pnpm dev
```

### Making Changes to the Package

```bash
# 1. Make changes in packages/beddel/
cd packages/beddel
# ... edit files ...

# 2. Build the package
pnpm run build

# 3. Test in the example app
cd ../..
pnpm dev
```

### Publishing the Package

See the [Repository Strategy Guide](https://github.com/botanarede/beddel-alpha#publishing-workflow) for the complete publishing workflow.

---

## 📖 Documentation

### Package Documentation

- **README**: [`packages/beddel/README.md`](./packages/beddel/README.md)
- **Changelog**: [`packages/beddel/CHANGELOG.md`](./packages/beddel/CHANGELOG.md)
- **Custom Agents Guide**: [`CUSTOM_AGENTS.md`](./CUSTOM_AGENTS.md)

### Key Features

✅ **Declarative YAML Agents** - Define agents with YAML configuration  
✅ **TypeScript Code-Behind** - Write custom logic in TypeScript  
✅ **Schema Validation** - Automatic input/output validation with Zod  
✅ **Security-First** - Isolated runtime with security profiles  
✅ **Gemini Integration** - Built-in AI capabilities  
✅ **Hot Reload** - Fast development with Next.js  

---

## 🧪 Testing

### Run Example Tests

```bash
# Test custom agents
pnpm tsx test-custom-agents.ts

# Test Joker agent
node test-joker-simple.js

# Test integration
node test-integration-complete.js
```

### Create Your Own Agent

1. **Create TypeScript implementation**:
   ```bash
   touch agents/my-agent.ts
   ```

2. **Create YAML configuration**:
   ```bash
   touch agents/my-agent.yaml
   ```

3. **Implement the handler**:
   ```typescript
   // agents/my-agent.ts
   export const myHandler = async ({ input, context }) => {
     // Your logic here
     return { result: "success" };
   };
   ```

4. **Configure the workflow**:
   ```yaml
   # agents/my-agent.yaml
   logic:
     workflow:
       - name: execute
         type: custom-action
         action:
           function: "my-agent/myHandler"
           result: output
   ```

5. **Test it**:
   ```typescript
   import { agentRegistry } from 'beddel';
   
   const result = await agentRegistry.executeAgent(
     'my-agent.execute',
     { /* input */ },
     { gemini_api_key: process.env.GEMINI_API_KEY },
     context
   );
   ```

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

### For Package Changes

Submit PRs to: [github.com/botanarede/beddel-alpha](https://github.com/botanarede/beddel-alpha)

### For Example App Changes

Submit PRs to this repository: [github.com/botanarede/beddel-alpha-example](https://github.com/botanarede/beddel-alpha-example)

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 🔗 Links

- **npm Package**: https://www.npmjs.com/package/beddel
- **Core Repository**: https://github.com/botanarede/beddel-alpha
- **Example Repository**: https://github.com/botanarede/beddel-alpha-example
- **Documentation**: See `packages/beddel/README.md`

---

## 💡 Need Help?

- Check the [Custom Agents Guide](./CUSTOM_AGENTS.md)
- Review example agents in `/agents`
- See package documentation in `packages/beddel/README.md`
- Open an issue on GitHub
