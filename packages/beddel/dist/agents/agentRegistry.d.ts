/**
 * Agent Registry Service
 * Manages registration and execution of declarative YAML agents
 */
import { ExecutionContext } from "../types/executionContext";
export interface AgentRegistration {
    id: string;
    name: string;
    description: string;
    protocol: string;
    route: string;
    requiredProps: string[];
    yamlContent: string;
}
/**
 * Agent Registry - Manages declarative agent registration and execution
 */
export declare class AgentRegistry {
    private readonly agents;
    private readonly customFunctions;
    constructor();
    /**
     * Register an agent
     */
    registerAgent(agent: AgentRegistration, allowOverwrite?: boolean): void;
    /**
     * Execute registered agent
     */
    executeAgent(agentName: string, input: Record<string, any>, props: Record<string, string>, context: ExecutionContext): Promise<any>;
    /**
     * Get registered agent
     */
    getAgent(agentName: string): AgentRegistration | undefined;
    /**
     * Get all registered agents
     */
    getAllAgents(): AgentRegistration[];
    /**
     * Load custom agents from a specified directory
     * @param customAgentsPath - Optional path to custom agents directory. Defaults to process.cwd()/agents
     */
    loadCustomAgents(customAgentsPath?: string): Promise<void>;
    /**
     * Register a custom agent from a YAML file
     */
    private registerCustomAgent;
    /**
     * Discover all YAML files in the custom agents directory
     */
    private discoverCustomAgentFiles;
    /**
     * Register built-in agents
     */
    private registerBuiltinAgents;
    /**
     * Register Joker Agent
     */
    private registerJokerAgent;
    /**
     * Register Translator Agent
     */
    private registerTranslatorAgent;
    /**
     * Register Image Generator Agent
     */
    private registerImageAgent;
    /**
     * Parse agent YAML content
     */
    private parseAgentYaml;
    /**
     * Validate agent registration
     */
    private validateAgent;
    /**
     * Resolve agent asset path when running in bundled runtimes
     */
    private resolveAgentPath;
    /**
     * Load custom TypeScript function implementations from /agents directory
     * @param agentsPath - Path to the agents directory
     */
    private loadCustomFunctions;
    /**
     * Get a custom function by its namespaced key
     * @param name - Function name in format "agent-name/functionName"
     * @returns The registered function or undefined
     */
    getCustomFunction(name: string): Function | undefined;
}
export declare const agentRegistry: AgentRegistry;
export default AgentRegistry;
//# sourceMappingURL=agentRegistry.d.ts.map