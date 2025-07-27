import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password, address, phone } = body;

    if (!email) return NextResponse.json({ error: 'Email requerido' }, { status: 400 });

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updated = await prisma.user.update({
      where: { email },
      data: {
        name,
        ...(hashedPassword && { password: hashedPassword }),
        address,
        phone,
      },
    });

    const { password: _, ...userWithoutPassword } = updated;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error al actualizar perfil' }, { status: 500 });
  }
}
