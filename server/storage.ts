import { Certificate, InsertCertificate, User, InsertUser, certificates } from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Certificate operations
  getCertificate(id: number): Promise<Certificate | undefined>;
  getCertificateByIpfsHash(ipfsHash: string): Promise<Certificate | undefined>;
  getAllCertificates(): Promise<Certificate[]>;
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  
  // User operations (kept for compatibility)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private certificates: Map<number, Certificate>;
  private userCurrentId: number;
  private certificateCurrentId: number;

  constructor() {
    this.users = new Map();
    this.certificates = new Map();
    this.userCurrentId = 1;
    this.certificateCurrentId = 1;
  }

  // Certificate operations
  async getCertificate(id: number): Promise<Certificate | undefined> {
    return this.certificates.get(id);
  }

  async getCertificateByIpfsHash(ipfsHash: string): Promise<Certificate | undefined> {
    return Array.from(this.certificates.values()).find(
      (cert) => cert.ipfsHash === ipfsHash
    );
  }

  async getAllCertificates(): Promise<Certificate[]> {
    return Array.from(this.certificates.values());
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const id = this.certificateCurrentId++;
    // Make sure all required fields are present
    const certificate: Certificate = { 
      ...insertCertificate, 
      id,
      transactionHash: insertCertificate.transactionHash || ''
    };
    this.certificates.set(id, certificate);
    return certificate;
  }

  // User operations (kept for compatibility)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
