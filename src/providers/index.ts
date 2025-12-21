/**
 * Application Providers
 * Register custom tenant providers for the application
 */

import { ProviderRegistry } from 'beddel';
import { FirebaseTenantProvider } from './FirebaseTenantProvider';

/**
 * Register all application providers
 * Call this during application bootstrap before using TenantManager
 */
export function registerProviders(): void {
  // Only register if not already registered (prevents duplicate registration)
  if (!ProviderRegistry.isRegistered('firebase')) {
    ProviderRegistry.register('firebase', () => new FirebaseTenantProvider());
  }
}

export { FirebaseTenantProvider };
export type { FirebaseProviderConfig } from './FirebaseTenantProvider';
