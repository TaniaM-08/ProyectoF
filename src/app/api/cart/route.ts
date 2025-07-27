import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  const { productId, userId } = body;
  if (!productId || !userId) {
    return NextResponse.json({ error: 'Faltan datos del producto o usuario.' }, { status: 400 });
  }
  // Si ya existe el producto en el carrito, solo aumenta la cantidad
  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
  let cartItem;
  if (existing) {
    cartItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      data: {
        quantity: existing.quantity + 1,
      },
    });
  } else {
    cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity: 1,
      },
    });
  }
  return NextResponse.json({ ok: true, cartItem });
}
