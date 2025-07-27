import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const admin = await prisma.user.findFirst({
    where: { email, role: 'ADMIN' },
  });
  if (!admin || !admin.password || !bcrypt.compareSync(password, admin.password)) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
  }
  return NextResponse.json({ success: true, admin: { id: admin.id, email: admin.email, name: admin.name } });
}

export async function GET() {
  // Solo para uso interno, requiere autenticación en frontend
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, address: true, phone: true }
  });
  return NextResponse.json({ users });
}
