#!/usr/bin/env node

/**
 * Simple test for Joker Agent - bypass authentication for testing
 */

const GRAPHQL_ENDPOINT = "http://localhost:3000/api/graphql";

async function testGraphQLHealth() {
  console.log("🔍 Testing GraphQL endpoint health...");

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "text/html",
      },
    });

    if (response.ok) {
      console.log("✅ GraphQL endpoint is accessible");
      return true;
    } else {
      console.log(`❌ GraphQL endpoint returned ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error("❌ GraphQL endpoint not accessible:", error.message);
    return false;
  }
}

async function testJokerAgentDirect() {
  console.log("\n🃏 Testing Joker Agent directly...");
  console.log("=====================================");

  try {
    // Let's test the agent registry directly first
    const { agentRegistry } = require("beddel/server");

    console.log(
      "Available agents:",
      agentRegistry.getAllAgents().map((a) => a.name)
    );

    // Test if joker.execute is registered
    const jokerAgent = agentRegistry.getAgent("joker.execute");
    if (jokerAgent) {
      console.log("✅ Joker Agent found in registry");
      console.log("   Name:", jokerAgent.name);
      console.log("   Protocol:", jokerAgent.protocol);
      console.log("   Route:", jokerAgent.route);
      console.log("   Required Props:", jokerAgent.requiredProps);
    } else {
      console.log("❌ Joker Agent not found in registry");

      // Check what agents are available
      const allAgents = agentRegistry.getAllAgents();
      if (allAgents.length === 0) {
        console.log(
          "⚠️  No agents are registered - initialization may have failed"
        );
      } else {
        console.log(
          "Available agents:",
          allAgents.map((a) => a.name)
        );
      }
      return false;
    }

    // Test YAML parsing
    const yaml = require("js-yaml");
    try {
      const agentDefinition = yaml.load(jokerAgent.yamlContent);
      console.log("✅ YAML parsing successful");
      console.log("   Agent ID:", agentDefinition.agent.id);
      console.log("   Variables:", agentDefinition.logic.variables);
      console.log("   Workflow steps:", agentDefinition.logic.workflow.length);
    } catch (yamlError) {
      console.log("❌ YAML parsing failed:", yamlError.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ Direct test failed:", error.message);
    console.error("Stack:", error.stack);
    return false;
  }
}

async function testGraphQLIntegration() {
  console.log("\n🚀 Testing GraphQL integration...");
  console.log("=================================");

  try {
    const query = `
      query {
        ping
      }
    `;

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.data && result.data.ping) {
        console.log("✅ GraphQL ping successful:", result.data.ping);
        return true;
      } else {
        console.log("❌ GraphQL ping failed:", result);
        return false;
      }
    } else {
      console.log(
        `❌ GraphQL request failed: ${response.status} ${response.statusText}`
      );
      return false;
    }
  } catch (error) {
    console.error("❌ GraphQL test failed:", error.message);
    return false;
  }
}

async function runAllTests() {
  console.log("🧪 Joker Agent Integration Tests");
  console.log("===============================");

  // Test 1: Check GraphQL health
  const graphqlHealthy = await testGraphQLHealth();
  if (!graphqlHealthy) {
    console.log("❌ GraphQL endpoint not available - aborting tests");
    process.exit(1);
  }

  // Test 2: Test GraphQL basic functionality
  const graphqlWorking = await testGraphQLIntegration();
  if (!graphqlWorking) {
    console.log("❌ GraphQL integration test failed");
  }

  // Test 3: Test agent registry directly
  const agentRegistryWorking = await testJokerAgentDirect();

  console.log("\n📊 Test Results:");
  console.log("===============");
  console.log(`GraphQL Health: ${graphqlHealthy ? "✅" : "❌"}`);
  console.log(`GraphQL Integration: ${graphqlWorking ? "✅" : "❌"}`);
  console.log(`Agent Registry: ${agentRegistryWorking ? "✅" : "❌"}`);

  if (graphqlHealthy && agentRegistryWorking) {
    console.log("\n✅ Core functionality is working!");
    console.log(
      "Next step: Test with actual GraphQL execution once API keys are configured"
    );
    process.exit(0);
  } else {
    console.log("\n❌ Some tests failed - needs investigation");
    process.exit(1);
  }
}

// Run the tests
runAllTests().catch((error) => {
  console.error("❌ Test suite failed:", error.message);
  process.exit(1);
});
