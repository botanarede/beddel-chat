---
id: translator-agent-mapping
version: v1
created: 2025-11-04
type: architecture
category: agent-design
tags: [translator, genkit, behaviors, beddel, public-agent]
status: draft
---

# Mapeamento do Agente Tradutor Beddel com Genkit

## Visão Geral

Este documento detalha o mapeamento dos behaviors e estrutura do agente "tradutor", o primeiro agente público da plataforma Beddel que utilizará o Genkit para funcionalidade de tradução, análogo ao endpoint `/api/graphql` existente.

## 1. Definição do Agente Tradutor (YAML Declarativo)

### Estrutura do Agente: `translator-agent.yaml`

```yaml
# Agent Definition: translator-agent.yaml
id: translator-agent
version: 1.0.0
protocol: beddel-agent-v1

metadata:
  name: "Tradutor Universal"
  category: public-agent
  description: "Agente público para tradução de textos usando Genkit"
  author: "Beddel Platform"
  tags: [translator, genkit, public, multilingual]

schema:
  input:
    type: object
    properties:
      texto:
        type: string
        description: "Texto a ser traduzido"
        minLength: 1
        maxLength: 10000
      idioma_origem:
        type: string
        description: "Código ISO do idioma de origem (ex: pt, en, es, fr)"
        pattern: "^[a-z]{2}$"
      idioma_destino:
        type: string
        description: "Código ISO do idioma de destino"
        pattern: "^[a-z]{2}$"
    required: [texto, idioma_origem, idioma_destino]

  output:
    type: object
    properties:
      texto_traduzido:
        type: string
        description: "Texto traduzido"
      metadados:
        type: object
        properties:
          modelo_utilizado:
            type: string
            description: "Modelo de IA utilizado"
          tempo_processamento:
            type: number
            description: "Tempo de processamento em milissegundos"
          confianca:
            type: number
            description: "Nível de confiança da tradução (0-1)"
          idiomas_suportados:
            type: array
            items:
              type: string
            description: "Lista de idiomas suportados"

logic:
  type: sequence
  behaviors:
    - name: validate-input
      type: validation
      config:
        schema: input
        strict: true

    - name: detect-language-behavior
      type: language-detection
      config:
        fallback: true
        confidence_threshold: 0.8

    - name: genkit-translate-behavior
      type: genkit-translation
      config:
        model: "google-ai-translation"
        cache_ttl: 3600
        fallback_model: "openai-gpt-4"

    - name: format-output-behavior
      type: output-formatter
      config:
        include_metadata: true
        validate_output: true

    - name: audit-behavior
      type: audit-trail
      config:
        log_level: info
        include_request: true
        include_response: true
```

## 2. Identificação dos Behaviors Necessários

### 2.1 validate-input-behavior

**Finalidade:** Validação estrita dos dados de entrada contra o schema definido
**Inputs:** Objeto de entrada do usuário
**Outputs:** Objeto validado ou erro de validação
**Integração:** Usa o validador de schema Beddel com sandbox

### 2.2 detect-language-behavior

**Finalidade:** Detecção automática de idioma quando não especificado
**Inputs:** Texto, idioma_origem (opcional)
**Outputs:** idioma_origem detectado, confiança da detecção
**Config:** Fallback para detecção manual se confiança < 0.8

### 2.3 genkit-translate-behavior (Behavior Principal)

**Finalidade:** Realizar tradução usando Genkit
**Inputs:** texto, idioma_origem, idioma_destino
**Outputs:** texto_traduzido, metadados do processo
**Integração Genkit:**

- Chama API Genkit via endpoint interno
- Suporta múltiplos modelos (Google AI, OpenAI)
- Implementa cache para traduções repetidas
- Fallback entre modelos

### 2.4 format-output-behavior

**Finalidade:** Formatação e validação da resposta
**Inputs:** texto_traduzido, metadados brutos
**Outputs:** Objeto formatado com metadados enriquecidos
**Features:** Validação contra schema de saída, enriquecimento de metadados

### 2.5 audit-behavior

