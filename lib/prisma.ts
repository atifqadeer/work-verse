import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaUrl?: string;
};

function resolveDatabaseUrl() {
  let url = process.env.DATABASE_URL || 'mysql://root:@127.0.0.1:3306/workverse';
  url = url.replace('://root:password@', '://root:@');
  url = url.replace(/^mysql:\/\/([^:/@]+)@/, 'mysql://$1:@');
  url = url.replace('@localhost:', '@127.0.0.1:');
  return url;
}

function createPrisma(url: string) {
  return new PrismaClient({
    datasources: { db: { url } },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
  });
}

const databaseUrl = resolveDatabaseUrl();

export const prisma =
  globalForPrisma.prisma && globalForPrisma.prismaUrl === databaseUrl
    ? globalForPrisma.prisma
    : createPrisma(databaseUrl);

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaUrl = databaseUrl;
}
