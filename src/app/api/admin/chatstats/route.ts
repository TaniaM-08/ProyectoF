import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Productos más comprados (OrderItem)
    const orderItems = await prisma.orderItem.findMany({ select: { productName: true, quantity: true } });
    const productoContador: Record<string, number> = {};
    orderItems.forEach(item => {
      if (!productoContador[item.productName]) productoContador[item.productName] = 0;
      productoContador[item.productName] += item.quantity;
    });
    const productosTop = Object.entries(productoContador)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Servicios y plagas desde Appointment usando el campo title
    const appointments = await prisma.appointment.findMany({ select: { title: true, notes: true } });
    const tiposServicio = ["Residencial", "Comercial", "Marítimo", "Vehículos", "Otro"];
    const plagasOpciones = ["Cucarachas", "Roedores", "Hormigas", "Mosquitos", "Pulgas y garrapatas", "Moscas", "Termitas", "Otra"];
    const servicioContador: Record<string, number> = {};
    const plagaContador: Record<string, number> = {};
    appointments.forEach(app => {
      tiposServicio.forEach(tipo => {
        if (app.title && app.title.toLowerCase().includes(tipo.toLowerCase())) {
          servicioContador[tipo] = (servicioContador[tipo] || 0) + 1;
        }
      });
      plagasOpciones.forEach(plaga => {
        if (app.title && app.title.toLowerCase().includes(plaga.toLowerCase())) {
          plagaContador[plaga] = (plagaContador[plaga] || 0) + 1;
        } else if (app.notes && app.notes.toLowerCase().includes(plaga.toLowerCase())) {
          plagaContador[plaga] = (plagaContador[plaga] || 0) + 1;
        }
      });
    });
    const serviciosTop = Object.entries(servicioContador).map(([name, count]) => ({ name, count }));
    const plagasTop = Object.entries(plagaContador).map(([name, count]) => ({ name, count }));

    return NextResponse.json({ productosTop, serviciosTop, plagasTop });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener estadísticas del chatbot' }, { status: 500 });
  }
}
