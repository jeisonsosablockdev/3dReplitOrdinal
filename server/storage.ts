import { 
  users, type User, type InsertUser,
  collections, type Collection, type InsertCollection,
  ordinals, type Ordinal, type InsertOrdinal,
  threeDOrdinals, type ThreeDOrdinal, type InsertThreeDOrdinal,
  mintingTransactions, type MintingTransaction, type InsertMintingTransaction
} from "@shared/schema";

// Interface for storage methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Collection methods
  getCollection(id: number): Promise<Collection | undefined>;
  getCollectionByCollectionId(collectionId: string): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  getAllCollections(): Promise<Collection[]>;
  
  // Ordinal methods
  getOrdinalById(id: string): Promise<Ordinal | undefined>;
  getOrdinalByInscriptionId(inscriptionId: string): Promise<Ordinal | undefined>;
  createOrdinal(ordinal: InsertOrdinal): Promise<Ordinal>;
  getOrdinalsByOwner(owner: string): Promise<Ordinal[]>;
  getOrdinalsByCollection(collectionId: number): Promise<Ordinal[]>;
  
  // 3D Ordinal methods
  getThreeDOrdinalById(id: number): Promise<ThreeDOrdinal | undefined>;
  getThreeDOrdinalByInscriptionId(inscriptionId: string): Promise<ThreeDOrdinal | undefined>;
  createThreeDOrdinal(threeDOrdinal: InsertThreeDOrdinal): Promise<ThreeDOrdinal>;
  getThreeDOrdinalsByOwner(owner: string): Promise<ThreeDOrdinal[]>;
  getThreeDOrdinalsByCollection(collectionId: number): Promise<ThreeDOrdinal[]>;
  getRecentThreeDOrdinals(limit?: number): Promise<ThreeDOrdinal[]>;
  searchThreeDOrdinals(query: string): Promise<ThreeDOrdinal[]>;
  
  // Transaction methods
  getTransaction(id: number): Promise<MintingTransaction | undefined>;
  getTransactionByTransactionId(transactionId: string): Promise<MintingTransaction | undefined>;
  getTransactionByThreeDOrdinalId(threeDOrdinalId: number): Promise<MintingTransaction | undefined>;
  createTransaction(transaction: InsertMintingTransaction): Promise<MintingTransaction>;
  updateTransactionStatus(id: number, status: string): Promise<MintingTransaction>;
}

