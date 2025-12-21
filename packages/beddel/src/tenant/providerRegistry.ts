/**
 * Provider Registry
 * Dynamic registration system for external tenant providers
 * Allows applications to register custom providers at runtime
 */

import { ITenantProvider, ValidationError } from './interfaces';

type ProviderFactory = () => ITenantProvider;

/**
 * Registry for tenant providers
 * Applications register their providers here before using TenantManager
 */
class ProviderRegistryClass {
  private providers: Map<string, ProviderFactory> = new Map();

  /**
   * Register a provider factory
   * @param type - Unique provider type identifier
   * @param factory - Factory function that creates the provider instance
   * @throws ValidationError if type is already registered
   */
  register(type: string, factory: ProviderFactory): void {
    if (!type || typeof type !== 'string') {
      throw new ValidationError('Provider type must be a non-empty string');
    }
    if (typeof factory !== 'function') {
      throw new ValidationError('Provider factory must be a function');
    }
    if (this.providers.has(type)) {
      throw new ValidationError(`Provider type '${type}' is already registered`);
    }
    this.providers.set(type, factory);
  }

  /**
   * Unregister a provider
   * @param type - Provider type to remove
   */
  unregister(type: string): void {
    this.providers.delete(type);
  }

  /**
   * Create a provider instance
   * @param type - Provider type to create
   * @throws ValidationError if provider type is not registered
   */
  create(type: string): ITenantProvider {
    const factory = this.providers.get(type);
    if (!factory) {
      const registered = this.getRegisteredTypes();
      const available = registered.length > 0 
        ? `Available types: ${registered.join(', ')}`
        : 'No providers registered';
      throw new ValidationError(
        `Unknown provider type: '${type}'. ${available}`
      );
    }
    return factory();
  }

  /**
   * Check if a provider type is registered
   */
  isRegistered(type: string): boolean {
    return this.providers.has(type);
  }

  /**
   * Get all registered provider types
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Clear all registered providers (useful for testing)
   */
  clear(): void {
    this.providers.clear();
  }
}

export const ProviderRegistry = new ProviderRegistryClass();
