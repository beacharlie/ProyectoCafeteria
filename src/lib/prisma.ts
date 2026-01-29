// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Evita múltiples conexiones en desarrollo si usas hot-reload (como nodemon)
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}