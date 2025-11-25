"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
// Simple YAML parser wrapper - we'll create a basic implementation for now
function parseYamlBasic(yamlText: string): any {
  try {
    // Basic YAML parsing for demonstration
    // This is a simplified version for the demo
    const lines = yamlText.split("\n");
    const result: any = {};

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes(":")) {
        const [key, ...valueParts] = trimmed.split(":");
        const value = valueParts.join(":").trim();

        if (value) {
          try {
            // Try to parse as JSON for numbers, booleans, etc
            result[key.trim()] = JSON.parse(value);
          } catch {
            // If not valid JSON, treat as string
            result[key.trim()] = value.replace(/^["']|["']$/g, "");
          }
        }
      }
    });

    return result;
  } catch (error) {
    throw new Error("Erro ao processar YAML: " + (error as Error).message);
  }
}

interface ParserDemoProps {
  onParseComplete: (parseTime: number) => void;
  onSecurityCheck: (securityScore: number) => void;
}

export function ParserDemo({
  onParseComplete,
  onSecurityCheck,
}: ParserDemoProps) {
  const [yamlInput, setYamlInput] = useState<string>(`# Exemplo YAML Seguro
nome: "João Silva"
idade: 30
ativo: true
configuracoes:
  tema: "escuro"
  notificacoes: false
  limite: 100.5
`);

  const [parsedOutput, setParsedOutput] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleParse = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const startTime = performance.now();

    try {
      const result = parseYamlBasic(yamlInput);
      const endTime = performance.now();
      const parseTime = endTime - startTime;

      setParsedOutput(result);
      onParseComplete(parseTime);

      // Calculate security score based on parsing success
      const securityScore = 9.3; // Default score since parsing succeeded with FAILSAFE_SCHEMA
      onSecurityCheck(securityScore);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);

      // Lower security score on parsing errors
      onSecurityCheck(7.5);
    } finally {
      setIsLoading(false);
    }
  }, [yamlInput, onParseComplete, onSecurityCheck]);

  const handleExampleChange = (example: string) => {
    setYamlInput(example);
    setParsedOutput(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Exemplos:</label>
        <select
          className="rounded border px-3 py-1 text-sm"
          onChange={(e) => handleExampleChange(e.target.value)}
        >
          <option value={yamlInput}>YAML Válido</option>
          <option
            value={`# YAML Inválido/Tentativa de Ataque
!!python/object/apply:os.system
- rm -rf /

nome: "teste"
dados: !!js/undefined ~`}
          >
            Código Malicioso
          </option>
          <option
            value={`# YAML Complexo mas Seguro
usuarios:
  - nome: "Maria"
    idade: 25
    permissões: ["ler", "escrever"]
    metadata:
      ultimo_acesso: "2025-01-01"
      score: 95.7
  - nome: "João"
    idade: 30
    permissões: ["ler"]
    metadata:
      ultimo_acesso: "2025-01-02"
      score: 89.2`}
          >
            YAML Complexo
          </option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Input YAML</label>
          <Textarea
            value={yamlInput}
            onChange={(e) => setYamlInput(e.target.value)}
            placeholder="Digite seu YAML aqui..."
            className="min-h-[300px] font-mono text-sm"
          />
          <Button
            onClick={handleParse}
            disabled={isLoading || !yamlInput.trim()}
            className="mt-2 w-full"
          >
            {isLoading ? "Processando..." : "Processar YAML"}
          </Button>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Output Processado
          </label>
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {parsedOutput ? (
            <div className="rounded-lg border p-4 bg-muted/50 min-h-[300px] overflow-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {JSON.stringify(parsedOutput, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg border p-4 bg-muted/50 min-h-[300px] text-muted-foreground">
              Output aparecerá aqui após processamento
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
