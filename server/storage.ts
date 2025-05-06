import {
  User,
  InsertUser,
  Cardinal,
  InsertCardinal,
  Vote,
  InsertVote,
  News,
  InsertNews,
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Cardinal operations
  getCardinal(id: number): Promise<Cardinal | undefined>;
  createCardinal(cardinal: InsertCardinal): Promise<Cardinal>;
  getAllCardinals(): Promise<Cardinal[]>;

  // Vote operations
  createVote(vote: InsertVote): Promise<Vote>;
  getVotesByCardinalId(cardinalId: number): Promise<Vote[]>;
  getVotesByUserId(userId: number): Promise<Vote[]>;
  getAllVotes(): Promise<Vote[]>;
  getVoteCountByCardinalId(cardinalId: number): Promise<number>;
  getUserVote(userId: number): Promise<Vote | undefined>;

  // News operations
  createNews(news: InsertNews): Promise<News>;
  getAllNews(): Promise<News[]>;
  getNewsById(id: number): Promise<News | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cardinals: Map<number, Cardinal>;
  private votes: Map<number, Vote>;
  private news: Map<number, News>;
  private userIdCounter: number;
  private cardinalIdCounter: number;
  private voteIdCounter: number;
  private newsIdCounter: number;

  constructor() {
    this.users = new Map();
    this.cardinals = new Map();
    this.votes = new Map();
    this.news = new Map();
    this.userIdCounter = 1;
    this.cardinalIdCounter = 1;
    this.voteIdCounter = 1;
    this.newsIdCounter = 1;

    // Initialize with some sample cardinals, users and news
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample user
    const sampleUser: InsertUser = {
      username: "admin",
      title: "Amministratore del Conclave",
      password: "password",
    };
    this.createUser(sampleUser);

    // Real potential papal candidates based on the article
    const cardinals: InsertCardinal[] = [
      {
        name: "Luis Antonio Tagle",
        title: "Cardinale delle Filippine",
        age: 67,
        description:
          "Figura di spicco nella Chiesa asiatica, è considerato un candidato forte per essere il primo papa asiatico. Attualmente è pro-prefetto del Dicastero per l'evangelizzazione.",
        imageUrl:
          "https://www.ilpost.it/wp-content/uploads/2025/05/02/1746174890-ilpost_20250502103309724_2c8d19516d77660eb2b2ecbc24a5f3b7.jpg",
      },
      {
        name: "José Tolentino de Mendonça",
        title: "Cardinale portoghese",
        age: 58,
        description:
          "Teologo e poeta, è uno dei cardinali più giovani e prefetto del Dicastero per la cultura e l'educazione. È considerato un intellettuale con una visione moderna della Chiesa.",
        imageUrl:
          "https://www.repstatic.it/content/nazionale/img/2025/05/04/234557343-581c37a8-9dc7-4d40-b6fd-f9dda1d7395d.jpg",
      },
      {
        name: "Matteo Zuppi",
        title: "Cardinale di Bologna",
        age: 68,
        description:
          "Presidente della Conferenza Episcopale Italiana, è conosciuto per le sue posizioni progressiste e il suo impegno sociale. Ha lavorato con la Comunità di Sant'Egidio sui corridoi umanitari.",
        imageUrl:
          "https://www.avvenire.it/c/2022/PublishingImages/a4d43bfd04a14761ae944880acb844e5/5139.jpg",
      },
      {
        name: "Pietro Parolin",
        title: "Segretario di Stato Vaticano",
        age: 69,
        description:
          "Diplomatico vaticano di lunga carriera, è il principale consigliere di Papa Francesco e la figura di maggior spicco nella gestione politica del Vaticano.",
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQB7NVSB8rr5uawx7qE-fv_TaRdeIS6jxL9hA&s",
      },
      {
        name: "Robert Prevost",
        title: "Cardinale americano",
        age: 69,
        description:
          "Prefetto del Dicastero per i vescovi, ha un ruolo cruciale nella nomina dei futuri vescovi. Potrebbe rappresentare un equilibrio tra continuità e rinnovamento.",
        imageUrl:
          "https://media.vaticannews.va/media/content/dam-archive/vaticannews/multimedia/2023/05/04/00003_15042023.jpg/_jcr_content/renditions/cq5dam.thumbnail.cropped.750.422.jpeg",
      },
      {
        name: "Jean-Claude Hollerich",
        title: "Cardinale lussemburghese",
        age: 65,
        description:
          "Relatore generale del Sinodo sulla sinodalità, è considerato un riformatore con buoni rapporti sia con i progressisti che con i conservatori della Chiesa.",
        imageUrl:
          "https://media.vaticannews.va/media/content/dam-archive/vaticannews/multimedia/2019/10/05/Senza-titolo-13.jpg/_jcr_content/renditions/cq5dam.thumbnail.cropped.750.422.jpeg",
      },
    ];

    // Sample news in Italian
    const newsItems: InsertNews[] = [
      {
        title:
          "Il Cardinale Zuppi sorpreso a fare jogging in Piazza San Pietro",
        content:
          "Fonti vicine al Vaticano riferiscono che il Cardinale Matteo Zuppi è stato avvistato all'alba mentre faceva jogging intorno alla Piazza San Pietro. Quando interpellato, avrebbe dichiarato che 'una mente sana in un corpo sano è essenziale per lo spirito'. Diversi altri cardinali starebbero valutando di unirsi alla sua routine mattutina.",
        category: "hot-gossip",
      },
      {
        title:
          "Il Cardinale Tolentino propone un'app per le preghiere quotidiane",
        content:
          "In una mossa che ha sorpreso i cardinali più tradizionalisti, José Tolentino de Mendonça ha suggerito la creazione di un'app ufficiale del Vaticano per le preghiere quotidiane. 'La Chiesa deve parlare il linguaggio dei giovani', avrebbe dichiarato durante una riunione. Il Dicastero per la comunicazione starebbe già lavorando al progetto.",
        category: "innovation",
      },
      {
        title:
          "Sfida culinaria: Cardinali si sfidano in una gara segreta di pasta",
        content:
          "Cosa succede quando il conclave fa una pausa per cena? Secondo le nostre fonti, una accesa competizione di preparazione della pasta è scoppiata nelle cucine vaticane la scorsa notte. La controversa carbonara del Cardinale Tagle (con panna!) ha di poco superato la 'troppo-veloce-per-assaggiarla' aglio e olio del Cardinale Parolin. Le Guardie Svizzere sarebbero state chiamate come giudici.",
        category: "entertainment",
      },
    ];

    // Add cardinals
    cardinals.forEach((cardinal) => {
      this.createCardinal(cardinal);
    });

    // Add news
    newsItems.forEach((news) => {
      this.createNews(news);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Cardinal operations
  async getCardinal(id: number): Promise<Cardinal | undefined> {
    return this.cardinals.get(id);
  }

  async createCardinal(insertCardinal: InsertCardinal): Promise<Cardinal> {
    const id = this.cardinalIdCounter++;
    const cardinal: Cardinal = { ...insertCardinal, id };
    this.cardinals.set(id, cardinal);
    return cardinal;
  }

  async getAllCardinals(): Promise<Cardinal[]> {
    return Array.from(this.cardinals.values());
  }

  // Vote operations
  async createVote(insertVote: InsertVote): Promise<Vote> {
    // Check if the user has already voted
    const existingVote = await this.getUserVote(insertVote.userId);

    if (existingVote) {
      // Update existing vote
      const updatedVote: Vote = {
        ...existingVote,
        cardinalId: insertVote.cardinalId, // Fixed: use the correct cardinalId from input
        createdAt: new Date(),
      };
      this.votes.set(existingVote.id, updatedVote);
      return updatedVote;
    } else {
      // Create new vote
      const id = this.voteIdCounter++;
      const vote: Vote = { ...insertVote, id, createdAt: new Date() };
      this.votes.set(id, vote);
      return vote;
    }
  }

  async getVotesByCardinalId(cardinalId: number): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter(
      (vote) => vote.cardinalId === cardinalId,
    );
  }

  async getVotesByUserId(userId: number): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter(
      (vote) => vote.userId === userId,
    );
  }

  async getAllVotes(): Promise<Vote[]> {
    return Array.from(this.votes.values());
  }

  async getVoteCountByCardinalId(cardinalId: number): Promise<number> {
    return (await this.getVotesByCardinalId(cardinalId)).length;
  }

  async getUserVote(userId: number): Promise<Vote | undefined> {
    return Array.from(this.votes.values()).find(
      (vote) => vote.userId === userId,
    );
  }

  // News operations
  async createNews(insertNews: InsertNews): Promise<News> {
    const id = this.newsIdCounter++;
    const news: News = { ...insertNews, id, createdAt: new Date() };
    this.news.set(id, news);
    return news;
  }

  async getAllNews(): Promise<News[]> {
    return Array.from(this.news.values()).sort((a, b) => {
      // Safely convert dates to timestamps
      const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return bTime - aTime;
    });
  }

  async getNewsById(id: number): Promise<News | undefined> {
    return this.news.get(id);
  }
}

export const storage = new MemStorage();
