// App constants
export const APP_NAME = "3D Ordinal Minter";
export const APP_VERSION = "0.1";
export const COMPANY_NAME = "3D Ordinal Minter";
export const COMPANY_SITE = "https://3dordinalminter.bsv";
export const COPYRIGHT_YEAR = new Date().getFullYear();

// Blockchain constants
export const NETWORK = "BSV";
export const EXPLORER_URL = "https://whatsonchain.com/tx/";

// Fee constants
export const BASE_MINT_FEE = 10000; // in sats
export const NETWORK_FEE_ESTIMATE = 2100; // in sats
export const HIGH_QUALITY_FEE = 5000; // additional fee for high quality
export const ULTRA_QUALITY_FEE = 15000; // additional fee for ultra quality

// Collection constants
export const COLLECTIONS = [
  {
    id: "pixel-foxes",
    name: "Pixel Foxes",
    collectionId: "bsv-20-foxes",
    maxSupply: 10000000,
    minted: 2716039,
    mintFee: BASE_MINT_FEE,
    description: "Only Ordinals from the Pixel Foxes collection can be converted",
    sampleImage: "https://mint-sites.s3.amazonaws.com/foxes/yellow-fox.png",
  },
];

// Minting step constants
export const MINTING_STEPS = [
  { id: 1, name: "Upload", path: "/mint" },
  { id: 2, name: "Preview", path: "/preview" },
  { id: 3, name: "Mint", path: "/mint-confirm" },
  { id: 4, name: "Complete", path: "/mint-success" },
];

// 3D Model constants
export const MODEL_QUALITIES = [
  { id: "standard", name: "Standard Quality (Recommended)", additionalFee: 0 },
  { id: "high", name: "High Quality", additionalFee: HIGH_QUALITY_FEE },
  { id: "ultra", name: "Ultra Quality", additionalFee: ULTRA_QUALITY_FEE },
];

// API endpoints
export const API_ENDPOINTS = {
  VALIDATE_ORDINAL: "/api/ordinals/validate",
  GENERATE_3D: "/api/ordinals/generate3d",
  MINT_3D: "/api/ordinals/mint3d",
  GET_ORDINAL: "/api/ordinals/",
  GET_COLLECTIONS: "/api/collections",
};
