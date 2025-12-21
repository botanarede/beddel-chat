/**
 * Firebase Tenant Provider
 * Implements ITenantProvider using Firebase Admin SDK
 * 
 * This provider is external to the beddel package for security reasons.
 * Credential-handling providers should be managed by the consuming application.
 * 
 * NOTE: firebase-admin is an optional peer dependency.
 * Install it separately if you want to use Firebase as a tenant provider:
 * 
 * ```bash
 * pnpm add firebase-admin
 * ```
 */

import {
  ITenantProvider,
  ITenantApp,
  ITenantDatabase,
  ITenantCollection,
  ITenantDocument,
  TenantConfig,
  ProviderType,
  NotFoundError,
  ValidationError,
  TenantAlreadyExistsError,
} from 'beddel';

/**
 * Firebase-specific provider configuration
 */
export interface FirebaseProviderConfig {
  projectId: string;
  databaseURL: string;
  storageBucket: string;
}

// Dynamic import type for firebase-admin
type FirebaseAdmin = typeof import('firebase-admin');

// Lazy-loaded firebase-admin module
let firebaseAdmin: FirebaseAdmin | null = null;

/**
 * Dynamically load firebase-admin module
 * @throws Error if firebase-admin is not installed
 */
async function loadFirebaseAdmin(): Promise<FirebaseAdmin> {
  if (firebaseAdmin) {
    return firebaseAdmin;
  }

  try {
    // Dynamic import to avoid bundling firebase-admin when not used
    firebaseAdmin = await import('firebase-admin');
    return firebaseAdmin;
  } catch {
    throw new Error(
      'firebase-admin is not installed. Install it with: pnpm add firebase-admin\n' +
      'Firebase provider requires firebase-admin as a peer dependency.'
    );
  }
}

/**
 * Synchronously get firebase-admin (must be loaded first via loadFirebaseAdmin)
 * @throws Error if firebase-admin was not loaded
 */
function getFirebaseAdmin(): FirebaseAdmin {
  if (!firebaseAdmin) {
    throw new Error(
      'firebase-admin not loaded. Ensure initialize() was called first.'
    );
  }
  return firebaseAdmin;
}


// =============================================================================
// Firebase Document Implementation
// =============================================================================

class FirebaseDocument implements ITenantDocument {
  constructor(
    private docRef: import('firebase-admin').firestore.DocumentReference
  ) {}

  async get(): Promise<Record<string, unknown> | null> {
    const snapshot = await this.docRef.get();
    if (!snapshot.exists) {
      return null;
    }
    return snapshot.data() as Record<string, unknown>;
  }

  async set(data: Record<string, unknown>): Promise<void> {
    await this.docRef.set(data);
  }

  async update(data: Record<string, unknown>): Promise<void> {
    const snapshot = await this.docRef.get();
    if (!snapshot.exists) {
      throw new NotFoundError(`Document '${this.docRef.id}' not found`);
    }
    await this.docRef.update(data);
  }

  async delete(): Promise<void> {
    await this.docRef.delete();
  }
}

// =============================================================================
// Firebase Collection Implementation
// =============================================================================

class FirebaseCollection implements ITenantCollection {
  constructor(
    private collectionRef: import('firebase-admin').firestore.CollectionReference
  ) {}

  doc(id: string): ITenantDocument {
    return new FirebaseDocument(this.collectionRef.doc(id));
  }

  async add(data: Record<string, unknown>): Promise<string> {
    const docRef = await this.collectionRef.add(data);
    return docRef.id;
  }

  async get(): Promise<Array<{ id: string; data: Record<string, unknown> }>> {
    const snapshot = await this.collectionRef.get();
    return snapshot.docs.map((doc: import('firebase-admin').firestore.QueryDocumentSnapshot) => ({
      id: doc.id,
      data: doc.data() as Record<string, unknown>,
    }));
  }
}

// =============================================================================
// Firebase Database Implementation
// =============================================================================

class FirebaseDatabase implements ITenantDatabase {
  constructor(
    private firestore: import('firebase-admin').firestore.Firestore,
    private tenantId: string
  ) {}

  collection(name: string): ITenantCollection {
    // Namespace collections under tenant ID for isolation
    const namespacedPath = `tenants/${this.tenantId}/${name}`;
    return new FirebaseCollection(this.firestore.collection(namespacedPath));
  }
}


// =============================================================================
// Firebase Document Implementation
// =============================================================================

class FirebaseDocument implements ITenantDocument {
  constructor(
    private docRef: import('firebase-admin').firestore.DocumentReference
  ) {}

  async get(): Promise<Record<string, unknown> | null> {
    const snapshot = await this.docRef.get();
    if (!snapshot.exists) {
      return null;
    }
    return snapshot.data() as Record<string, unknown>;
  }

  async set(data: Record<string, unknown>): Promise<void> {
    await this.docRef.set(data);
  }

  async update(data: Record<string, unknown>): Promise<void> {
    const snapshot = await this.docRef.get();
    if (!snapshot.exists) {
      throw new NotFoundError(`Document '${this.docRef.id}' not found`);
    }
    await this.docRef.update(data);
  }

  async delete(): Promise<void> {
    await this.docRef.delete();
  }
}

// =============================================================================
// Firebase Collection Implementation
// =============================================================================

class FirebaseCollection implements ITenantCollection {
  constructor(
    private collectionRef: import('firebase-admin').firestore.CollectionReference
  ) {}

  doc(id: string): ITenantDocument {
    return new FirebaseDocument(this.collectionRef.doc(id));
  }

  async add(data: Record<string, unknown>): Promise<string> {
    const docRef = await this.collectionRef.add(data);
    return docRef.id;
  }

