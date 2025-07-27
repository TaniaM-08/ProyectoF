import { NextResponse } from 'next/server';
import { orderCrud } from '@/lib/crud/order';
import { OrderCreateData } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let userId = body.userId;
    if (!userId) {
      
    }

    const orderData: OrderCreateData = {
      ...body,
      userId,
      orderNumber: body.orderNumber || `ORD-${Date.now()}`,
    };
    const order = await orderCrud.create(orderData);
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear la orden' }, { status: 500 });
  }
}
