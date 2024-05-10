// lib/prisma.js
import { PrismaClient } from '../prisma/generated/prisma';

let prisma;

// Check if we're running on the server to prevent trying to instantiate PrismaClient on the client-side.
if (typeof window === "undefined") {
    // In production environment, always create a new Prisma Client.
    if (process.env.NODE_ENV === 'production') {
        prisma = new PrismaClient();
    } else {
        // In development, use a global variable so that the Prisma Client
        // can be reused throughout hot reloads saving connections to the database.
        if (!global.prisma) {
            global.prisma = new PrismaClient();
        }
        prisma = global.prisma;
    }
}

export default prisma;
