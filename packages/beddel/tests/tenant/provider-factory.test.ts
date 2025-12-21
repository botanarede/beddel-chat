/**
 * Provider Factory Tests
 * Validation tests for ProviderFactory and ProviderRegistry
 */

import { createProvider, isValidProviderType, getSupportedProviders, isBuiltInProviderType } from '../../src/tenant/providerFactory';
import { ProviderRegistry } from '../../src/tenant/providerRegistry';
import { ValidationError, ITenantProvider } from '../../src/tenant/interfaces';
import { InMemoryTenantProvider } from '../../src/tenant/providers/InMemoryTenantProvider';

// =============================================================================
// Provider Factory Tests
// =============================================================================

describe('ProviderFactory', () => {
  describe('createProvider', () => {
    it('should create InMemoryTenantProvider for "memory" type', () => {
      const provider = createProvider('memory');
      expect(provider).toBeInstanceOf(InMemoryTenantProvider);
      expect(provider.type).toBe('memory');
    });

    it('should throw ValidationError for unregistered provider type', () => {
      expect(() => createProvider('unregistered' as 'memory')).toThrow(ValidationError);
      expect(() => createProvider('unregistered' as 'memory')).toThrow(/Unknown provider type/);
    });

    it('should throw ValidationError for empty string provider type', () => {
      expect(() => createProvider('' as 'memory')).toThrow(ValidationError);
    });
  });

  describe('isValidProviderType', () => {
    it('should return true for built-in provider types', () => {
      expect(isValidProviderType('memory')).toBe(true);
    });

    it('should return false for unregistered provider types', () => {
      expect(isValidProviderType('invalid')).toBe(false);
      expect(isValidProviderType('')).toBe(false);
      expect(isValidProviderType(null)).toBe(false);
      expect(isValidProviderType(undefined)).toBe(false);
      expect(isValidProviderType(123)).toBe(false);
    });

    it('should return true for registered external providers', () => {
      const mockFactory = jest.fn(() => ({ type: 'custom-test' } as ITenantProvider));
      ProviderRegistry.register('custom-test', mockFactory);
      
      expect(isValidProviderType('custom-test')).toBe(true);
      
      ProviderRegistry.unregister('custom-test');
    });
  });

  describe('isBuiltInProviderType', () => {
    it('should return true for memory provider', () => {
      expect(isBuiltInProviderType('memory')).toBe(true);
    });

    it('should return false for external providers', () => {
      expect(isBuiltInProviderType('firebase')).toBe(false);
      expect(isBuiltInProviderType('custom')).toBe(false);
    });
  });

  describe('getSupportedProviders', () => {
    it('should return array containing memory', () => {
      const providers = getSupportedProviders();
      expect(providers).toContain('memory');
    });

    it('should include registered external providers', () => {
      const mockFactory = jest.fn(() => ({ type: 'external-test' } as ITenantProvider));
      ProviderRegistry.register('external-test', mockFactory);
      
      const providers = getSupportedProviders();
      expect(providers).toContain('external-test');
      
      ProviderRegistry.unregister('external-test');
    });
  });
});

// =============================================================================
// Provider Registry Tests
// =============================================================================

describe('ProviderRegistry', () => {
  // Clean up after each test to avoid interference
  afterEach(() => {
    // Unregister any test providers (but keep built-in 'memory')
    const types = ProviderRegistry.getRegisteredTypes();
    types.forEach(type => {
      if (type !== 'memory') {
        ProviderRegistry.unregister(type);
      }
    });
  });

  describe('register', () => {
    it('should register a custom provider', () => {
      const mockFactory = jest.fn(() => ({ type: 'custom' } as ITenantProvider));
      
      ProviderRegistry.register('custom', mockFactory);
      
      expect(ProviderRegistry.isRegistered('custom')).toBe(true);
    });

    it('should throw ValidationError for duplicate registration', () => {
      const mockFactory = jest.fn(() => ({ type: 'duplicate' } as ITenantProvider));
      
      ProviderRegistry.register('duplicate', mockFactory);
      
      expect(() => ProviderRegistry.register('duplicate', mockFactory)).toThrow(ValidationError);
      expect(() => ProviderRegistry.register('duplicate', mockFactory)).toThrow(/already registered/);
    });

    it('should throw ValidationError for empty type', () => {
      const mockFactory = jest.fn(() => ({ type: '' } as ITenantProvider));
      
      expect(() => ProviderRegistry.register('', mockFactory)).toThrow(ValidationError);
    });

    it('should throw ValidationError for non-function factory', () => {
      expect(() => ProviderRegistry.register('invalid', 'not-a-function' as unknown as () => ITenantProvider)).toThrow(ValidationError);
    });
  });

  describe('unregister', () => {
    it('should unregister a provider', () => {
      const mockFactory = jest.fn(() => ({ type: 'to-remove' } as ITenantProvider));
      ProviderRegistry.register('to-remove', mockFactory);
      
      expect(ProviderRegistry.isRegistered('to-remove')).toBe(true);
      
      ProviderRegistry.unregister('to-remove');
      
      expect(ProviderRegistry.isRegistered('to-remove')).toBe(false);
    });

    it('should not throw for non-existent provider', () => {
      expect(() => ProviderRegistry.unregister('non-existent')).not.toThrow();
    });
  });

  describe('create', () => {
    it('should create provider instance from registered factory', () => {
      const mockProvider = { type: 'factory-test' } as ITenantProvider;
      const mockFactory = jest.fn(() => mockProvider);
      
      ProviderRegistry.register('factory-test', mockFactory);
      
      const provider = ProviderRegistry.create('factory-test');
      
      expect(mockFactory).toHaveBeenCalled();
      expect(provider).toBe(mockProvider);
    });

    it('should throw ValidationError for unregistered provider', () => {
      expect(() => ProviderRegistry.create('unknown')).toThrow(ValidationError);
    });
  });

  describe('isRegistered', () => {
    it('should return true for registered providers', () => {
      expect(ProviderRegistry.isRegistered('memory')).toBe(true);
    });

    it('should return false for unregistered providers', () => {
      expect(ProviderRegistry.isRegistered('not-registered')).toBe(false);
    });
  });

  describe('getRegisteredTypes', () => {
    it('should return all registered types', () => {
      const types = ProviderRegistry.getRegisteredTypes();
      
      expect(Array.isArray(types)).toBe(true);
      expect(types).toContain('memory');
    });
  });
});
