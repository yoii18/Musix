import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

declare global {
    namespace Express {
      interface Request {
        username?: string,
        user?: prisma.userSchema, 
      }
    }
  }
  
  export {};