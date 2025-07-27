import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  if (!name) {
    return NextResponse.json({ error: 'Falta el nombre del producto.' }, { status: 400 });
  }

  // Frases para mostrar lista de productos
  const listaTriggers = [
    'producto', 'productos', 'lista de productos', 'ver productos', 'mostrar productos', 'catálogo', 'catalogo'
  ];
  if (listaTriggers.some(trigger => name.trim().toLowerCase() === trigger)) {
    const productos = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        stock: true,
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ productos });
  }

  // Frases para buscar producto específico
  const buscarTriggers = [
    'quiero el producto', 'háblame de', 'hablame de', 'producto', 'tienes un', 'tienes el', 'quiero comprar', 'busco', 'me interesa', 'información de', 'informacion de'
  ];
  let nombreBuscado = name;
  for (const trigger of buscarTriggers) {
    if (name.toLowerCase().startsWith(trigger)) {
      nombreBuscado = name.slice(trigger.length).trim();
      break;
    }
    if (name.toLowerCase().includes(trigger + ' ')) {
      nombreBuscado = name.split(trigger + ' ')[1]?.trim() || name;
      break;
    }
  }

  if (!nombreBuscado) {
    return NextResponse.json({ error: 'No se especificó el nombre del producto.' }, { status: 400 });
  }

  const producto = await prisma.product.findFirst({
    where: {
      name: {
        contains: nombreBuscado,
        mode: 'insensitive',
      },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
      description: true,
      stock: true,
    },
  });

  // Si no se encuentra, pero el trigger es genérico, devolver lista
  if (!producto && buscarTriggers.some(trigger => name.toLowerCase().includes(trigger))) {
    const productos = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        stock: true,
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ productos });
  }

  return NextResponse.json(producto || {});
}
