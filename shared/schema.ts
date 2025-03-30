import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
});

// Collections table
export const collections = pgTable("collections", {
  id: serial("id").primaryKey(),
  collectionId: text("collection_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  sampleImage: text("sample_image"),
  maxSupply: integer("max_supply").notNull(),
  mintFee: integer("mint_fee").notNull().default(10000),
});

export const insertCollectionSchema = createInsertSchema(collections).pick({
  collectionId: true,
  name: true,
  description: true,
  sampleImage: true,
  maxSupply: true,
  mintFee: true,
});

// Ordinals table
export const ordinals = pgTable("ordinals", {
  id: serial("id").primaryKey(),
  inscriptionId: text("inscription_id").notNull().unique(),
  inscriptionNumber: integer("inscription_number").notNull(),
  content: text("content").notNull(),
  contentType: text("content_type").notNull(),
  owner: text("owner").notNull(),
  collectionId: text("collection_id").references(() => collections.id),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertOrdinalSchema = createInsertSchema(ordinals).pick({
  inscriptionId: true,
  inscriptionNumber: true,
  content: true,
  contentType: true,
  owner: true,
  collectionId: true,
});

// 3D Ordinals table
export const threeDOrdinals = pgTable("three_d_ordinals", {
  id: serial("id").primaryKey(),
  inscriptionId: text("inscription_id").notNull().unique(),
  inscriptionNumber: integer("inscription_number").notNull(),
  modelUrl: text("model_url").notNull(),
  polygonCount: integer("polygon_count").notNull(),
  textureResolution: text("texture_resolution").notNull(),
  fileSize: integer("file_size").notNull(),
  format: text("format").notNull().default("glTF"),
  originalOrdinalId: integer("original_ordinal_id").references(() => ordinals.id),
  owner: text("owner").notNull(),
  collectionId: text("collection_id").references(() => collections.id),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertThreeDOrdinalSchema = createInsertSchema(threeDOrdinals).pick({
  inscriptionId: true,
  inscriptionNumber: true,
  modelUrl: true,
  polygonCount: true,
  textureResolution: true,
  fileSize: true,
  format: true,
  originalOrdinalId: true,
  owner: true,
  collectionId: true,
});

// Minting transactions table
export const mintingTransactions = pgTable("minting_transactions", {
  id: serial("id").primaryKey(),
  transactionId: text("transaction_id").notNull().unique(),
  status: text("status").notNull().default("pending"),
  inscriptionNumber: integer("inscription_number"),
  ordinalId: integer("ordinal_id").references(() => ordinals.id),
  threeDOrdinalId: integer("three_d_ordinal_id").references(() => threeDOrdinals.id),
  owner: text("owner").notNull(),
  fee: integer("fee").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertMintingTransactionSchema = createInsertSchema(mintingTransactions).pick({
  transactionId: true,
  status: true,
  inscriptionNumber: true,
  ordinalId: true,
  threeDOrdinalId: true,
  owner: true,
  fee: true,
});

// Define types for export
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCollection = z.infer<typeof insertCollectionSchema>;
export type Collection = typeof collections.$inferSelect;

export type InsertOrdinal = z.infer<typeof insertOrdinalSchema>;
export type Ordinal = typeof ordinals.$inferSelect;

export type InsertThreeDOrdinal = z.infer<typeof insertThreeDOrdinalSchema>;
export type ThreeDOrdinal = typeof threeDOrdinals.$inferSelect;

export type InsertMintingTransaction = z.infer<typeof insertMintingTransactionSchema>;
export type MintingTransaction = typeof mintingTransactions.$inferSelect;
