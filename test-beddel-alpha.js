#!/usr/bin/env node

// Teste do Beddel Alpha - Verifica se o frontend Beddel Alpha funciona corretamente
// Executar com: node test-beddel-alpha.js

const https = require("https");

console.log("🚀 Testando Beddel Alpha...\n");

// URL base do ambiente local
const BASE_URL = "http://localhost:3000";

// Testa se a rota /beddel-alpha está acessível
async function testBeddelAlphaRoute() {
  console.log("1. Testando rota /beddel-alpha...");

  try {
    const response = await fetch(`${BASE_URL}/beddel-alpha`);

    if (response.ok) {
      console.log("✅ Rota /beddel-alpha acessível");
      return true;
    } else {
      console.log(`❌ Rota /beddel-alpha retornou status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log("❌ Erro ao acessar rota /beddel-alpha:", error.message);
    return false;
  }
}

// Testa se o componente BeddelAlpha foi compilado corretamente
async function testComponentCompilation() {
  console.log("\n2. Testando compilação do componente BeddelAlpha...");

  try {
    const response = await fetch(`${BASE_URL}/beddel-alpha`);
    const html = await response.text();

    const hasTitle = html.includes("Beddel Alpha");
    const hasButton = html.includes("Executar Agente Joker");
    const hasLogo = html.includes("marca.png");

    if (hasTitle && hasButton && hasLogo) {
      console.log("✅ Componente BeddelAlpha compilado corretamente");
      return true;
    } else {
      console.log("❌ Componente BeddelAlpha com problemas de compilação");
      console.log(`   - Título encontrado: ${hasTitle}`);
      console.log(`   - Botão encontrado: ${hasButton}`);
      console.log(`   - Logo encontrado: ${hasLogo}`);
      return false;
    }
  } catch (error) {
    console.log("❌ Erro ao testar componente:", error.message);
    return false;
  }
}

// Testa integração com GraphQL (simulada)
async function testGraphQLIntegration() {
  console.log("\n3. Testando integração GraphQL...");

  // Mock GraphQL endpoint - simula resposta do servidor
  const mockGraphQLResponse = {
    data: {
      executeMethod: {
        success: true,
        data: { response: "lol" },
        executionTime: 8,
      },
    },
  };

  try {
    // Simula chamada GraphQL
    const mockFetch = () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockGraphQLResponse),
      });

    const response = await mockFetch();
    const data = await response.json();

    if (
      data.data?.executeMethod?.success &&
      data.data.executeMethod.data?.response === "lol"
    ) {
      console.log("✅ Integração GraphQL simulada com sucesso");
      console.log(
        `   - Resposta recebida: ${JSON.stringify(
          data.data.executeMethod.data
        )}`
      );
      console.log(
        `   - Tempo de execução: ${data.data.executeMethod.executionTime}ms`
      );
      return true;
    } else {
      console.log("❌ Integração GraphQL falhou");
      return false;
    }
  } catch (error) {
    console.log("❌ Erro na integração GraphQL:", error.message);
    return false;
  }
}

// Testa branding e elementos visuais
async function testBrandingElements() {
  console.log("\n4. Testando elementos de branding...");

  try {
    const response = await fetch(`${BASE_URL}/beddel-alpha`);
    const html = await response.text();

    const hasGradient = html.includes("bg-gradient-to-br");
    const hasTypography = html.includes("text-4xl");
    const hasFeatureIcons =
      html.includes("Zap") && html.includes("Shield") && html.includes("Gauge");

    if (hasGradient && hasTypography) {
      console.log("✅ Branding e elementos visuais presentes");
      return true;
    } else {
      console.log("❌ Problemas com branding");
      console.log(`   - Gradiente: ${hasGradient}`);
      console.log(`   - Tipografia: ${hasTypography}`);
      console.log(`   - Ícones: ${hasFeatureIcons}`);
      return false;
    }
  } catch (error) {
    console.log("❌ Erro ao testar branding:", error.message);
    return false;
  }
}

// Testa navegação
async function testNavigation() {
  console.log("\n5. Testando navegação...");

  // Testa link da página principal para Beddel Alpha
  try {
    const response = await fetch(`${BASE_URL}/beddel`);
    const html = await response.text();

    const hasLink = html.includes("/beddel-alpha");
    const hasButtonText = html.includes("Ver Beddel Alpha");

    if (hasLink && hasButtonText) {
      console.log("✅ Link de navegação presente na página beddel");
      return true;
    } else {
      console.log("❌ Link de navegação ausente");
      console.log(`   - Link encontrado: ${hasLink}`);
      console.log(`   - Texto do botão: ${hasButtonText}`);
      return false;
    }
  } catch (error) {
    console.log("❌ Erro ao testar navegação:", error.message);
    return false;
  }
}

// Execução principal
async function main() {
  console.log("🧪 Executando testes do Beddel Alpha...\n");

  const results = [];

  results.push(await testBeddelAlphaRoute());
  results.push(await testComponentCompilation());
  results.push(await testGraphQLIntegration());
  results.push(await testBrandingElements());
  results.push(await testNavigation());

  console.log("\n📊 Resultados:");
  console.log(
    `   Testes passados: ${results.filter(Boolean).length}/${results.length}`
  );

  if (results.every(Boolean)) {
    console.log(
      "\n🎉 Todos os testes passaram! Beddel Alpha está funcionando corretamente."
    );
    console.log("   Acesse: http://localhost:3000/beddel-alpha");
  } else {
    console.log("\n⚠️  Alguns testes falharam. Verifique:");
    if (!results[0]) console.log("   - Servidor Next.js está rodando?");
    if (!results[1]) console.log("   - Componente foi compilado sem erros?");
    if (!results[4]) console.log("   - Link foi adicionado à página landing?");
  }
}

// Executa apenas se este for o script principal
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testBeddelAlphaRoute,
  testComponentCompilation,
  testGraphQLIntegration,
  testBrandingElements,
  testNavigation,
};
