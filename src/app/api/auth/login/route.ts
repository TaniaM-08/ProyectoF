import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Completa todos los campos' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no registrado' }, { status: 400 });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 400 });
    }

    // ✅ Solo extraemos los campos seguros y necesarios
    const { id, name, email: userEmail, phone, address, role } = user;

    return NextResponse.json({
      ok: true,
      user: { id, name, email: userEmail, phone, address, role },
    });

  } catch (e) {
    return NextResponse.json({ error: 'Error en el login' }, { status: 500 });
  }
}

