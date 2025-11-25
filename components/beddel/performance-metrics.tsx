"use client";

interface PerformanceMetricsProps {
  lastParseTime: number;
  securityScore: number;
}

export function PerformanceMetrics({
  lastParseTime,
  securityScore,
}: PerformanceMetricsProps) {
  const throughput = lastParseTime > 0 ? Math.round(1000 / lastParseTime) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border p-3 bg-muted/50">
          <div className="text-2xl font-bold text-green-600">
            {lastParseTime.toFixed(1)}ms
          </div>
          <div className="text-sm text-muted-foreground">
            Tempo de Processamento
          </div>
        </div>

        <div className="rounded-lg border p-3 bg-muted/50">
          <div className="text-2xl font-bold text-blue-600">{throughput}</div>
          <div className="text-sm text-muted-foreground">docs/segundo</div>
        </div>
      </div>

      <div className="rounded-lg border p-3 bg-muted/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Security Score</span>
          <span className="text-2xl font-bold text-green-600">
            {securityScore}/10
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-green-600 transition-all duration-300"
            style={{ width: `${(securityScore / 10) * 100}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          FAILSAFE_SCHEMA ativo - segurança máxima
        </div>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>✅ Processamento em menos de 100ms</p>
        <p>✅ FAILSAFE_SCHEMA protege contra ataques</p>
        <p>✅ Validador UTF-8 integrado</p>
      </div>
    </div>
  );
}
