# BMad Markdown Creation Rule

Esta regra define que todos os arquivos markdown devem ser criados usando o padrão BMad via comando `create-doc`.

## 📋 Regra

**OBRIGATÓRIO:** Todos os arquivos `.md` devem ser criados usando:

```bash
*create-doc [template]
```

**NEVER:** Crie arquivos markdown manualmente com `write_to_file` ou `replace_in_file`.

## 🔧 Processo Correto

### 1. Antes de criar qualquer documentação

**Execute sempre primeiro:**
```bash
*create-doc
```

**Isso irá:**
- Listar todos os templates disponíveis em `.bmad-core/templates/`
- Permitir escolha do template correto
- Garantir formato BMad consistente
- Habilitar elicitação quando necessário

### 2. Localização dos Documentos

**Documentação de Histórias:** `docs/stories/`
**Documentação Técnica:** `docs/`
**Arquitetura:** `docs/architecture/`

**NEVER crie markdowns fora desses locais sem confirmação.**

### 3. Templates BMad Disponíveis

Execute `*create-doc` sem parâmetros para ver todos os templates:
- story-tmpl.yaml
- prd-tmpl.yaml  
- architecture-tmpl.yaml
- project-brief-tmpl.yaml
- E muitos outros...

### 4. Se criar documentação manualmente → VIOLAÇÃO

**❌ VIOLAÇÕES DO PADRÃO BMAD:**
- Criar arquivos `.md` com `write_to_file` diretamente
- Usar `replace_in_file` para criar documentação
- Criar markdowns fora da estrutura `docs/`
- Não usar o workflow `create-doc`

### 5. Justificativa

**Por que usar `create-doc`?**
- ✅ Garante consistência com padrão BMad
- ✅ Ativa elicitação quando necessário (`elicit: true`)
- ✅ Usa templates YAML validados
- ✅ Mantém documentação no formato correto
- ✅ Permite versioning e rastreamento

## 📋 Verificação

Antes de criar documentação, **SEMPRE** pergunte:
- "Devo usar create-doc com qual template?"
- Onde esta documentação deve ficar?
- Qual o objetivo desta documentação?

## 🎯 Exemplo Correto

**Em vez de:**
```bash
write_to_file:
  path: docs/minha-doc.md
  content: "# Meu Documento"
```

**Use:**
```bash
*create-doc
# Depois selecione o template apropriado
```

---
*Esta regra garante que todos os documentos sigam o padrão BMad-Method*
