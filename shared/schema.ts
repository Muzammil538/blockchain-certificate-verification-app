import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Certificate table schema
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  courseName: text("course_name").notNull(),
  ipfsHash: text("ipfs_hash").notNull().unique(),
  date: integer("date").notNull(), // Unix timestamp
  transactionHash: text("transaction_hash").notNull().default(''),
});

// Schema for inserting a certificate
export const insertCertificateSchema = createInsertSchema(certificates).pick({
  studentName: true,
  courseName: true,
  ipfsHash: true,
  date: true,
  transactionHash: true,
});

// Types
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;

// User schema kept for compatibility with existing code
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
