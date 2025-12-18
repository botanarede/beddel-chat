# Custom Agents

> Quick reference for creating custom agents. See `docs/guides/custom-agents.md` for complete documentation.

## Quick Start

1. **Create `/agents` directory** at your project root

2. **Add a YAML file**:

```yaml
# agents/my-agent.yaml
agent:
  id: my-agent
  version: 1.0.0
  protocol: beddel-declarative-protocol/v2.0

metadata:
  name: "My Agent"
  description: "What it does"
  route: "/agents/my-agent"

schema:
  input:
    type: "object"
    properties:
      message:
        type: "string"
    required: ["message"]
  output:
    type: "object"
    properties:
      response:
        type: "string"
    required: ["response"]

logic:
  workflow:
    - name: "process"
      type: "genkit-joke"
      action:
        type: "joke"
        prompt: "{{message}}"
        result: "result"

output:
  schema:
    response: "$result.texto"
```

3. **Execute via GraphQL**:

```graphql
mutation {
  executeMethod(
    methodName: "my-agent.execute"
    params: { message: "Hello" }
    props: { gemini_api_key: "..." }
  ) {
    success
    data
  }
}
```

## Directory Structure

```
your-app/
├── agents/                    # Custom agents (auto-discovered)
│   ├── simple-agent.yaml
│   └── complex/
│       └── complex-agent.yaml
│
└── packages/beddel/src/agents/  # Built-in agents
    ├── joker-agent.yaml
    ├── translator-agent.yaml
    └── image-agent.yaml
```

## Override Built-in Agents

Use the same `route` to override:

```yaml
# agents/custom-joker.yaml
metadata:
  route: "/agents/joker"  # Same as built-in = override
```

## Workflow Types

| Type | Description |
|------|-------------|
| `genkit-joke` | Text generation via Gemini |
| `genkit-translation` | Translation via Gemini |
| `genkit-image` | Image generation via Gemini |
| `output-generator` | Format output response |

## Logs

```
🔍 Loading custom agents from: /path/to/agents
Agent registered: my-agent.execute (beddel-declarative-protocol/v2.0)
✅ Successfully loaded 1/1 custom agents
```

## Full Documentation

See [`docs/guides/custom-agents.md`](docs/guides/custom-agents.md) for:
- Complete field reference
- Schema validation
- Troubleshooting
- Best practices
