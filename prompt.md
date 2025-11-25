# Prompt for Generating Beddel Package Documentation

## System Message

You are a senior technical writer tasked with creating comprehensive and developer-friendly documentation for the `beddel` npm package. Your audience is developers who want to build, deploy, and share secure automation workflows. Your writing should be clear, concise, and practical, with a focus on real-world use cases. You must adhere to the structure and content outlined in the `packages/beddel/AGENTS.md` file.

## User Message

Based on the provided context, which includes the project's architecture, product requirements, and the `AGENTS.md` summary, please generate the complete documentation for the `beddel` package. The documentation should be a single, well-structured Markdown file that can be used as the primary `README.md` for the npm package.

**Context Files:**

- `packages/beddel/AGENTS.md` (Primary guide for structure and content)
- `docs/architecture/architecture.md` (Technical architecture details)
- `docs/beddel/prd.md` (Product goals and user stories)
- The file structure of the `packages/beddel/src` directory.

**Requirements:**

1.  **Follow the structure of `AGENTS.md`:** Use the sections defined in `AGENTS.md` as the main headings for your documentation.
2.  **Elaborate on each section:** Expand on the key concepts outlined in the "Key Concepts to Document" section of `AGENTS.md`.
3.  **Include code examples:** Provide clear and practical TypeScript code examples for:
    - Defining an agent in the Beddel YAML format.
    - Parsing and validating an agent definition.
    - Executing an agent in the secure runtime.
    - Interacting with external APIs.
4.  **Be comprehensive:** Cover all the key modules of the package (`parser`, `runtime`, `security`, `compliance`, etc.).
5.  **Write in English.**

## Assistant Response (Example Structure)

Here is a template for your response. Please fill in each section with detailed and accurate information based on the provided context.

````markdown
# Beddel: Secure, Declarative, and Extensible Agent Runtimes

[NPM Version Badge] [License Badge] [Build Status Badge]

Beddel is a secure, declarative, and extensible runtime for executing agentic workflows defined in YAML. It simplifies automation for developers by providing a universal protocol for server-side agents, complete with a marketplace for sharing and monetizing behaviors.

## 1. Overview

_(Expand on the "Project Overview" section from AGENTS.md, incorporating details from the PRD.)_

## 2. Key Features

- **Declarative YAML Language:** ...
- **Secure Sandboxed Runtime:** ...
- **Extensible and Composable:** ...
- **Built-in Compliance:** ...
- **Performance Optimized:** ...

## 3. Getting Started

### Installation

```bash
npm install beddel
```

### Your First Agent

_(Provide a simple "Hello, World!" example of a Beddel YAML file and the TypeScript code to run it.)_

## 4. The Beddel Declarative Language

_(Detailed explanation of the YAML syntax, keywords, and structure. Include examples for data transformations, control flows, etc.)_

### Schema

```yaml
# Example of a Beddel agent definition
```

## 5. The Secure Runtime Environment

_(Explain the `isolated-vm` sandbox, resource limits, and how to interact with external APIs. Provide code examples.)_

### Executing an Agent

```typescript
// Example of executing an agent
...
```

## 6. Core Modules

### 6.1. Parser

_(Detail the functionality of the `secure-yaml-parser.ts`.)_

### 6.2. Runtime

_(Explain the different runtime strategies: `simpleRuntime`, `isolatedRuntime`, `declarativeAgentRuntime`.)_

### 6.3. Security

_(Provide an overview of the security features, including the threat detector, scanner, and validation.)_

### 6.4. Compliance

_(Explain how the GDPR and LGPD engines work.)_

## 7. Contributing

_(Provide guidelines for contributing to the project, as outlined in AGENTS.md.)_

## 8. License

_(Specify the project's license.)_
````
