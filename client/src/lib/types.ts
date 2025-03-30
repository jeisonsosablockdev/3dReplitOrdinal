// Wallet types
export interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number | null;
  provider: "yours" | null;
}

// Ordinal types
export interface Ordinal {
  id: string;
  inscriptionNumber: number;
  content: string;
  contentType: string;
  owner: string;
  collection: {
    id: string;
    name: string;
  };
  timestamp: string;
}

export interface ThreeDOrdinal extends Ordinal {
  modelUrl: string;
  polygonCount: number;
  textureResolution: string;
  fileSize: number;
  format: string;
  originalOrdinalId: string;
}

// Minting types
export interface MintingStep {
  id: number;
  name: string;
  path: string;
}

export interface ValidationResult {
  valid: boolean;
  ordinal: Ordinal | null;
  message: string;
}

export interface ModelQuality {
  id: string;
  name: string;
  additionalFee: number;
}

export interface MintingTransaction {
  id: string;
  inscriptionNumber: number;
  transactionId: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  ordinalId: string;
  threeDOrdinalId: string;
}

// Collection types
export interface Collection {
  id: string;
  name: string;
  collectionId: string;
  maxSupply: number;
  minted: number;
  mintFee: number;
  description: string;
  sampleImage: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
