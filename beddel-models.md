# Beddel Protocol - Available Models

Reference list of models available for each provider supported by Beddel.

---

## Google Gemini (`@ai-sdk/google`)

Requires: `GEMINI_API_KEY`

### Gemini 3 (Preview)

| Model Code | Description | Context | Status |
|------------|-------------|---------|--------|
| `gemini-3-pro-preview` | Most intelligent model for multimodal understanding | 1M tokens | Preview |
| `gemini-3-pro-image-preview` | Image generation with Gemini 3 Pro | 65K tokens | Preview |
| `gemini-3-flash-preview` | Most intelligent model built for speed | 1M tokens | Preview |

### Gemini 2.5

| Model Code | Description | Context | Status |
|------------|-------------|---------|--------|
| `gemini-2.5-pro` | State-of-the-art thinking model | 1M tokens | Stable |
| `gemini-2.5-pro-preview-tts` | Text-to-speech | 8K tokens | Preview |
| `gemini-2.5-flash` | Best price-performance | 1M tokens | Stable |
| `gemini-2.5-flash-preview-09-2025` | Flash preview | 1M tokens | Preview |
| `gemini-2.5-flash-image` | Image generation | 65K tokens | Stable |
| `gemini-2.5-flash-native-audio-preview-12-2025` | Live audio | 131K tokens | Preview |
| `gemini-2.5-flash-preview-tts` | Text-to-speech | 8K tokens | Preview |
| `gemini-2.5-flash-lite` | Ultra fast, cost-efficient | 1M tokens | Stable |
| `gemini-2.5-flash-lite-preview-09-2025` | Flash Lite preview | 1M tokens | Preview |

### Gemini 2.0

| Model Code | Description | Context | Status |
|------------|-------------|---------|--------|
| `gemini-2.0-flash` | Second generation workhorse | 1M tokens | Stable |
| `gemini-2.0-flash-001` | Stable version | 1M tokens | Stable |
| `gemini-2.0-flash-exp` | Experimental | 1M tokens | Experimental |
| `gemini-2.0-flash-preview-image-generation` | Image generation | 32K tokens | Preview |
| `gemini-2.0-flash-lite` | Fast, cost-efficient | 1M tokens | Stable |

