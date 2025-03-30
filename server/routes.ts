import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { bsvService } from "./services/bsvService";
import { threeJsService } from "./services/threeJsService";
import { z } from "zod";

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize services
  await bsvService.init();
  await threeJsService.init();

  // API routes - all prefixed with /api
  // Validate an ordinal
  app.post("/api/ordinals/validate", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      const walletAddress = req.body.wallet;
      const collectionId = req.body.collectionId;

      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          error: "Wallet address is required",
        });
      }

      const validationResult = await bsvService.validateOrdinal(
        req.file.buffer,
        walletAddress,
        collectionId
      );

      return res.json({
        success: true,
        data: validationResult,
      });
    } catch (error) {
      console.error("Error validating ordinal:", error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message || "Failed to validate ordinal",
      });
    }
  });

  // Generate 3D model from ordinal
  app.get("/api/ordinals/generate3d/:id", async (req, res) => {
    try {
      const ordinalId = req.params.id;
      
      // Get the original ordinal
      const ordinal = await storage.getOrdinalById(ordinalId);
      
      if (!ordinal) {
        return res.status(404).json({
          success: false,
          error: "Ordinal not found",
        });
      }

      // Generate or retrieve the 3D model
      const threeDOrdinal = await threeJsService.generateThreeDModel(ordinal);

      return res.json({
        success: true,
        data: threeDOrdinal,
      });
    } catch (error) {
      console.error("Error generating 3D model:", error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message || "Failed to generate 3D model",
      });
    }
  });

  // Mint a 3D ordinal
  app.post("/api/ordinals/mint3d", async (req, res) => {
    try {
      const schema = z.object({
        ordinalId: z.string(),
        quality: z.string(),
        wallet: z.string(),
      });

      const { ordinalId, quality, wallet } = schema.parse(req.body);

      // Get the original ordinal
      const ordinal = await storage.getOrdinalById(ordinalId);
      
      if (!ordinal) {
        return res.status(404).json({
          success: false,
          error: "Ordinal not found",
        });
      }

      // Check if the user owns the ordinal
      const isOwner = await bsvService.verifyOwnership(ordinalId, wallet);
      
      if (!isOwner) {
        return res.status(403).json({
          success: false,
          error: "You do not own this ordinal",
        });
      }

      // Generate or retrieve the 3D model with the selected quality
      const threeDOrdinal = await threeJsService.generateThreeDModel(ordinal, quality);

      // Mint the 3D ordinal on the blockchain
      const mintResult = await bsvService.mintThreeDOrdinal(threeDOrdinal, wallet, quality);

      return res.json({
        success: true,
        data: mintResult,
      });
    } catch (error) {
      console.error("Error minting 3D ordinal:", error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message || "Failed to mint 3D ordinal",
      });
    }
  });

  // Get a single ordinal by ID
  app.get("/api/ordinals/:id", async (req, res) => {
    try {
      const ordinalId = req.params.id;
      const ordinal = await storage.getOrdinalById(ordinalId);
      
      if (!ordinal) {
        return res.status(404).json({
          success: false,
          error: "Ordinal not found",
        });
      }

      return res.json({
        success: true,
        data: ordinal,
      });
    } catch (error) {
      console.error("Error getting ordinal:", error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message || "Failed to get ordinal",
      });
    }
  });

  // Get transaction details
  app.get("/api/ordinals/mint3d/transactions/:id", async (req, res) => {
    try {
      const threeDOrdinalId = req.params.id;
      const transaction = await storage.getTransactionByThreeDOrdinalId(parseInt(threeDOrdinalId));
      
      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: "Transaction not found",
        });
      }

      return res.json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      console.error("Error getting transaction:", error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message || "Failed to get transaction",
      });
    }
  });

  // Get recent ordinals
  app.get("/api/ordinals/recent", async (req, res) => {
    try {
      const recentOrdinals = await storage.getRecentThreeDOrdinals();

      return res.json({
        success: true,
        data: recentOrdinals,
      });
    } catch (error) {
      console.error("Error getting recent ordinals:", error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message || "Failed to get recent ordinals",
      });
    }
  });

  // Get user's ordinals
  app.get("/api/ordinals/user/:address", async (req, res) => {
    try {
      const address = req.params.address;
      const userOrdinals = await storage.getThreeDOrdinalsByOwner(address);

      return res.json({
        success: true,
        data: userOrdinals,
      });
    } catch (error) {
      console.error("Error getting user ordinals:", error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message || "Failed to get user ordinals",
      });
    }
  });

  // Search ordinals
  app.get("/api/ordinals/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.length < 3) {
        return res.status(400).json({
          success: false,
          error: "Search query must be at least 3 characters",
        });
      }
      
      const searchResults = await storage.searchThreeDOrdinals(query);

      return res.json({
        success: true,
        data: searchResults,
      });
    } catch (error) {
      console.error("Error searching ordinals:", error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message || "Failed to search ordinals",
      });
    }
  });

  // Get collections
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getAllCollections();

      return res.json({
        success: true,
        data: collections,
      });
    } catch (error) {
      console.error("Error getting collections:", error);
      return res.status(500).json({
        success: false,
        error: (error as Error).message || "Failed to get collections",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
