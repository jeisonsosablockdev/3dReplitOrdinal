import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { mintRequestSchema, mintResponseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for collections
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getAllCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  app.get("/api/collections/:name", async (req, res) => {
    try {
      const collectionName = req.params.name;
      const collection = await storage.getCollectionByName(collectionName);
      
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      
      res.json(collection);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collection" });
    }
  });

  // API routes for ordinals
  app.get("/api/ordinals/:id", async (req, res) => {
    try {
      const ordinalId = req.params.id;
      const ordinal = await storage.getOrdinalById(ordinalId);
      
      if (!ordinal) {
        return res.status(404).json({ message: "Ordinal not found" });
      }
      
      res.json(ordinal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ordinal" });
    }
  });

  app.post("/api/ordinals/validate", async (req, res) => {
    try {
      const { ordinalId, walletAddress } = req.body;
      
      if (!ordinalId || !walletAddress) {
        return res.status(400).json({ message: "Missing ordinalId or walletAddress" });
      }
      
      const isValid = await storage.validateOrdinalOwnership(ordinalId, walletAddress);
      
      res.json({ valid: isValid });
    } catch (error) {
      res.status(500).json({ message: "Failed to validate ordinal" });
    }
  });

  // API routes for 3D artifacts
  app.get("/api/three-d-artifacts/examples", async (req, res) => {
    try {
      const examples = await storage.getExampleThreeDOrdinals();
      res.json(examples);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch examples" });
    }
  });

  app.get("/api/three-d-artifacts/:id", async (req, res) => {
    try {
      const artifactId = parseInt(req.params.id);
      
      if (isNaN(artifactId)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const artifact = await storage.getThreeDById(artifactId);
      
      if (!artifact) {
        return res.status(404).json({ message: "3D artifact not found" });
      }
      
      res.json(artifact);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch 3D artifact" });
    }
  });

  // API route for minting 3D ordinals
  app.post("/api/mint", async (req, res) => {
    try {
      // Validate the request body
      const result = mintRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: result.error.errors 
        });
      }
      
      const { ordinalId, walletAddress } = result.data;
      
      // Check if the ordinal exists and belongs to the wallet
      const isValid = await storage.validateOrdinalOwnership(ordinalId, walletAddress);
      
      if (!isValid) {
        return res.status(403).json({ 
          message: "Ordinal does not belong to this wallet or is invalid" 
        });
      }
      
      // Generate 3D model and mint to blockchain
      const mintResult = await storage.mintThreeDOrdinal(ordinalId, walletAddress);
      
      res.status(200).json(mintResult);
    } catch (error) {
      console.error("Mint error:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to mint 3D ordinal",
        errorDetails: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