**Finalidade:** Auditoria e logging do processo
**Inputs:** Requisição completa, resposta, tempo de processo
**Outputs:** Log de auditoria
**Config:** Nível de log configurável, inclui/exclui dados sensíveis

## 3. Integração com Genkit (Server-Side)

### Arquitetura de Integração

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cliente HTTP  │───▶│  Beddel Runtime  │───▶│  Genkit Service │
│                 │◀───│                  │◀───│                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │ Behaviors Chain  │
                       │  (Validation →   │
                       │   Translation →  │
                       │   Formatting)  │
                       └──────────────────┘
```

### Fluxo de Execução

1. **Recepção:** Runtime Beddel recebe requisição no endpoint `/api/agents/translator`
2. **Validação:** Behavior `validate-input` valida schema e permissões
3. **Orquestração:** Runtime carrega definição YAML do agente
4. **Execução Sequencial:** Executa behaviors em sequência lógica
5. **Integração Genkit:** Behavior `genkit-translate-behavior` faz chamada HTTP ao Genkit
6. **Formatação:** Behavior `format-output-behavior` prepara resposta
7. **Auditoria:** Behavior `audit-behavior` registra trilha de auditoria
8. **Resposta:** Runtime retorna resposta formatada ao cliente

### Configuração de Chamada Genkit

```yaml
genkit_config:
  endpoint: "${GENKIT_INTERNAL_ENDPOINT}/translate"
  authentication:
    type: service-account
    credentials: "${GENKIT_CREDENTIALS_PATH}"
  timeout: 30000ms
  retry:
    max_attempts: 3
    backoff: exponential
  cache:
    type: redis
    ttl: 3600s
    key_prefix: "beddel:translator:"
```

## 4. Considerações de Segurança e Performance

### Segurança

**Sandbox Isolado:** Cada execução roda em sandbox Node.js isolado
**Validação de Schema:** Validação estrita antes de processar
**Sanitização:** Limpeza de inputs/outputs para prevenir injeção
**Rate Limiting:** Limites por tenant/cliente
**Criptografia:** Textos sensíveis criptografados em cache
**Auditoria:** Logs completos de acesso e uso

### Performance

**Cache Hierárquico:** Redis + memória local
**Pooling de Conexões:** Pool reutilizável para Genkit
**Stream Processing:** Suporte a streaming para textos grandes
**Timeout Configurável:** Limites de tempo adaptativos
**Load Balancing:** Distribuição de carga entre instâncias Genkit
**Métricas:** Monitoramento de latência, throughput, erros

### Métricas de Monitoramento

- **Latência média:** < 500ms para traduções simples
- **Taxa de acerto cache:** > 60% para aplicações típicas
- **Disponibilidade:** > 99.9% meta de uptime
- **Tempo de resposta P95:** < 2s para textos de até 5K caracteres
- **Taxa de erros:** < 1% para traduções válidas

## 5. Estrutura de Deployment

### Configuração de Ambiente

```yaml
# config/translator-agent.env
GENKIT_INTERNAL_ENDPOINT=https://genkit.beddel.internal
GENKIT_CREDENTIALS_PATH=/secure/genkit-service-account.json
REDIS_CACHE_URL=redis://cache-cluster.beddel.internal:6379
TRANSLATOR_LOG_LEVEL=info
TRANSLATOR_RATE_LIMIT=100/minute
TRANSLATOR_MAX_TEXT_LENGTH=10000
```

### Arquivos de Configuração

- `agents/translator-agent.yaml` - Definição do agente
- `behaviors/genkit-translate-behavior.js` - Behavior de tradução
- `config/translator-agent.env` - Variáveis de ambiente
- `tests/translator-agent.test.js` - Suite de testes

## Conclusão

Este mapeamento fornece uma base arquitetural sólida para implementar o agente tradutor Beddel com integração Genkit, mantendo os princípios de segurança, performance e governança da plataforma Beddel.

O agente tradutor será o primeiro agente público da plataforma, servindo como modelo para futuros agentes Beddel que requerem integração com serviços externos de IA.
