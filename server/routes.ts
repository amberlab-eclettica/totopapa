import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  cardinalValidationSchema, 
  insertCardinalSchema, 
  insertNewsSchema, 
  insertUserSchema, 
  insertVoteSchema, 
  newsValidationSchema, 
  userValidationSchema 
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/ping", (req: Request, res: Response) => {
    res.json({ message: "pong" });
  });

  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const validatedData = userValidationSchema.parse(req.body);
      
      // Check if user with the same username exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        // Check if password matches (login functionality)
        if (existingUser.password !== validatedData.password) {
          return res.status(401).json({ message: "Password non corretta" });
        }
        
        // Password matches, return the existing user
        return res.status(200).json(existingUser);
      }
      
      // If user doesn't exist, create a new one (registration)
      const user = await storage.createUser(validatedData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Cardinal routes
  app.get("/api/cardinals", async (req: Request, res: Response) => {
    try {
      const cardinals = await storage.getAllCardinals();
      
      // For each cardinal, get the vote count
      const cardinalsWithVotes = await Promise.all(cardinals.map(async (cardinal) => {
        const voteCount = await storage.getVoteCountByCardinalId(cardinal.id);
        return { ...cardinal, voteCount };
      }));
      
      res.json(cardinalsWithVotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to get cardinals" });
    }
  });

  app.post("/api/cardinals", async (req: Request, res: Response) => {
    try {
      const validatedData = cardinalValidationSchema.parse(req.body);
      const cardinal = await storage.createCardinal(validatedData);
      res.status(201).json(cardinal);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      res.status(500).json({ message: "Failed to create cardinal" });
    }
  });

  app.get("/api/cardinals/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid cardinal ID" });
    }

    try {
      const cardinal = await storage.getCardinal(id);
      if (!cardinal) {
        return res.status(404).json({ message: "Cardinal not found" });
      }
      
      const voteCount = await storage.getVoteCountByCardinalId(cardinal.id);
      res.json({ ...cardinal, voteCount });
    } catch (error) {
      res.status(500).json({ message: "Failed to get cardinal" });
    }
  });

  // Vote routes
  app.post("/api/votes", async (req: Request, res: Response) => {
    try {
      const validatedData = insertVoteSchema.parse(req.body);
      
      // Check if user exists
      const user = await storage.getUser(validatedData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if cardinal exists
      const cardinal = await storage.getCardinal(validatedData.cardinalId);
      if (!cardinal) {
        return res.status(404).json({ message: "Cardinal not found" });
      }
      
      const vote = await storage.createVote(validatedData);
      res.status(201).json(vote);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      res.status(500).json({ message: "Failed to create vote" });
    }
  });

  app.get("/api/votes/stats", async (req: Request, res: Response) => {
    try {
      const cardinals = await storage.getAllCardinals();
      const votes = await storage.getAllVotes();
      
      // Get vote counts for each cardinal
      const voteCounts = await Promise.all(cardinals.map(async (cardinal) => {
        const count = await storage.getVoteCountByCardinalId(cardinal.id);
        return { 
          cardinalId: cardinal.id, 
          name: cardinal.name,
          title: cardinal.title,
          count 
        };
      }));
      
      // Sort by vote count (descending)
      voteCounts.sort((a, b) => b.count - a.count);
      
      // Calculate total votes
      const totalVotes = votes.length;
      
      // Calculate percentage for each cardinal
      const voteStats = voteCounts.map(stats => ({
        ...stats,
        percentage: totalVotes > 0 ? Math.round((stats.count / totalVotes) * 100) : 0
      }));
      
      // Get recent votes (last 10)
      const recentVotes = await Promise.all(
        votes
          .sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 10)
          .map(async (vote) => {
            const user = await storage.getUser(vote.userId);
            const cardinal = await storage.getCardinal(vote.cardinalId);
            return {
              id: vote.id,
              userName: user?.username || "Unknown",
              userTitle: user?.title || "Unknown",
              cardinalName: cardinal?.name || "Unknown",
              timestamp: vote.createdAt
            };
          })
      );
      
      // Get unique voters count
      const uniqueVoterIds = new Set(votes.map(vote => vote.userId));
      const uniqueVotersCount = uniqueVoterIds.size;
      
      res.json({
        voteStats,
        totalVotes,
        uniqueVotersCount,
        recentVotes,
        leadingCandidate: voteStats.length > 0 ? voteStats[0] : null
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get vote statistics" });
    }
  });

  app.get("/api/votes/user/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
      const userVote = await storage.getUserVote(userId);
      if (!userVote) {
        return res.json({ hasVoted: false });
      }
      
      const cardinal = await storage.getCardinal(userVote.cardinalId);
      res.json({ 
        hasVoted: true, 
        vote: {
          ...userVote,
          cardinalName: cardinal?.name || "Unknown"
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user vote" });
    }
  });

  // News routes
  app.get("/api/news", async (req: Request, res: Response) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to get news" });
    }
  });

  app.post("/api/news", async (req: Request, res: Response) => {
    try {
      const validatedData = newsValidationSchema.parse(req.body);
      const news = await storage.createNews(validatedData);
      res.status(201).json(news);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: fromZodError(error).message 
        });
      }
      res.status(500).json({ message: "Failed to create news" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
