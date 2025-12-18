"use strict";
/**
 * Agent Registry Service
 * Manages registration and execution of declarative YAML agents
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentRegistry = exports.AgentRegistry = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const declarativeAgentRuntime_1 = require("../runtime/declarativeAgentRuntime");
/**
 * Agent Registry - Manages declarative agent registration and execution
 */
class AgentRegistry {
    constructor() {
        this.agents = new Map();
        this.customFunctions = new Map();
        // Register built-in agents on initialization
        this.registerBuiltinAgents();
        // Automatically load custom agents if running in Node.js environment
        // This runs asynchronously in the background
        if (typeof process !== 'undefined' && typeof process.cwd === 'function') {
            this.loadCustomAgents().catch((error) => {
                // Silently fail if custom agents can't be loaded
                // This allows the registry to work even without custom agents
                console.error('Failed to load custom agents during initialization:', error);
            });
        }
    }
    /**
     * Register an agent
     */
    registerAgent(agent, allowOverwrite = false) {
        // Validate agent
        this.validateAgent(agent);
        // Check if agent already exists
        if (this.agents.has(agent.name) && allowOverwrite) {
            console.warn(`⚠️  Overwriting existing agent: ${agent.name}`);
        }
        // Register the agent
        this.agents.set(agent.name, agent);
        console.log(`Agent registered: ${agent.name} (${agent.protocol})`);
    }
    /**
     * Execute registered agent
     */
    async executeAgent(agentName, input, props, context) {
        // Find agent
        const agent = this.agents.get(agentName);
        if (!agent) {
            throw new Error(`Agent not found: ${agentName}`);
        }
        // Execute using declarative interpreter
        const result = await declarativeAgentRuntime_1.declarativeInterpreter.interpret({
            yamlContent: agent.yamlContent,
            input,
            props,
            context,
        });
        return result;
    }
    /**
     * Get registered agent
     */
    getAgent(agentName) {
        return this.agents.get(agentName);
    }
    /**
     * Get all registered agents
     */
    getAllAgents() {
        return Array.from(this.agents.values());
    }
    /**
     * Load custom agents from a specified directory
     * @param customAgentsPath - Optional path to custom agents directory. Defaults to process.cwd()/agents
     */
    async loadCustomAgents(customAgentsPath) {
        try {
            // Determine the agents directory path
            const agentsPath = customAgentsPath || (0, path_1.join)(process.cwd(), "agents");
            // Check if directory exists
            if (!(0, fs_1.existsSync)(agentsPath)) {
                console.log(`No custom agents directory found at: ${agentsPath}`);
                return;
            }
            console.log(`🔍 Loading custom agents from: ${agentsPath}`);
            // Discover all YAML files in the agents directory
            const agentFiles = this.discoverCustomAgentFiles(agentsPath);
            if (agentFiles.length === 0) {
                console.log(`No custom agent YAML files found in: ${agentsPath}`);
            }
            // Register each custom agent
            let successCount = 0;
            for (const yamlPath of agentFiles) {
                try {
                    this.registerCustomAgent(yamlPath);
                    successCount++;
                }
                catch (error) {
                    console.error(`Failed to register custom agent from ${yamlPath}:`, error);
                }
            }
            if (agentFiles.length > 0) {
                console.log(`✅ Successfully loaded ${successCount}/${agentFiles.length} custom agents`);
            }
            // Load TypeScript implementations
            await this.loadCustomFunctions(agentsPath);
        }
        catch (error) {
            console.error("Failed to load custom agents:", error);
        }
    }
    /**
     * Register a custom agent from a YAML file
     */
    registerCustomAgent(yamlPath) {
        // Read YAML file
        const yamlContent = (0, fs_1.readFileSync)(yamlPath, "utf-8");
        // Parse agent metadata
        const agent = this.parseAgentYaml(yamlContent);
        // Determine agent name from metadata or filename
        const agentName = agent.metadata.route
            ? agent.metadata.route.replace("/agents/", "") + ".execute"
            : agent.agent.id + ".execute";
        // Register the agent (allow overwriting built-ins)
        this.registerAgent({
            id: agent.agent.id,
            name: agentName,
            description: agent.metadata.description,
            protocol: agent.agent.protocol,
            route: agent.metadata.route || `/agents/${agent.agent.id}`,
            requiredProps: agent.schema.required || ["gemini_api_key"],
            yamlContent,
        }, true // Allow overwriting
        );
    }
    /**
     * Discover all YAML files in the custom agents directory
     */
    discoverCustomAgentFiles(agentsPath) {
        const yamlFiles = [];
        const scanDirectory = (dirPath) => {
            const entries = (0, fs_1.readdirSync)(dirPath);
            for (const entry of entries) {
                const fullPath = (0, path_1.join)(dirPath, entry);
                const stat = (0, fs_1.statSync)(fullPath);
                if (stat.isDirectory()) {
                    // Recursively scan subdirectories
                    scanDirectory(fullPath);
                }
                else if (stat.isFile() && (entry.endsWith(".yaml") || entry.endsWith(".yml"))) {
                    yamlFiles.push(fullPath);
                }
            }
        };
        scanDirectory(agentsPath);
        return yamlFiles;
    }
    /**
     * Register built-in agents
     */
    registerBuiltinAgents() {
        try {
            // Register Joker Agent
            this.registerJokerAgent();
            // Register Translator Agent
            this.registerTranslatorAgent();
            // Register Image Generator Agent
            this.registerImageAgent();
        }
        catch (error) {
            console.error("Failed to register built-in agents:", error);
        }
    }
    /**
     * Register Joker Agent
     */
    registerJokerAgent() {
        try {
            // Get the Joker Agent YAML content
            const jokerYamlPath = this.resolveAgentPath("joker-agent.yaml");
            const yamlContent = (0, fs_1.readFileSync)(jokerYamlPath, "utf-8");
            // Parse YAML to extract metadata
            const agent = this.parseAgentYaml(yamlContent);
            this.registerAgent({
                id: agent.agent.id,
                name: "joker.execute",
                description: agent.metadata.description,
                protocol: agent.agent.protocol,
                route: agent.metadata.route || "/agents/joker",
                requiredProps: ["gemini_api_key"],
                yamlContent,
            });
        }
        catch (error) {
            console.error("Failed to register Joker Agent:", error);
            throw error;
        }
    }
    /**
     * Register Translator Agent
     */
    registerTranslatorAgent() {
        try {
            const translatorYamlPath = this.resolveAgentPath("translator-agent.yaml");
            const yamlContent = (0, fs_1.readFileSync)(translatorYamlPath, "utf-8");
            const agent = this.parseAgentYaml(yamlContent);
            this.registerAgent({
                id: agent.agent.id,
                name: "translator.execute",
                description: agent.metadata.description,
                protocol: agent.agent.protocol,
                route: agent.metadata.route || "/agents/translator",
                requiredProps: ["gemini_api_key"],
                yamlContent,
            });
        }
        catch (error) {
            console.error("Failed to register Translator Agent:", error);
            throw error;
        }
    }
    /**
     * Register Image Generator Agent
     */
    registerImageAgent() {
        try {
            const imageYamlPath = this.resolveAgentPath("image-agent.yaml");
            const yamlContent = (0, fs_1.readFileSync)(imageYamlPath, "utf-8");
            const agent = this.parseAgentYaml(yamlContent);
            this.registerAgent({
                id: agent.agent.id,
                name: "image.generate",
                description: agent.metadata.description,
                protocol: agent.agent.protocol,
                route: agent.metadata.route || "/agents/image",
                requiredProps: ["gemini_api_key"],
                yamlContent,
            });
        }
        catch (error) {
            console.error("Failed to register Image Agent:", error);
            throw error;
        }
    }
    /**
     * Parse agent YAML content
     */
    parseAgentYaml(yamlContent) {
        // Simple validation - full parsing will be done by interpreter
        if (!yamlContent.includes("agent:") || !yamlContent.includes("logic:")) {
            throw new Error("Invalid agent YAML: missing required sections");
        }
        // Basic YAML parsing for metadata extraction
        const lines = yamlContent.split("\n");
        const metadata = {
            agent: { id: "", protocol: "" },
            metadata: { description: "", route: "" },
            schema: { required: [] },
        };
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith("id:") && metadata.agent.id === "") {
                metadata.agent.id = line.split(":")[1].trim();
            }
            if (line.startsWith("protocol:") && metadata.agent.protocol === "") {
                metadata.agent.protocol = line.split(":")[1].trim();
            }
            if (line.startsWith("description:") &&
                metadata.metadata.description === "") {
                metadata.metadata.description = line
                    .substring(line.indexOf(":") + 1)
                    .trim();
            }
            if (line.startsWith("route:") && metadata.metadata.route === "") {
                metadata.metadata.route = line.split(":")[1].trim();
            }
            if (line.startsWith("required:") &&
                metadata.schema.required.length === 0) {
                // Parse required array
                const requiredStr = line.substring(line.indexOf(":") + 1).trim();
                metadata.schema.required = JSON.parse(requiredStr);
            }
        }
        return metadata;
    }
    /**
     * Validate agent registration
     */
    validateAgent(agent) {
        if (!agent.id || !agent.name || !agent.protocol) {
            throw new Error("Invalid agent: missing required fields");
        }
        if (!agent.yamlContent || agent.yamlContent.length === 0) {
            throw new Error("Invalid agent: missing YAML content");
        }
        if (!agent.protocol.startsWith("beddel-declarative-protocol")) {
            throw new Error(`Unsupported protocol: ${agent.protocol}`);
        }
    }
    /**
     * Resolve agent asset path when running in bundled runtimes
     */
    resolveAgentPath(filename) {
        const candidatePaths = [
            (0, path_1.join)(__dirname, filename),
            (0, path_1.join)(process.cwd(), "packages", "beddel", "src", "agents", filename),
        ];
        for (const path of candidatePaths) {
            if ((0, fs_1.existsSync)(path)) {
                return path;
            }
        }
        throw new Error(`Unable to locate agent asset '${filename}' in paths: ${candidatePaths.join(", ")}`);
    }
    /**
     * Load custom TypeScript function implementations from /agents directory
     * @param agentsPath - Path to the agents directory
     */
    async loadCustomFunctions(agentsPath) {
        try {
            const files = (0, fs_1.readdirSync)(agentsPath);
            let functionCount = 0;
            for (const file of files) {
                if (file.endsWith(".ts")) {
                    const modulePath = (0, path_1.join)(agentsPath, file);
                    try {
                        // Dynamic import of the custom agent module
                        const module = await Promise.resolve(`${modulePath}`).then(s => __importStar(require(s)));
                        // Register all exported functions with a namespaced key
                        // e.g., "my-agent/myFunction"
                        Object.keys(module).forEach((funcName) => {
                            if (typeof module[funcName] === "function") {
                                const key = `${file.replace(".ts", "")}/${funcName}`;
                                this.customFunctions.set(key, module[funcName]);
                                functionCount++;
                                console.log(`📦 Registered custom function: ${key}`);
                            }
                        });
                    }
                    catch (err) {
                        console.error(`Failed to load custom agent implementation ${file}:`, err);
                    }
                }
            }
            if (functionCount > 0) {
                console.log(`✅ Successfully loaded ${functionCount} custom function(s)`);
            }
        }
        catch (error) {
            console.error("Failed to load custom functions:", error);
        }
    }
    /**
     * Get a custom function by its namespaced key
     * @param name - Function name in format "agent-name/functionName"
     * @returns The registered function or undefined
     */
    getCustomFunction(name) {
        return this.customFunctions.get(name);
    }
}
exports.AgentRegistry = AgentRegistry;
// Singleton instance
exports.agentRegistry = new AgentRegistry();
exports.default = AgentRegistry;
//# sourceMappingURL=agentRegistry.js.map