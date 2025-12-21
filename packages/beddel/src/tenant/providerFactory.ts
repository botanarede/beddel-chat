/**
 * Provider Factory
 * Factory function for creating tenant providers based on configuration
 * Uses ProviderRegistry for dynamic provider registration
 */

import {
  ProviderType,
  ITenantProvider,
  BuiltInProviderType,
} from './interfaces';
import { ProviderRegistry } from './providerRegistry';
import { InMemoryTenantProvider } from './providers/InMemoryTenantProvider';

/**
 * Built-in provider types
 */
const BUILTIN_PROVIDERS: readonly BuiltInProviderType[] = ['memory'] as const;

// Register built-in provider on module load
ProviderRegistry.register('memory', () => new InMemoryTenantProvider());

/**
 * Check if a value is a valid built-in ProviderType
 */
export function isBuiltInProviderType(type: unknown): type is BuiltInProviderType {
  return typeof type === 'string' && BUILTIN_PROVIDERS.includes(type as BuiltInProviderType);
}

/**
 * Check if a value is a valid ProviderType (built-in or registered)
 */
export function isValidProviderType(type: unknown): type is ProviderType {
  if (typeof type !== 'string') {
    return false;
  }
  return isBuiltInProviderType(type) || ProviderRegistry.isRegistered(type);
}

/**
 * Create a tenant provider instance based on the specified type
 * 
 * @param type - The provider type to create (built-in or registered)
 * @returns An instance of ITenantProvider for the specified type
 * @throws ValidationError if the provider type is not registered
 * 
 * @example
 * ```typescript
 * // Create an in-memory provider for testing (built-in)
 * const memoryProvider = createProvider('memory');
 * 
 * // Create a Firebase provider (must be registered by application first)
 * // In your app: ProviderRegistry.register('firebase', () => new FirebaseTenantProvider());
 * const firebaseProvider = createProvider('firebase');
 * ```
 */
export function createProvider(type: ProviderType): ITenantProvider {
  return ProviderRegistry.create(type);
}

/**
 * Get the list of supported provider types (built-in + registered)
 * @returns Array of supported provider type strings
 */
export function getSupportedProviders(): string[] {
  return ProviderRegistry.getRegisteredTypes();
}

/**
 * Get the list of built-in provider types
 * @returns Array of built-in provider type strings
 */
export function getBuiltInProviders(): readonly BuiltInProviderType[] {
  return BUILTIN_PROVIDERS;
}
