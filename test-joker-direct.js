#!/usr/bin/env node

/**
 * Direct test of Joker Agent - read YAML and test interpreter
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

async function testJokerAgent() {
  console.log("🃏 Testing Joker Agent Directly");
  console.log("==============================");

  try {
    // Read the Joker Agent YAML file
    const jokerYamlPath = path.join(
      __dirname,
      "packages/beddel/src/agents/joker-agent.yaml"
    );
    const yamlContent = fs.readFileSync(jokerYamlPath, "utf-8");

    console.log("✅ Loaded Joker Agent YAML");

    // Parse the YAML
    let agentDefinition;
    try {
      agentDefinition = yaml.load(yamlContent);
      console.log("✅ YAML parsing successful");
      console.log("   Agent ID:", agentDefinition.agent.id);
      console.log("   Protocol:", agentDefinition.agent.protocol);
      console.log(
        "   Variables:",
        (agentDefinition.logic.variables || []).length
      );
      console.log("   Workflow steps:", agentDefinition.logic.workflow.length);
    } catch (yamlError) {
      console.log("❌ YAML parsing failed:", yamlError.message);
      return false;
    }

    // Test the declarative interpreter logic manually
    console.log("\n🔍 Testing manual interpretation...");

    // Simulate variable initialization
    const variables = new Map();
    if (agentDefinition.logic.variables) {
      for (const variable of agentDefinition.logic.variables) {
        console.log(
          `   Initializing variable: ${variable.name} = ${variable.init}`
        );
        // Simple string literal parsing
        if (variable.init.startsWith('"') && variable.init.endsWith('"')) {
          const value = variable.init.slice(1, -1);
          variables.set(variable.name, value);
          console.log(`   Set: ${variable.name} = "${value}"`);
        }
      }
    }

    // Simulate workflow execution
    console.log("\n🚀 Simulating workflow execution...");
    for (const step of agentDefinition.logic.workflow) {
      console.log(`   Executing step: ${step.name}`);

      if (step.type === "output-generator") {
        console.log("   Processing output generator...");

        // Build output object
        const output = {};
        for (const [key, valueExpr] of Object.entries(step.action.output)) {
          if (typeof valueExpr === "string" && valueExpr.startsWith("$")) {
            // Variable reference
            const varName = valueExpr.substring(1);
            const varValue = variables.get(varName);
            if (varValue === undefined) {
              console.log(`   ❌ Undefined variable referenced: ${varName}`);
              return false;
            }
            output[key] = varValue;
            console.log(`   → ${key} = ${varValue} (from $${varName})`);
          } else {
            // Literal value
            output[key] = valueExpr;
            console.log(`   → ${key} = ${valueExpr} (literal)`);
          }
        }

        console.log("   ✅ Output generated:", JSON.stringify(output));

        // Verify the expected response
        const expectedResponse = { response: "lol" };
        if (JSON.stringify(expectedResponse) === JSON.stringify(output)) {
          console.log("✅ SUCCESS: Output matches expected response!");
          return true;
        } else {
          console.log("❌ FAIL: Output doesn't match expected response");
          console.log("Expected:", expectedResponse);
          console.log("Actual:", output);
          return false;
        }
      }
    }

    return false;
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.error("Stack:", error.stack);
    return false;
  }
}

// Run the test
testJokerAgent()
  .then((success) => {
    if (success) {
      console.log("\n🎉 Joker Agent is working correctly!");
      process.exit(0);
    } else {
      console.log("\n❌ Joker Agent test failed");
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("❌ Test suite failed:", error.message);
    process.exit(1);
  });
