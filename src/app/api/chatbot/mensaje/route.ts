import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  const { sender, text } = body;
  if (!sender || !text) {
    return NextResponse.json({ error: 'Faltan datos.' }, { status: 400 });
  }
  await prisma.chatMessage.create({
    data: {
      sender,
      text,
      timestamp: new Date(),
      createdAt: new Date(),
    },
  });
  return NextResponse.json({ ok: true });
}