  async get(): Promise<Array<{ id: string; data: Record<string, unknown> }>> {
    const snapshot = await this.collectionRef.get();
    return snapshot.docs.map((doc: import('firebase-admin').firestore.QueryDocumentSnapshot) => ({
      id: doc.id,
      data: doc.data() as Record<string, unknown>,
    }));
  }
}

// =============================================================================
// Firebase Database Implementation
// =============================================================================

class FirebaseDatabase implements ITenantDatabase {
  constructor(
    private firestore: import('firebase-admin').firestore.Firestore,
    private tenantId: string
  ) {}

  collection(name: string): ITenantCollection {
    // Namespace collections under tenant ID for isolation
    const namespacedPath = `tenants/${this.tenantId}/${name}`;
    return new FirebaseCollection(this.firestore.collection(namespacedPath));
  }
}


// =============================================================================
// Firebase Tenant App Implementation
// =============================================================================

class FirebaseTenantApp implements ITenantApp {
  private database: FirebaseDatabase;
  private destroyed = false;

  constructor(
    public readonly tenantId: string,
    private firebaseApp: import('firebase-admin').app.App,
    private readonly _config: TenantConfig
  ) {
    this.database = new FirebaseDatabase(firebaseApp.firestore(), tenantId);
  }

  /**
   * Get the tenant configuration
   * @internal
   */
  getConfig(): TenantConfig {
    return this._config;
  }

  getDatabase(): ITenantDatabase {
    if (this.destroyed) {
      throw new NotFoundError(`Tenant '${this.tenantId}' has been destroyed`);
    }
    return this.database;
  }

  /**
   * Get the underlying Firebase app (for advanced operations)
   * @internal
   */
  getFirebaseApp(): import('firebase-admin').app.App {
    if (this.destroyed) {
      throw new NotFoundError(`Tenant '${this.tenantId}' has been destroyed`);
    }
    return this.firebaseApp;
  }

  async destroy(): Promise<void> {
    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    await this.firebaseApp.delete();
  }
}

// =============================================================================
// Firebase Tenant Provider Implementation
// =============================================================================

/**
 * Firebase implementation of ITenantProvider
 * Provides multi-tenant isolation using Firebase Admin SDK
 * 
 * NOTE: firebase-admin must be installed separately as a peer dependency.
 */
export class FirebaseTenantProvider implements ITenantProvider {
  public readonly type: ProviderType = 'firebase';
  private tenants: Map<string, FirebaseTenantApp> = new Map();
  private initialized = false;

  /**
   * Ensure firebase-admin is loaded before use
   */
  private async ensureFirebaseLoaded(): Promise<void> {
    if (!this.initialized) {
      await loadFirebaseAdmin();
      this.initialized = true;
    }
  }

  /**
   * Validate Firebase-specific provider configuration
   */
  private validateFirebaseConfig(config: TenantConfig): FirebaseProviderConfig {
    if (config.provider !== 'firebase') {
      throw new ValidationError(`Invalid provider type: expected 'firebase', got '${config.provider}'`);
    }

    const providerConfig = config.providerConfig as FirebaseProviderConfig;

    if (!providerConfig.projectId) {
      throw new ValidationError('Firebase projectId is required');
    }

    if (!providerConfig.databaseURL) {
      throw new ValidationError('Firebase databaseURL is required');
    }

    if (!providerConfig.storageBucket) {
      throw new ValidationError('Firebase storageBucket is required');
    }

    return providerConfig;
  }

  /**
   * Validate tenant configuration
   */
  private validateTenantConfig(config: TenantConfig): void {
    if (!config.tenantId || config.tenantId.length < 3) {
      throw new ValidationError('Invalid tenant ID - must be at least 3 characters');
    }

    if (!config.securityProfile) {
      throw new ValidationError('Security profile is required');
    }

    if (!config.dataRetentionDays) {
      throw new ValidationError('Data retention days is required');
    }

    if (config.dataRetentionDays < 90) {
      throw new ValidationError('Data retention minimum 90 days for LGPD compliance');
    }
  }

  async initialize(config: TenantConfig): Promise<ITenantApp> {
    // Ensure firebase-admin is loaded
    await this.ensureFirebaseLoaded();
    const admin = getFirebaseAdmin();

    // Validate configurations
    this.validateTenantConfig(config);
    const firebaseConfig = this.validateFirebaseConfig(config);

    // Check if tenant already exists
    if (this.tenants.has(config.tenantId)) {
      throw new TenantAlreadyExistsError(config.tenantId);
    }

    // Initialize Firebase app for this tenant
    const appName = `tenant-${config.tenantId}`;
    const firebaseApp = admin.initializeApp(
      {
        credential: admin.credential.applicationDefault(),
        projectId: firebaseConfig.projectId,
        databaseURL: firebaseConfig.databaseURL,
        storageBucket: firebaseConfig.storageBucket,
      },
      appName
    );

    // Create tenant app wrapper
    const tenantApp = new FirebaseTenantApp(config.tenantId, firebaseApp, config);
    this.tenants.set(config.tenantId, tenantApp);

    return tenantApp;
  }

  get(tenantId: string): ITenantApp {
    const app = this.tenants.get(tenantId);
    if (!app) {
      throw new NotFoundError(`Tenant '${tenantId}' not found`);
    }
    return app;
  }

  async remove(tenantId: string): Promise<void> {
    const app = this.tenants.get(tenantId);
    if (!app) {
      throw new NotFoundError(`Tenant '${tenantId}' not found`);
    }
    await app.destroy();
    this.tenants.delete(tenantId);
  }

  list(): string[] {
    return Array.from(this.tenants.keys());
  }
}
