# Beddel Chat

A demo chat application showcasing the [Beddel Protocol](https://github.com/botanarede/beddel) - a declarative YAML-based pipeline executor for AI workflows.

## What is this?

This is a Next.js application that demonstrates how to use the `beddel` package to create streaming AI chat interfaces with YAML-defined agents.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **AI Engine**: [Beddel Protocol](https://www.npmjs.com/package/beddel) + Vercel AI SDK v6
- **LLM Provider**: Google Gemini
- **UI**: Tailwind CSS + Radix UI + shadcn/ui
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Google Gemini API Key

### 1. Clone the repository

```bash
git clone https://github.com/botanarede/beddel-chat.git
cd beddel-chat
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Build the beddel package

```bash
pnpm package:build
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
beddel-chat/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes (Beddel handler)
│   │   └── page.tsx      # Chat UI
│   ├── agents/           # YAML agent definitions
│   └── components/       # React components
├── packages/
│   └── beddel/           # Beddel Protocol package (subtree)
└── package.json
```

## Creating Agents

Agents are defined in YAML files under `src/agents/`:

```yaml
# src/agents/assistant.yaml
metadata:
  name: "Streaming Assistant"
  version: "1.0.0"

workflow:
  - id: "chat"
    type: "llm"
    config:
      model: "gemini-2.0-flash-exp"
      stream: true
      system: "You are a helpful assistant."
      messages: "$input.messages"
```

## Related

- [Beddel Protocol](https://github.com/botanarede/beddel) - The core package
- [Beddel on npm](https://www.npmjs.com/package/beddel)

## License

MIT
