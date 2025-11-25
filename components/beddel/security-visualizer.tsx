"use client";

interface SecurityVisualizerProps {
  securityScore: number;
}

export function SecurityVisualizer({ securityScore }: SecurityVisualizerProps) {
  const securityLevel =
    securityScore >= 9 ? "Máxima" : securityScore >= 7 ? "Alta" : "Moderada";
  const securityColor =
    securityScore >= 9
      ? "text-green-600"
      : securityScore >= 7
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4 bg-muted/50 text-center">
          <div className={`text-3xl font-bold ${securityColor}`}>
            {securityScore}/10
          </div>
          <div className="text-sm text-muted-foreground">Security Score</div>
          <div className={`text-xs font-medium ${securityColor}`}>
            {securityLevel} Segurança
          </div>
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          <h4 className="mb-2 font-medium text-green-600">✅ Protegido</h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• FAILSAFE_SCHEMA ativo</li>
            <li>• Tipos permitidos limitados</li>
            <li>• Sem execução de código</li>
            <li>• Validação UTF-8</li>
          </ul>
        </div>

        <div className="rounded-lg border p-4 bg-muted/50">
          <h4 className="mb-2 font-medium text-green-600">✅ Performance</h4>
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>• Processamento {"<100ms"}</li>
            <li>• Lazy loading otimizado</li>
            <li>• Cache habilitado</li>
            <li>• Streaming suportado</li>
          </ul>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/50 p-4">
        <h4 className="mb-3 font-medium">Como o FAILSAFE_SCHEMA protege:</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-green-600 px-2 py-1 text-xs text-white">
              1
            </span>
            <div>
              <div className="font-medium">Apenas tipos básicos permitidos</div>
              <div className="text-sm text-muted-foreground">
                null, boolean, integer, float, string - nada mais complexo que
                possa ser executado
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="rounded-full bg-green-600 px-2 py-1 text-xs text-white">
              2
            </span>
            <div>
              <div className="font-medium">Tags complexas bloqueadas</div>
              <div className="text-sm text-muted-foreground">
                !!python/object, !!js/function e outras tags perigosas são
                automaticamente rejeitadas
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="rounded-full bg-green-600 px-2 py-1 text-xs text-white">
              3
            </span>
            <div>
              <div className="font-medium">Validação rigorosa</div>
              <div className="text-sm text-muted-foreground">
                Tamanho máximo, profundidade limitada e validação UTF-8 impedem
                overflow
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Está demonstração usa FAILSAFE_SCHEMA do js-yaml, que é o modo mais
          restritivo e seguro disponível para parsing YAML, garantindo que
          nenhum código malicioso possa ser executado.
        </p>
      </div>
    </div>
  );
}
