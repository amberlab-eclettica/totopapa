import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - for storing registered users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  title: text("title").notNull(),
  password: text("password").notNull(),
});

// Cardinals table - for storing cardinal candidates
export const cardinals = pgTable("cardinals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  age: integer("age").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
});

// Votes table - for storing votes
export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cardinalId: integer("cardinal_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// News table - for storing anonymous news posts
export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  title: true,
  password: true,
});

export const insertCardinalSchema = createInsertSchema(cardinals).pick({
  name: true,
  title: true,
  age: true,
  description: true,
  imageUrl: true,
});

export const insertVoteSchema = createInsertSchema(votes).pick({
  userId: true,
  cardinalId: true,
});

export const insertNewsSchema = createInsertSchema(news).pick({
  title: true,
  content: true,
  category: true,
});

// Create types for schema
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCardinal = z.infer<typeof insertCardinalSchema>;
export type Cardinal = typeof cardinals.$inferSelect;

export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;

export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;

// Create extended validation schemas
export const userValidationSchema = insertUserSchema.extend({
  username: z.string().min(2, { message: "Il nome deve contenere almeno 2 caratteri" }),
  title: z.string().min(2, { message: "Il titolo deve contenere almeno 2 caratteri" }),
  password: z.string().min(4, { message: "La password deve contenere almeno 4 caratteri" }),
});

export const cardinalValidationSchema = insertCardinalSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  age: z.number().min(50, { message: "Cardinals must be at least 50 years old" }).max(120, { message: "Cardinals must be at most 120 years old" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  imageUrl: z.string().url({ message: "Image URL must be valid" }),
});

export const newsValidationSchema = insertNewsSchema.extend({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  category: z.enum(["hot-gossip", "innovation", "entertainment", "controversy", "miracle"]),
});
