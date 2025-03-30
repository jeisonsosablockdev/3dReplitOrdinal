import { 
  users, type User, type InsertUser,
  collections, type Collection, type InsertCollection,
  ordinals, type Ordinal, type InsertOrdinal,
  threeDArtifacts, type ThreeDArtifact, type InsertThreeD,
  MintResponse
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Collection operations
  getAllCollections(): Promise<Collection[]>;
  getCollectionByName(name: string): Promise<Collection | undefined>;
  createCollection(collection: InsertCollection): Promise<Collection>;
  updateCollection(id: number, updates: Partial<InsertCollection>): Promise<Collection | undefined>;
  
  // Ordinal operations
  getOrdinalById(ordinalId: string): Promise<Ordinal | undefined>;
  createOrdinal(ordinal: InsertOrdinal): Promise<Ordinal>;
  validateOrdinalOwnership(ordinalId: string, walletAddress: string): Promise<boolean>;
  
  // 3D Ordinal operations
  getThreeDById(id: number): Promise<ThreeDArtifact | undefined>;
  getExampleThreeDOrdinals(): Promise<ThreeDArtifact[]>;
  createThreeD(threeD: InsertThreeD): Promise<ThreeDArtifact>;
  updateThreeD(id: number, updates: Partial<InsertThreeD>): Promise<ThreeDArtifact | undefined>;
  mintThreeDOrdinal(ordinalId: string, walletAddress: string): Promise<MintResponse>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private collectionsMap: Map<number, Collection>;
  private ordinalsMap: Map<string, Ordinal>;
  private threeDMap: Map<number, ThreeDArtifact>;
  
  private userIdCounter: number;
  private collectionIdCounter: number;
  private threeDIdCounter: number;
  
  constructor() {
    this.usersMap = new Map();
    this.collectionsMap = new Map();
    this.ordinalsMap = new Map();
    this.threeDMap = new Map();
    
    this.userIdCounter = 1;
    this.collectionIdCounter = 1;
    this.threeDIdCounter = 1;
    
    // Initialize with some example data
    this.initializeExampleData();
  }
  
  private initializeExampleData() {
    // Create a sample collection
    const pixelFoxesCollection: InsertCollection = {
      name: "Pixel Foxes",
      maxSupply: 10000000,
      minted: 2716039,
      threeDMinted: 1243,
      mintFee: 10000, // 10,000 satoshis
      imageUrl: "https://mint-sites.s3.amazonaws.com/foxes/yellow-fox.png",
      metadata: {
        description: "A collection of pixel art foxes on the BSV blockchain"
      }
    };
    this.createCollection(pixelFoxesCollection);
    
    // Create some example 3D artifacts
    const exampleArtifacts: InsertThreeD[] = [
      {
        originalOrdinalId: "1234...5678",
        modelUrl: "/models/pixel-fox-247.glb",
        owner: "Example Owner",
        status: "completed",
        metadata: { name: "Pixel Fox #247", mintedDaysAgo: 3 }
      },
      {
        originalOrdinalId: "5678...9012",
        modelUrl: "/models/pixel-fox-592.glb",
        owner: "Example Owner",
        status: "completed",
        metadata: { name: "Pixel Fox #592", mintedDaysAgo: 7 }
      },
      {
        originalOrdinalId: "9012...3456",
        modelUrl: "/models/pixel-fox-136.glb",
        owner: "Example Owner",
        status: "completed",
        metadata: { name: "Pixel Fox #136", mintedDaysAgo: 14 }
      },
      {
        originalOrdinalId: "3456...7890",
        modelUrl: "/models/pixel-fox-429.glb",
        owner: "Example Owner",
        status: "completed",
        metadata: { name: "Pixel Fox #429", mintedDaysAgo: 30 }
      }
    ];
    
    exampleArtifacts.forEach(artifact => this.createThreeD(artifact));
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.usersMap.set(id, user);
    return user;
  }
  
  // Collection operations
  async getAllCollections(): Promise<Collection[]> {
    return Array.from(this.collectionsMap.values());
  }
  
  async getCollectionByName(name: string): Promise<Collection | undefined> {
    return Array.from(this.collectionsMap.values()).find(
      (collection) => collection.name === name
    );
  }
  
  async createCollection(insertCollection: InsertCollection): Promise<Collection> {
    const id = this.collectionIdCounter++;
    const collection: Collection = { ...insertCollection, id };
    this.collectionsMap.set(id, collection);
    return collection;
  }
  
  async updateCollection(id: number, updates: Partial<InsertCollection>): Promise<Collection | undefined> {
    const collection = this.collectionsMap.get(id);
    if (!collection) return undefined;
    
    const updatedCollection = { ...collection, ...updates };
    this.collectionsMap.set(id, updatedCollection);
    return updatedCollection;
  }
  
  // Ordinal operations
  async getOrdinalById(ordinalId: string): Promise<Ordinal | undefined> {
    return this.ordinalsMap.get(ordinalId);
  }
  
  async createOrdinal(insertOrdinal: InsertOrdinal): Promise<Ordinal> {
    const ordinal: Ordinal = { ...insertOrdinal, id: this.ordinalsMap.size + 1, createdAt: new Date() };
    this.ordinalsMap.set(ordinal.ordinalId, ordinal);
    return ordinal;
  }
  
  async validateOrdinalOwnership(ordinalId: string, walletAddress: string): Promise<boolean> {
    // In a real implementation, this would check the blockchain
    // For this demo, we'll simulate ownership validation
    
    // If the ordinal exists in our map, check the owner
    const ordinal = this.ordinalsMap.get(ordinalId);
    if (ordinal) {
      return ordinal.owner === walletAddress;
    }
    
    // If we don't have the ordinal in our database yet, we'll assume it's valid
    // In a real implementation, this would query the blockchain
    return true;
  }
  
  // 3D Ordinal operations
  async getThreeDById(id: number): Promise<ThreeDArtifact | undefined> {
    return this.threeDMap.get(id);
  }
  
  async getExampleThreeDOrdinals(): Promise<ThreeDArtifact[]> {
    return Array.from(this.threeDMap.values());
  }
  
  async createThreeD(insertThreeD: InsertThreeD): Promise<ThreeDArtifact> {
    const id = this.threeDIdCounter++;
    const threeD: ThreeDArtifact = { 
      ...insertThreeD, 
      id, 
      newOrdinalId: insertThreeD.newOrdinalId || `3d-${Date.now()}-${id}`,
      createdAt: new Date()
    };
    this.threeDMap.set(id, threeD);
    return threeD;
  }
  
  async updateThreeD(id: number, updates: Partial<InsertThreeD>): Promise<ThreeDArtifact | undefined> {
    const threeD = this.threeDMap.get(id);
    if (!threeD) return undefined;
    
    const updatedThreeD = { ...threeD, ...updates };
    this.threeDMap.set(id, updatedThreeD);
    return updatedThreeD;
  }
  
  async mintThreeDOrdinal(ordinalId: string, walletAddress: string): Promise<MintResponse> {
    try {
      // In a real implementation, this would:
      // 1. Generate a 3D model from the 2D Ordinal
      // 2. Create a transaction on the BSV blockchain to mint the new Ordinal
      // 3. Return the transaction ID and the new Ordinal ID
      
      // For this demo, we'll create a simulated 3D artifact
      const newOrdinalId = `3d-${Date.now()}-${ordinalId}`;
      const txId = `tx_${Math.random().toString(36).substring(2, 15)}`;
      
      // Create the 3D artifact in our storage
      const threeDOrdinal = await this.createThreeD({
        originalOrdinalId: ordinalId,
        newOrdinalId,
        modelUrl: `/models/generated-${Date.now()}.glb`, // This would be a real URL
        owner: walletAddress,
        status: "completed",
        txId,
        metadata: { 
          name: `3D Ordinal from ${ordinalId}`,
          generatedAt: new Date().toISOString()
        }
      });
      
      // Get the associated collection
      const ordinal = this.ordinalsMap.get(ordinalId);
      if (ordinal) {
        const collection = Array.from(this.collectionsMap.values()).find(
          c => c.name === ordinal.collectionName
        );
        
        // Update the collection's 3D minted count
        if (collection) {
          await this.updateCollection(collection.id, {
            threeDMinted: collection.threeDMinted + 1
          });
        }
      }
      
      return {
        success: true,
        message: "Successfully minted 3D Ordinal",
        txId,
        newOrdinalId
      };
    } catch (error) {
      console.error("Error minting 3D Ordinal:", error);
      return {
        success: false,
        message: "Failed to mint 3D Ordinal",
        errorDetails: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}

// Create and export the storage instance
export const storage = new MemStorage();
