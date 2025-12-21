# Chat Agent Workflow Flow

> RAG Pipeline + Simple Chat Mode

```
                                    ┌─────────────┐
                                    │   START     │
                                    └──────┬──────┘
                                           │
                                           ▼
                              ┌────────────────────────┐
                              │  Receive Input         │
                              │  - messages[]          │
                              │  - query (optional)    │
                              │  - mode: 'rag'|'simple'│
                              │  - knowledge_sources   │
                              └───────────┬────────────┘
                                          │
                                          ▼
                         ┌─────────────────────────────────┐
                         │  STEP 1: Extract Query          │
                         │  type: output-generator         │
                         │  ─────────────────────────────  │
                         │  • Find last user message       │
                         │  • Use query param if provided  │
                         └─────────────┬───────────────────┘
                                       │
                                       ▼
                              ┌────────────────┐
                              │  Query found?  │
                              └───────┬────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │ NO                               │ YES
                    ▼                                  ▼
        ┌───────────────────┐            ┌─────────────────────────────────┐
        │  ERROR:           │            │  STEP 2: Mode Check             │
        │  "No query found" │            │  type: conditional              │
        └───────────────────┘            │  condition: mode == 'simple'    │
                                         └─────────────┬───────────────────┘
                                                       │
                          ┌────────────────────────────┴────────────────────────────┐
                          │                                                        │
                          │ mode == 'simple'                          mode == 'rag' (default)
                          ▼                                                        ▼
    ┌─────────────────────────────────────┐          ┌─────────────────────────────────────┐
    │  SIMPLE CHAT PATH                   │          │  RAG PIPELINE PATH                  │
    │  (Direct LLM with history)          │          │  (Full knowledge base flow)         │
    └─────────────────┬───────────────────┘          └─────────────────┬───────────────────┘
                      │                                                │
                      ▼                                                ▼
    ┌─────────────────────────────────────┐          ┌─────────────────────────────────────┐
    │  STEP 2a: Simple Chat               │          │  STEP 2b: Vectorize Query           │
    │  type: rag (mode: simple)           │          │  type: gemini-vectorize             │
    │  ─────────────────────────────────  │          │  action: embedSingle                │
    │  • query: user query                │          │  ─────────────────────────────────  │
    │  • history: conversation messages   │          │  • Input: user query text           │
    │  • No documents required            │          │  • Output: queryVector[]            │
    │  • temperature: 0.7 (creative)      │          │  • Model: text-embedding-004        │
    │  • Model: gemini-2.0-flash-exp      │          └─────────────────┬───────────────────┘
    └─────────────────┬───────────────────┘                            │
                      │                                                ▼
                      │                                       ┌────────────────────┐
                      │                                       │ Vectorization OK?  │
                      │                                       └────────┬───────────┘
                      │                                                │
                      │                       ┌────────────────────────┴────────────────────┐
                      │                       │ NO                                         │ YES
                      │                       ▼                                            ▼
                      │           ┌───────────────────┐          ┌─────────────────────────────────┐
                      │           │  ERROR:           │          │  STEP 3b: Check Knowledge Base  │
                      │           │  "Vectorization   │          │  type: chromadb                 │
                      │           │   failed"         │          │  action: hasData                │
                      │           └───────────────────┘          │  ─────────────────────────────  │
                      │                                          │  • collection: beddel_knowledge │
                      │                                          │  • min_count: 5                 │
                      │                                          └─────────────┬───────────────────┘
                      │                                                        │
                      │                                                        ▼
                      │                                          ┌─────────────────────────────────┐
                      │                                          │  STEP 4b: Search Knowledge Base │
                      │                                          │  type: chromadb                 │
                      │                                          │  action: search                 │
                      │                                          │  ─────────────────────────────  │
                      │                                          │  • collection: beddel_knowledge │
                      │                                          │  • query_vector: queryVector    │
                      │                                          │  • limit: 5                     │
                      │                                          └─────────────┬───────────────────┘
                      │                                                        │
                      │                                                        ▼
                      │                                               ┌────────────────────┐
                      │                                               │ Documents found?   │
                      │                                               └────────┬───────────┘
                      │                                                        │
                      │                       ┌────────────────────────────────┴────────────────────────────┐
                      │                       │ NO (Empty KB)                                              │ YES
                      │                       ▼                                                            ▼
                      │     ┌─────────────────────────────────────┐          ┌─────────────────────────────────────┐
                      │     │  STEP 5b-i: RAG (Fallback Mode)     │          │  STEP 5b-ii: RAG (With Context)     │
                      │     │  type: rag (mode: rag)              │          │  type: rag (mode: rag)              │
                      │     │  ─────────────────────────────────  │          │  ─────────────────────────────────  │
                      │     │  • query: user query                │          │  • query: user query                │
                      │     │  • documents: "No docs, use         │          │  • documents: searchResult.docs     │
                      │     │    general knowledge"               │          │  • history: input.messages          │
                      │     │  • history: input.messages          │          │  • temperature: 0.3 (precise)       │
                      │     │  • temperature: 0.3                 │          │  • Model: gemini-2.0-flash-exp      │
                      │     └─────────────────┬───────────────────┘          └─────────────────┬───────────────────┘
                      │                       │                                                │
                      │                       └────────────────────┬───────────────────────────┘
                      │                                            │
                      └────────────────────────────────────────────┤
                                                                   │
                                                                   ▼
                                             ┌─────────────────────────────────┐
                                             │  STEP 3: Deliver Response       │
                                             │  type: output-generator         │
                                             │  ─────────────────────────────  │
                                             │  Build final response:          │
                                             │  • response: ragResult.response │
                                             │  • timestamp: ISO string        │
                                             │  • execution_steps: [...]       │
                                             │  • total_duration: ms           │
                                             └─────────────────┬───────────────┘
                                                               │
                                                               ▼
                                                        ┌─────────────┐
                                                        │    END      │
                                                        └─────────────┘
```

## Legend

| Symbol | Description |
|--------|-------------|
| `simple` | Direct LLM chat (1 step) - conversation history only |
| `rag` | Full RAG pipeline (4 steps) - vectorize → check → search → generate |

## Conditional Paths

1. **Query validation** → Error if no query found
2. **Mode selection** → Simple (direct) or RAG (full pipeline)
3. **Vectorization (RAG)** → Error if embedding fails
4. **Knowledge base (RAG)** → Fallback to general knowledge if empty

## Execution Comparison

| Aspect | Simple Mode | RAG Mode |
|--------|-------------|----------|
| Steps | 1 | 4-5 |
| Latency | ~500ms | ~2-3s |
| Context | Conversation only | Knowledge base + Conversation |
| Use case | General chat | Domain-specific Q&A |
| Temperature | 0.7 (creative) | 0.3 (precise) |
