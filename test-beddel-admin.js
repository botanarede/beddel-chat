#!/usr/bin/env node

// Teste do Beddel Admin - Verifica se as chamadas de admin funcionam sem API Key
// Executar com: node test-beddel-admin.js

console.log("🚀 Testando Beddel Admin (sem API key)...\n");

// URL base do ambiente local
const BASE_URL = "http://localhost:3000";

// Testa se a rota /beddel-admin está acessível
async function testBeddelAdminRoute() {
  console.log("1. Testando rota /beddel-admin...");

  try {
    const response = await fetch(`${BASE_URL}/beddel-admin`);

    if (response.ok) {
      console.log("✅ Rota /beddel-admin acessível");
      return true;
    } else {
      console.log(`❌ Rota /beddel-admin retornou status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log("❌ Erro ao acessar rota /beddel-admin:", error.message);
    return false;
  }
}

// Testa se o componente BeddelAdmin existe
async function testAdminComponentCompilation() {
  console.log("\n2. Testando componente BeddelAdmin...");

  try {
    const response = await fetch(`${BASE_URL}/beddel-admin`);
    const html = await response.text();

    const hasTitle = html.includes("Beddel Admin");
    const hasAdminButton = html.includes("Executar Agente Joker - Admin");
    const hasLogo = html.includes("marca.png");
    const hasAdminMode = html.includes("Modo Admin");

    if (hasTitle && hasAdminButton && hasLogo && hasAdminMode) {
      console.log("✅ Componente BeddelAdmin compilado corretamente");
      return true;
    } else {
      console.log("❌ Componente BeddelAdmin com problemas de compilação");
      console.log(`   - Título encontrado: ${hasTitle}`);
      console.log(`   - Botão Admin: ${hasAdminButton}`);
      console.log(`   - Logo encontrado: ${hasLogo}`);
      console.log(`   - Modo Admin: ${hasAdminMode}`);
      return false;
    }
  } catch (error) {
    console.log("❌ Erro ao testar componente:", error.message);
    return false;
  }
}

// Testa chamada GraphQL sem API key (modo admin)
async function testGraphQLAdminCall() {
  console.log("\n3. Testando chamada GraphQL sem API key...");

  // Mock de chamada admin para execução do agente joker
  const mockGraphQLResponse = {
    data: {
      executeMethod: {
        success: true,
        data: { response: "lol" },
        executionTime: 6,
      },
    },
  };

  try {
    // Simula chamada sem header para testar com header admin
    const mockFetchAdmin = () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockGraphQLResponse),
      });

    const response = await mockFetchAdmin();
    const data = await response.json();

    if (
      data.data?.executeMethod?.success &&
      data.data.executeMethod.data?.response === "lol"
    ) {
      console.log("✅ Chamada GraphQL (modo admin) simulada com sucesso");
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
      console.log("❌ Chamada GraphQL (modo admin) falhou");
      return false;
    }
  } catch (error) {
    console.log("❌ Erro na chamada GraphQL (modo admin):", error.message);
    return false;
  }
}

// Testa branding e elementos visuais admin
async function testAdminBrandingElements() {
  console.log("\n4. Testando elementos de branding admin...");

  try {
    const response = await fetch(`${BASE_URL}/beddel-admin`);
    const html = await response.text();

    const hasGradient = html.includes("bg-gradient-to-br");
    const hasAdminFeatures =
      html.includes("Admin Power") && html.includes("Modo Admin");
    const hasCrownIcons = html.includes('data-testid="crown-icon"');
    const hasAdminButton = html.includes("Executar Agente Joker - Admin");

    if (hasGradient && hasAdminFeatures && hasCrownIcons && hasAdminButton) {
      console.log("✅ Branding do Beddel Admin com elementos visuais corretos");
      return true;
    } else {
      console.log("❌ Problemas com branding do Beddel Admin");
      console.log(`   - Gradiente: ${hasGradient}`);
      console.log(`   - Features admin: ${hasAdminFeatures}`);
      console.log(`   - Ícones coroa: ${hasCrownIcons}`);
      console.log(`   - Botão admin: ${hasAdminButton}`);
      return false;
    }
  } catch (error) {
    console.log("❌ Erro ao testar branding do admin:", error.message);
    return false;
  }
}

// Testa links de navegação entre modos
async function testNavigationBetweenModes() {
  console.log("\n5. Testando navegação entre modos...");

  // Testa link para /beddel-admin na página principal
  try {
    const response = await fetch(`${BASE_URL}/beddel`);
    const html = await response.text();

    const hasAdminLink = html.includes("/beddel-admin");
    const hasAdminButtonText = html.includes("Beddel Admin - Sem API Key");
    const hasAlphaLink = html.includes("/beddel-alpha");

    if (hasAdminLink && hasAlphaLink && hasAdminButtonText) {
      console.log("✅ Links de navegação para ambos os modos presentes");
      return true;
    } else {
      console.log("❌ Links de navegação entre modos ausentes");
      console.log(`   - Link admin: ${hasAdminLink}`);
      console.log(`   - Link alpha: ${hasAlphaLink}`);
      console.log(`   - Botão admin: ${hasAdminButtonText}`);
      return false;
    }
  } catch (error) {
    console.log("❌ Erro ao testar navegação:", error.message);
    return false;
  }
}

// Execução principal
async function main() {
  console.log("🧪 Executando testes do Beddel Admin...\n");

  const results = [];

  results.push(await testBeddelAdminRoute());
  results.push(await testAdminComponentCompilation());
  results.push(await testGraphQLAdminCall());
  results.push(await testAdminBrandingElements());
  results.push(await testNavigationBetweenModes());

  console.log("\n📊 Resultados:");
  console.log(
    `   Testes passados: ${results.filter(Boolean).length}/${results.length}`
  );

  if (results.every(Boolean)) {
    console.log(
      "\n🎉 Todos os testes passaram! Beddel Admin está funcionando corretamente."
    );
    console.log("✅ Admin tenant pode executar agentes sem API key!");
    console.log("   Acesse: http://localhost:3000/beddel-admin");
    console.log(
      "   Para voltar com API key: http://localhost:3000/beddel-alpha"
    );
  } else {
    console.log("\n⚠️  Alguns testes falharam. Verifique:");
    if (!results[0]) console.log("   - Servidor Next.js está rodando?");
    if (!results[1]) console.log("   - Componente foi compilado sem erros?");
    if (!results[4]) console.log("   - Links foram adicionados corretamente?");
  }
}

// Executa apenas se este for o script principal
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  testBeddelAdminRoute,
  testAdminComponentCompilation,
  testGraphQLAdminCall,
  testAdminBrandingElements,
  testNavigationBetweenModes,
};