// In-memory implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private collections: Map<number, Collection>;
  private ordinals: Map<string, Ordinal>;
  private threeDOrdinals: Map<number, ThreeDOrdinal>;
  private transactions: Map<number, MintingTransaction>;
  
  private userId: number;
  private collectionId: number;
  private threeDOrdinalId: number;
  private transactionId: number;

  constructor() {
    this.users = new Map();
    this.collections = new Map();
    this.ordinals = new Map();
    this.threeDOrdinals = new Map();
    this.transactions = new Map();
    
    this.userId = 1;
    this.collectionId = 1;
    this.threeDOrdinalId = 1;
    this.transactionId = 1;
    
    // Initialize with sample data
    // Since we can't use async in constructor, we'll catch any errors silently
    this.initializeData().catch(err => {
      console.error("Error in initializeData:", err);
    });
  }

  private async initializeData() {
    try {
      // Add a sample collection
      const pixelFoxesCollection: InsertCollection = {
        collectionId: "pixel-foxes",
        name: "Pixel Foxes",
        description: "A collection of pixel art foxes as Ordinals",
        sampleImage: "https://mint-sites.s3.amazonaws.com/foxes/yellow-fox.png",
        maxSupply: 10000000,
        mintFee: 10000,
      };
      const collection = await this.createCollection(pixelFoxesCollection);
      
      // Add sample 3D models for the demo
      // These would be dynamically generated in a real implementation
      const sampleModels = [
        "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF/Fox.gltf",
        "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf",
        "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF/BoxAnimated.gltf"
      ];
      
      // Add sample ordinals without waiting for Promise resolution in the loop
      for (let i = 1; i <= 3; i++) {
        // Create a sample ordinal with a hardcoded ID for demo purposes
        const ordinalId = `ordinal-${Date.now()}-${i}`;
        const ordinal: Ordinal = {
          id: ordinalId,
          inscriptionId: `sample-inscription-${i}`,
          inscriptionNumber: 1000000 + i,
          content: `https://mint-sites.s3.amazonaws.com/foxes/sample-${i}.png`,
          contentType: "image/png",
          owner: "sample-owner-address",
          collectionId: collection.id,
          timestamp: new Date()
        };
        
        // Store the ordinal directly in the map
        this.ordinals.set(ordinalId, ordinal);
        
        // Create a 3D ordinal with a hardcoded ID
        const threeDOrdinalId = this.threeDOrdinalId++;
        const threeDOrdinal: ThreeDOrdinal = {
          id: threeDOrdinalId,
          inscriptionId: `sample-3d-inscription-${i}`,
          inscriptionNumber: 2000000 + i,
          modelUrl: sampleModels[i - 1],
          polygonCount: 5000 + (i * 1000),
          textureResolution: "2048x2048",
          fileSize: 1500000 + (i * 500000),
          format: "glTF",
          originalOrdinalId: parseInt(ordinal.id.toString()),
          owner: "sample-owner-address",
          collectionId: collection.id,
          timestamp: new Date()
        };
        
        // Store the 3D ordinal directly
        this.threeDOrdinals.set(threeDOrdinalId, threeDOrdinal);
        
        // Create a transaction
        const transactionId = this.transactionId++;
        const transaction: MintingTransaction = {
          id: transactionId,
          transactionId: `sample-tx-${i}`,
          status: "confirmed",
          inscriptionNumber: 2000000 + i,
          ordinalId: parseInt(ordinal.id.toString()),
          threeDOrdinalId: threeDOrdinal.id,
          owner: "sample-owner-address",
          fee: 12100,
          timestamp: new Date()
        };
        
        // Store the transaction
        this.transactions.set(transactionId, transaction);
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Collection methods
  async getCollection(id: number): Promise<Collection | undefined> {
    return this.collections.get(id);
  }

  async getCollectionByCollectionId(collectionId: string): Promise<Collection | undefined> {
    return Array.from(this.collections.values()).find(
      (collection) => collection.collectionId === collectionId,
    );
  }

  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = this.collectionId++;
    const timestamp = new Date();
    const collection: Collection = { ...insertCollection, id, timestamp };
    this.collections.set(id, collection);
    return collection;
  }

  async getAllCollections(): Promise<Collection[]> {
    return Array.from(this.collections.values());
  }

  // Ordinal methods
  async getOrdinalById(id: string): Promise<Ordinal | undefined> {
    return this.ordinals.get(id);
  }

  async getOrdinalByInscriptionId(inscriptionId: string): Promise<Ordinal | undefined> {
    return Array.from(this.ordinals.values()).find(
      (ordinal) => ordinal.inscriptionId === inscriptionId,
    );
  }

  async createOrdinal(insertOrdinal: InsertOrdinal): Promise<Ordinal> {
    const id = `ordinal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date();
    const ordinal: Ordinal = { ...insertOrdinal, id, timestamp };
    this.ordinals.set(id, ordinal);
    return ordinal;
  }

  async getOrdinalsByOwner(owner: string): Promise<Ordinal[]> {
    return Array.from(this.ordinals.values()).filter(
      (ordinal) => ordinal.owner === owner,
    );
  }

  async getOrdinalsByCollection(collectionId: number): Promise<Ordinal[]> {
    return Array.from(this.ordinals.values()).filter(
      (ordinal) => ordinal.collectionId === collectionId,
    );
  }

  // 3D Ordinal methods
  async getThreeDOrdinalById(id: number): Promise<ThreeDOrdinal | undefined> {
    return this.threeDOrdinals.get(id);
  }

  async getThreeDOrdinalByInscriptionId(inscriptionId: string): Promise<ThreeDOrdinal | undefined> {
    return Array.from(this.threeDOrdinals.values()).find(
      (ordinal) => ordinal.inscriptionId === inscriptionId,
    );
  }

  async createThreeDOrdinal(insertThreeDOrdinal: InsertThreeDOrdinal): Promise<ThreeDOrdinal> {
    const id = this.threeDOrdinalId++;
    const timestamp = new Date();
    const threeDOrdinal: ThreeDOrdinal = { ...insertThreeDOrdinal, id, timestamp };
    this.threeDOrdinals.set(id, threeDOrdinal);
    return threeDOrdinal;
  }

  async getThreeDOrdinalsByOwner(owner: string): Promise<ThreeDOrdinal[]> {
    return Array.from(this.threeDOrdinals.values()).filter(
      (ordinal) => ordinal.owner === owner,
    );
  }

  async getThreeDOrdinalsByCollection(collectionId: number): Promise<ThreeDOrdinal[]> {
    return Array.from(this.threeDOrdinals.values()).filter(
      (ordinal) => ordinal.collectionId === collectionId,
    );
  }

  async getRecentThreeDOrdinals(limit: number = 20): Promise<ThreeDOrdinal[]> {
    return Array.from(this.threeDOrdinals.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async searchThreeDOrdinals(query: string): Promise<ThreeDOrdinal[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.threeDOrdinals.values()).filter(
      (ordinal) => {
        // Match against inscription ID, collection name, or owner
        return ordinal.inscriptionId.toLowerCase().includes(lowerQuery) ||
               ordinal.owner.toLowerCase().includes(lowerQuery) ||
               ordinal.inscriptionNumber.toString().includes(lowerQuery);
      }
    );
  }

  // Transaction methods
  async getTransaction(id: number): Promise<MintingTransaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionByTransactionId(transactionId: string): Promise<MintingTransaction | undefined> {
    return Array.from(this.transactions.values()).find(
      (tx) => tx.transactionId === transactionId,
    );
  }

  async getTransactionByThreeDOrdinalId(threeDOrdinalId: number): Promise<MintingTransaction | undefined> {
    return Array.from(this.transactions.values()).find(
      (tx) => tx.threeDOrdinalId === threeDOrdinalId,
    );
  }

  async createTransaction(insertTransaction: InsertMintingTransaction): Promise<MintingTransaction> {
    const id = this.transactionId++;
    const timestamp = new Date();
    const transaction: MintingTransaction = { ...insertTransaction, id, timestamp };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransactionStatus(id: number, status: string): Promise<MintingTransaction> {
    const transaction = this.transactions.get(id);
    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }
    
    const updatedTransaction: MintingTransaction = {
      ...transaction,
      status,
    };
    
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
}

export const storage = new MemStorage();
