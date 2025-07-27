import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, address } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 400 });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        phone,
        address,
      },
    });
    return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address } });
  } catch (e) {
    return NextResponse.json({ error: 'Error en el registro' }, { status: 500 });
  }
}
