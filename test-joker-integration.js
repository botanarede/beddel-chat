#!/usr/bin/env node

/**
 * Test script for Joker Agent integration
 * Validates that joker.execute is accessible via GraphQL
 */

const API_KEY =
  process.env.BEDDEL_API_KEY || "opal_demo_client_key_gukutdeg8uhcdvcuumshxc";
const GRAPHQL_ENDPOINT = "http://localhost:3000/api/graphql";
const EXECUTE_METHOD_MUTATION = `
  mutation($methodName: String!, $params: JSON!, $props: JSON!) {
    executeMethod(methodName: $methodName, params: $params, props: $props) {
      success
      data
      error
      executionTime
    }
  }
`;

async function testJokerAgent() {
  console.log("🃏 Testing Joker Agent Integration");
  console.log("=====================================");

  try {
    await runValidPayloadTest();
    await runInvalidPayloadTest();
    console.log("");
    console.log("🎉 Integration test completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    process.exit(1);
  }
}

async function runValidPayloadTest() {
  console.log("▶️  Running valid payload test...");
  const { execution, totalTime } = await executeJokerMutation({}, {});

  if (!execution.success) {
    throw new Error(`Valid payload failed: ${execution.error}`);
  }

  const expectedResponse = { response: "lol" };
  if (JSON.stringify(expectedResponse) !== JSON.stringify(execution.data)) {
    throw new Error("Response doesn't match expected output");
  }

  console.log(
    `✅ Valid payload accepted in ${totalTime}ms (runtime: ${execution.executionTime}ms)`
  );
  if (execution.executionTime <= 10) {
    console.log("✅ Performance meets <10ms target");
  } else {
    console.log("⚠️  Execution above 10ms target (still acceptable)");
  }
}

async function runInvalidPayloadTest() {
  console.log("▶️  Running malformed payload test...");
  const malformedParams = { unexpected: "value" };
  const { execution, totalTime } = await executeJokerMutation(
    malformedParams,
    {}
  );

  if (execution.success) {
    throw new Error(
      "Malformed payload was accepted but should have been rejected"
    );
  }

  console.log(
    `✅ Malformed payload rejected in ${totalTime}ms with error: ${execution.error}`
  );
}

async function executeJokerMutation(params, props) {
  const variables = {
    methodName: "joker.execute",
    params,
    props,
  };

  const startTime = Date.now();
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: EXECUTE_METHOD_MUTATION,
      variables,
    }),
  });
  const totalTime = Date.now() - startTime;

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();
  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
  }

  return {
    execution: result.data.executeMethod,
    totalTime,
  };
}

// Check if the server is running
async function checkServer() {
  try {
    const response = await fetch(
      GRAPHQL_ENDPOINT.replace("/api/graphql", "/api/health")
    );
    if (response.ok) {
      console.log("✅ Server is running");
      return true;
    } else {
      console.log(
        "⚠️  Health endpoint not available, checking GraphQL directly"
      );
      return true; // Try anyway
    }
  } catch (error) {
    console.log("⚠️  Could not check server health, proceeding with test");
    return true; // Try anyway
  }
}

// Run the test
console.log("🔍 Checking server availability...");
checkServer()
  .then((isRunning) => {
    if (isRunning) {
      testJokerAgent();
    } else {
      console.error("❌ Server appears to be down");
      console.log("");
      console.log(
        "💡 Make sure your Beddel server is running on http://localhost:3000"
      );
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("❌ Test setup failed:", error.message);
    process.exit(1);
  });
