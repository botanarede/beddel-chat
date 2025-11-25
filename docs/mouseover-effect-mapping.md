# Mapeamento: Efeito Mouseover no Topo (Faixa Branca com Logomarca Beddel)

## Situação Atual

O componente do topo está localizado em `app/page.tsx` (linhas 142-157) e possui:

1. **Faixa branca**: `bg-white/95` com sombra
2. **Efeito hover atual**: Gradiente fixo horizontal que aparece no hover (`group-hover:opacity-100`)
3. **Problema**: O gradiente não acompanha o movimento do ponteiro do mouse

## O Que Precisa Ser Implementado

### 1. Rastreamento da Posição do Mouse

**Necessário:**
- Adicionar estado React para armazenar coordenadas X e Y do mouse
- Implementar handler `onMouseMove` na seção do banner
- Calcular posição relativa do mouse dentro do elemento (usando `getBoundingClientRect()`)

**Código necessário:**
```typescript
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  setMousePosition({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  });
};
```

### 2. Gradiente Radial Seguindo o Mouse

**Necessário:**
- Substituir o gradiente linear fixo (`bg-gradient-to-r`) por um gradiente radial
- Posicionar o gradiente na posição do mouse usando `background-position` ou `mask-image`
- Usar CSS custom properties (variáveis CSS) para atualizar a posição dinamicamente

**Abordagem recomendada:**
- Usar `radial-gradient` com posição dinâmica via `style` prop
- Ou usar `mask-image` com `radial-gradient` para criar efeito de spotlight

### 3. Degradê que Contraste com o Background

**Background atual:** `bg-slate-950` (muito escuro - quase preto)

**Opções de degradê que contrastam bem:**
1. **Emerald/Verde claro** (já usado, mas pode ser intensificado):
   - `from-emerald-300/60 via-emerald-200/40 to-emerald-300/60`
   
2. **Azul/Cyan** (contraste forte):
   - `from-cyan-300/60 via-blue-200/40 to-cyan-300/60`
   
3. **Roxo/Violeta** (contraste visual interessante):
   - `from-purple-300/60 via-violet-200/40 to-purple-300/60`

4. **Amarelo/Dourado** (máximo contraste):
   - `from-yellow-300/60 via-amber-200/40 to-yellow-300/60`

**Recomendação:** Usar gradiente emerald/verde (mantém identidade visual) mas com maior opacidade e raio maior.

### 4. Implementação Técnica

**Estrutura do componente:**

```tsx
<section
  className="relative isolate mt-6 w-full bg-white/95 px-6 py-8 shadow-[0_35px_120px_rgba(15,23,42,0.35)] transition-shadow duration-500"
  aria-label="Beddel identity banner"
  onMouseMove={handleMouseMove}
  onMouseLeave={() => setMousePosition({ x: 0, y: 0 })}
>
  {/* Gradiente radial que segue o mouse */}
  <div
    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
    style={{
      background: `radial-gradient(circle 300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(16, 185, 129, 0.4), rgba(16, 185, 129, 0.2), transparent 70%)`,
      opacity: mousePosition.x > 0 && mousePosition.y > 0 ? 1 : 0,
    }}
  />
  
  {/* Conteúdo (logo) */}
  <div className="mx-auto flex max-w-[1400px] items-center justify-center relative z-10">
    {/* Logo */}
  </div>
</section>
```

### 5. Melhorias de Performance

**Considerações:**
- Usar `requestAnimationFrame` para throttling do `onMouseMove` (opcional, mas recomendado para performance)
- Adicionar `will-change: transform` ou `will-change: opacity` para otimização de GPU
- Considerar usar `useCallback` para o handler se necessário

### 6. Ajustes de Design

**Parâmetros ajustáveis:**
- **Raio do gradiente**: `300px` (pode ser aumentado para efeito mais suave)
- **Opacidade**: `0.4` no centro, `0.2` no meio, `transparent` nas bordas
- **Cores**: Emerald (`rgba(16, 185, 129, ...)`) - pode ser alterado conforme preferência
- **Transição**: `duration-300` para suavidade

## Resumo das Alterações Necessárias

1. ✅ Adicionar estado `mousePosition` com `useState`
2. ✅ Criar handler `handleMouseMove` com cálculo de posição relativa
3. ✅ Adicionar `onMouseMove` e `onMouseLeave` na seção
4. ✅ Substituir gradiente fixo por gradiente radial dinâmico
5. ✅ Aplicar estilo inline com posição do mouse
6. ✅ Ajustar cores do degradê para melhor contraste com `bg-slate-950`
7. ✅ Testar performance e ajustar raio/opacidade conforme necessário

## Arquivos a Modificar

- `app/page.tsx` (linhas 84-157 aproximadamente)

## Notas de Implementação

- O efeito deve desaparecer suavemente quando o mouse sair da área (`onMouseLeave`)
- O gradiente deve ter transição suave para não parecer "saltar"
- Manter acessibilidade: não remover `aria-label`
- Garantir que o logo permaneça visível acima do efeito (`z-10`)

