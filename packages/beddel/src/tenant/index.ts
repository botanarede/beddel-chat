/**
 * Agnostic Multi-Tenant Module
 * Provider-independent tenant management for Beddel
 *
 * This module provides a complete abstraction layer for multi-tenant operations,
 * allowing swappable backends (Firebase, Supabase, PostgreSQL, etc.) without
 * modifying business logic.
 *
 * External providers (Firebase, Supabase, etc.) should be registered by the
 * consuming application using ProviderRegistry before use.
 *
 * @example
 * ```typescript
 * import {
 *   TenantManager,
 *   createProvider,
 *   ProviderRegistry,
 *   InMemoryTenantProvider,
 * } from 'beddel/tenant';
 *
 * // Register external provider (in your application)
 * import { FirebaseTenantProvider } from './providers/FirebaseTenantProvider';
 * ProviderRegistry.register('firebase', () => new FirebaseTenantProvider());
 *
 * // Use in-memory provider for testing (built-in)
 * const manager = TenantManager.getInstance();
 * const result = await manager.initializeTenant({
 *   tenantId: 'tenant-123',
 *   securityProfile: 'tenant-isolated',
 *   dataRetentionDays: 365,
 *   lgpdEnabled: true,
 *   gdprEnabled: true,
 *   provider: 'memory',
 *   providerConfig: {}
 * });
 * ```
 *
 * @module tenant
 */

// =============================================================================
// Core Manager
// =============================================================================

export { TenantManager } from './TenantManager';
export type { TenantIsolationResult } from './TenantManager';

// =============================================================================
// Interfaces and Types
// =============================================================================

export type {
  // Provider types
  ProviderType,
  BuiltInProviderType,

  // Configuration types
  TenantConfig,
  FirebaseProviderConfig,
  MemoryProviderConfig,

  // Core interfaces
  ITenantProvider,
  ITenantApp,
  ITenantDatabase,
  ITenantCollection,
  ITenantDocument,
} from './interfaces';

// Error types (classes, not just types)
export {
  TenantError,
  ValidationError,
  NotFoundError,
  NotSupportedError,
  TenantAlreadyExistsError,
} from './interfaces';

// =============================================================================
// Provider Registry
// =============================================================================

export { ProviderRegistry } from './providerRegistry';

// =============================================================================
// Provider Factory
// =============================================================================

export {
  createProvider,
  isValidProviderType,
  isBuiltInProviderType,
  getSupportedProviders,
  getBuiltInProviders,
} from './providerFactory';

// =============================================================================
// Built-in Provider Implementations
// =============================================================================

export { InMemoryTenantProvider } from './providers/InMemoryTenantProvider';
