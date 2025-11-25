"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ParserDemo } from "./parser-demo";
import { PerformanceMetrics } from "./performance-metrics";
import { SecurityVisualizer } from "./security-visualizer";

export function BeddelLandingPage() {
  const [lastParseTime, setLastParseTime] = useState<number>(0);
  const [securityScore, setSecurityScore] = useState<number>(9.3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            Beddel Secure YAML Parser
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Demonstração interativa do nosso parser YAML com FAILSAFE_SCHEMA e
            segurança máxima
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/beddel-admin">
              <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                👑 Beddel Admin - Sem API Key
              </Button>
            </Link>
            <Link href="/beddel-alpha">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                🚀 Beddel Alpha com Runtime Real
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Parser Interativo</CardTitle>
              <CardDescription>
                Teste nosso parser YAML seguro sem execução dinâmica de código
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ParserDemo
                onParseComplete={(time) => setLastParseTime(time)}
                onSecurityCheck={(score) => setSecurityScore(score)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métricas de Performance</CardTitle>
              <CardDescription>
                Tempo de execução e análise de segurança do parsing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PerformanceMetrics
                lastParseTime={lastParseTime}
                securityScore={securityScore}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visualização de Segurança</CardTitle>
            <CardDescription>
              Como nosso FAILSAFE_SCHEMA protege contra código malicioso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecurityVisualizer securityScore={securityScore} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
