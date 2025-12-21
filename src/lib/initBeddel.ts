/**
 * Beddel Initialization
 * Loads custom agents from the /agents directory
 * Registers application-specific providers
 */

import { agentRegistry } from "beddel";
import { registerProviders } from "../providers";

/**
 * Initialize Beddel and load custom agents
 * Call this once during application startup
 */
export function initBeddel() {
    try {
        // Register application providers (Firebase, etc.)
        registerProviders();
        
        // Load custom agents from /agents directory
        agentRegistry.loadCustomAgents();
    } catch (error) {
        console.error("Failed to initialize Beddel:", error);
    }
}