Source: [Google AI Models](https://ai.google.dev/gemini-api/docs/models)

---

## OpenRouter (`@openrouter/ai-sdk-provider`)

Requires: `OPENROUTER_API_KEY`

Access to 400+ models through a single API. Below are highlighted models.

### Free Models (:free suffix)

| Model ID | Name | Context |
|----------|------|---------|
| `qwen/qwen3-coder:free` | Qwen3 Coder | 128K |
| `google/gemma-3n-e2b-it:free` | Google Gemma 3N | - |
| `nvidia/nemotron-nano-9b-v2:free` | NVIDIA Nemotron Nano 9B | 128K |
| `nvidia/nemotron-nano-12b-v2-vl:free` | NVIDIA Nemotron Nano 12B VL | 128K |
| `nvidia/nemotron-3-nano-30b-a3b:free` | NVIDIA Nemotron 3 Nano 30B | 256K |
| `mistralai/devstral-2512:free` | Mistral Devstral 2 | 262K |
| `allenai/olmo-3.1-32b-think:free` | AllenAI Olmo 3.1 32B Think | 65K |
| `allenai/olmo-3-32b-think:free` | AllenAI Olmo 3 32B Think | 65K |
| `arcee-ai/trinity-mini:free` | Arcee AI Trinity Mini | 131K |
| `xiaomi/mimo-v2-flash:free` | Xiaomi MiMo-V2-Flash | 262K |
| `moonshotai/kimi-k2:free` | MoonshotAI Kimi K2 | 262K |
| `kwaipilot/kat-coder-pro:free` | Kwaipilot KAT-Coder-Pro | 256K |
| `alibaba/tongyi-deepresearch-30b-a3b:free` | Tongyi DeepResearch 30B | 131K |
| `nex-agi/deepseek-v3.1-nex-n1:free` | DeepSeek V3.1 Nex N1 | 131K |
| `tngtech/tng-r1t-chimera:free` | TNG R1T Chimera | 163K |
| `tngtech/deepseek-r1t2-chimera:free` | DeepSeek R1T2 Chimera | - |
| `openai/gpt-oss-120b:free` | OpenAI GPT OSS 120B | - |
| `openai/gpt-oss-20b:free` | OpenAI GPT OSS 20B | - |
| `z-ai/glm-4.5-air:free` | Z.AI GLM 4.5 Air | - |
| `cognitivecomputations/dolphin-mistral-24b-venice-edition:free` | Dolphin Mistral 24B | - |

### Premium Models (Popular)

| Model ID | Name | Context | Input $/M | Output $/M |
|----------|------|---------|-----------|------------|
| `openai/gpt-5.2` | OpenAI GPT-5.2 | 400K | $1.75 | $14.00 |
| `openai/gpt-5.2-pro` | OpenAI GPT-5.2 Pro | 400K | $21.00 | $168.00 |
| `openai/gpt-5.1` | OpenAI GPT-5.1 | 400K | $1.25 | $10.00 |
| `openai/o3-deep-research` | OpenAI o3 Deep Research | 200K | $10.00 | $40.00 |
| `anthropic/claude-opus-4.5` | Claude Opus 4.5 | 200K | $5.00 | $25.00 |
| `anthropic/claude-sonnet-4.5` | Claude Sonnet 4.5 | 1M | $3.00 | $15.00 |
| `anthropic/claude-haiku-4.5` | Claude Haiku 4.5 | 200K | $1.00 | $5.00 |
| `google/gemini-3-pro-preview` | Gemini 3 Pro Preview | 1M | $2.00 | $12.00 |
| `google/gemini-3-flash-preview` | Gemini 3 Flash Preview | 1M | $0.50 | $3.00 |
| `google/gemini-2.5-flash` | Gemini 2.5 Flash | 1M | $0.30 | $2.50 |
| `deepseek/deepseek-v3.2` | DeepSeek V3.2 | 163K | $0.22 | $0.32 |
| `x-ai/grok-4-fast` | xAI Grok 4 Fast | 2M | $0.20 | $0.50 |
| `x-ai/grok-4.1-fast` | xAI Grok 4.1 Fast | 2M | $0.20 | $0.50 |
| `qwen/qwen3-max` | Qwen3 Max | 256K | $1.20 | $6.00 |
| `qwen/qwen3-coder-plus` | Qwen3 Coder Plus | 128K | $1.00 | $5.00 |
| `moonshotai/kimi-k2-thinking` | Kimi K2 Thinking | 262K | $0.40 | $1.75 |
| `perplexity/sonar-pro-search` | Perplexity Sonar Pro | 200K | $3.00 | $15.00 |

Source: [OpenRouter Models](https://openrouter.ai/models)

---

## Amazon Bedrock (`@ai-sdk/amazon-bedrock`)

Requires: `AWS_REGION`, `AWS_BEARER_TOKEN_BEDROCK` (or AWS credentials)

### Anthropic Claude

| Model ID | Name | Input | Output |
|----------|------|-------|--------|
| `anthropic.claude-sonnet-4-5-20250929-v1:0` | Claude Sonnet 4.5 | Text, Image | Text |
| `anthropic.claude-opus-4-5-20251101-v1:0` | Claude Opus 4.5 | Text, Image | Text |
| `anthropic.claude-opus-4-1-20250805-v1:0` | Claude Opus 4.1 | Text, Image | Text |
| `anthropic.claude-haiku-4-5-20251001-v1:0` | Claude Haiku 4.5 | Text, Image | Text |
| `anthropic.claude-3-5-haiku-20241022-v1:0` | Claude 3.5 Haiku | Text | Text |
| `anthropic.claude-3-haiku-20240307-v1:0` | Claude 3 Haiku | Text, Image | Text |

### Amazon Nova

| Model ID | Name | Input | Output |
|----------|------|-------|--------|
| `amazon.nova-premier-v1:0` | Nova Premier | Text, Image, Video | Text |
| `amazon.nova-pro-v1:0` | Nova Pro | Text, Image, Video | Text |
| `amazon.nova-lite-v1:0` | Nova Lite | Text, Image, Video | Text |
| `amazon.nova-micro-v1:0` | Nova Micro | Text | Text |
| `amazon.nova-2-lite-v1:0` | Nova 2 Lite | Text, Image, Video | Text |
| `amazon.nova-canvas-v1:0` | Nova Canvas | Text, Image | Image |
| `amazon.nova-reel-v1:0` | Nova Reel | Text, Image | Video |
| `amazon.nova-sonic-v1:0` | Nova Sonic | Speech | Speech, Text |

### Meta Llama

| Model ID | Name | Input | Output |
|----------|------|-------|--------|
| `meta.llama4-maverick-17b-instruct-v1:0` | Llama 4 Maverick 17B | Text, Image | Text |
| `meta.llama4-scout-17b-instruct-v1:0` | Llama 4 Scout 17B | Text, Image | Text |
| `meta.llama3-3-70b-instruct-v1:0` | Llama 3.3 70B | Text | Text |
| `meta.llama3-2-90b-instruct-v1:0` | Llama 3.2 90B | Text, Image | Text |
| `meta.llama3-2-11b-instruct-v1:0` | Llama 3.2 11B | Text, Image | Text |
| `meta.llama3-2-3b-instruct-v1:0` | Llama 3.2 3B | Text | Text |
| `meta.llama3-2-1b-instruct-v1:0` | Llama 3.2 1B | Text | Text |
| `meta.llama3-1-405b-instruct-v1:0` | Llama 3.1 405B | Text | Text |
| `meta.llama3-1-70b-instruct-v1:0` | Llama 3.1 70B | Text | Text |
| `meta.llama3-1-8b-instruct-v1:0` | Llama 3.1 8B | Text | Text |

### DeepSeek

| Model ID | Name | Input | Output |
|----------|------|-------|--------|
| `deepseek.r1-v1:0` | DeepSeek-R1 | Text | Text |
| `deepseek.v3-v1:0` | DeepSeek-V3.1 | Text | Text |

### Mistral AI

| Model ID | Name | Input | Output |
|----------|------|-------|--------|
| `mistral.mistral-large-3-675b-instruct` | Mistral Large 3 | Text, Image | Text |
| `mistral.pixtral-large-2502-v1:0` | Pixtral Large | Text, Image | Text |
| `mistral.magistral-small-2509` | Magistral Small | Text, Image | Text |
| `mistral.ministral-3-14b-instruct` | Ministral 3 14B | Text | Text |
| `mistral.ministral-3-8b-instruct` | Ministral 3 8B | Text | Text |
| `mistral.ministral-3-3b-instruct` | Ministral 3B | Text | Text |
| `mistral.mistral-large-2407-v1:0` | Mistral Large (24.07) | Text | Text |
| `mistral.mixtral-8x7b-instruct-v0:1` | Mixtral 8x7B | Text | Text |

### Qwen

| Model ID | Name | Input | Output |
|----------|------|-------|--------|
| `qwen.qwen3-coder-480b-a35b-v1:0` | Qwen3 Coder 480B | Text | Text |
| `qwen.qwen3-235b-a22b-2507-v1:0` | Qwen3 235B | Text | Text |
| `qwen.qwen3-vl-235b-a22b` | Qwen3 VL 235B | Text, Image | Text |
| `qwen.qwen3-next-80b-a3b` | Qwen3 Next 80B | Text | Text |
| `qwen.qwen3-32b-v1:0` | Qwen3 32B | Text | Text |
| `qwen.qwen3-coder-30b-a3b-v1:0` | Qwen3 Coder 30B | Text | Text |

### Google (via Bedrock)

| Model ID | Name | Input | Output |
|----------|------|-------|--------|
| `google.gemma-3-27b-it` | Gemma 3 27B | Text, Image | Text |
| `google.gemma-3-12b-it` | Gemma 3 12B | Text, Image | Text |
| `google.gemma-3-4b-it` | Gemma 3 4B | Text, Image | Text |

### NVIDIA

| Model ID | Name | Input | Output |
|----------|------|-------|--------|
| `nvidia.nemotron-nano-12b-v2` | Nemotron Nano 12B VL | Text, Image | Text |
| `nvidia.nemotron-nano-9b-v2` | Nemotron Nano 9B | Text | Text |

### Cohere

| Model ID | Name | Input | Output |
|----------|------|-------|--------|
| `cohere.command-r-plus-v1:0` | Command R+ | Text | Text |
| `cohere.command-r-v1:0` | Command R | Text | Text |
| `cohere.embed-v4:0` | Embed v4 | Text, Image | Embedding |
| `cohere.embed-english-v3` | Embed English | Text | Embedding |
| `cohere.embed-multilingual-v3` | Embed Multilingual | Text | Embedding |

### AI21 Labs

| Model ID | Name | Input | Output |
|----------|------|-------|--------|
| `ai21.jamba-1-5-large-v1:0` | Jamba 1.5 Large | Text | Text |
| `ai21.jamba-1-5-mini-v1:0` | Jamba 1.5 Mini | Text | Text |

### Writer

| Model ID | Name | Input | Output |
|----------|------|-------|--------|
| `writer.palmyra-x5-v1:0` | Palmyra X5 | Text | Text |
| `writer.palmyra-x4-v1:0` | Palmyra X4 | Text | Text |

Source: [AWS Bedrock Models](https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html)

---

## Quick Reference

### Default Models in Beddel

| Provider | Default Model |
|----------|---------------|
| `google` | `gemini-1.5-flash` |
| `bedrock` | `anthropic.claude-3-haiku-20240307-v1:0` |
| `openrouter` | `qwen/qwen3-coder:free` |

### YAML Example

```yaml
workflow:
  - id: "chat"
    type: "llm"
    config:
      provider: "openrouter"  # or "google" or "bedrock"
      model: "google/gemini-3-flash-preview"
      stream: true
      messages: "$input.messages"
```

---

*Last updated: December 2025*
