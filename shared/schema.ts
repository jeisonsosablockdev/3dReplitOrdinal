import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Ordinal model to store information about uploaded ordinals
export const ordinals = pgTable("ordinals", {
  id: serial("id").primaryKey(),
  ordinalId: text("ordinal_id").notNull().unique(),
  collectionName: text("collection_name").notNull(),
  owner: text("owner").notNull(),
  imageUrl: text("image_url").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrdinalSchema = createInsertSchema(ordinals).omit({
  id: true,
  createdAt: true,
});

export type InsertOrdinal = z.infer<typeof insertOrdinalSchema>;
export type Ordinal = typeof ordinals.$inferSelect;

// 3D Ordinal model to store generated 3D models
export const threeDArtifacts = pgTable("three_d_artifacts", {
  id: serial("id").primaryKey(),
  originalOrdinalId: text("original_ordinal_id").notNull(),
  newOrdinalId: text("new_ordinal_id").unique(),
  modelUrl: text("model_url").notNull(),
  owner: text("owner").notNull(),
  status: text("status").notNull(), // pending, generating, minting, completed, failed
  txId: text("tx_id"), // Transaction ID when minted
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertThreeDSchema = createInsertSchema(threeDArtifacts).omit({
  id: true,
  newOrdinalId: true,
  txId: true,
  createdAt: true,
});

export type InsertThreeD = z.infer<typeof insertThreeDSchema>;
export type ThreeDArtifact = typeof threeDArtifacts.$inferSelect;

// Collections model to store information about supported collections
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  maxSupply: integer("max_supply").notNull(),
  minted: integer("minted").notNull(),
  threeDMinted: integer("three_d_minted").notNull(),
  mintFee: integer("mint_fee").notNull(), // In satoshis
  imageUrl: text("image_url"),
  metadata: jsonb("metadata"),
});

export const insertCollectionSchema = createInsertSchema(collections).omit({
  id: true,
});

export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Collection = typeof collections.$inferSelect;

// Validation schema for the minting request
export const mintRequestSchema = z.object({
  ordinalId: z.string().min(1, "Ordinal ID is required"),
  walletAddress: z.string().min(1, "Wallet address is required"),
});

export type MintRequest = z.infer<typeof mintRequestSchema>;

// Response type for minting operation
export const mintResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  txId: z.string().optional(),
  newOrdinalId: z.string().optional(),
  errorDetails: z.string().optional(),
});

export type MintResponse = z.infer<typeof mintResponseSchema>;
