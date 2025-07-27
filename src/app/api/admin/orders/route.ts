import { NextResponse } from 'next/server';
import { orderCrud } from '@/lib/crud/order';

export async function GET() {
  try {
    const orders = await orderCrud.getAll();
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener las compras' }, { status: 500 });
  }
}
