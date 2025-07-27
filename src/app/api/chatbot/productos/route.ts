import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const productos = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
    },
    where: {
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
  return NextResponse.json({ productos });
}
