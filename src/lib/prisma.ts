// import ws from 'ws'
import { PrismaClient } from '@prisma/client'
// import { PrismaClient } from '../generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';
// import { PrismaNeon } from '@prisma/adapter-neon'
// import { Pool, neonConfig } from '@neondatabase/serverless'

const prismaClientSingleton = () => {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  }).$extends(withAccelerate());

  return prisma;
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export { userCrud } from './crud/user';
export { productCrud } from './crud/product';
export { categoryCrud } from './crud/category';
export { orderCrud } from './crud/order';
export { quoteCrud } from './crud/quote';
export { appointmentCrud } from './crud/appointment';
export { cartCrud } from './crud/cart';
export { invoiceCrud } from './crud/invoice';
export { expenseCrud } from './crud/expense';
