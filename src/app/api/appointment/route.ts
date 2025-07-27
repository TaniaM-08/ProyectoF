import { NextResponse } from 'next/server';
import { appointmentCrud } from '@/lib/crud/appointment';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Mapeo de campos según la tabla Appointment
    const now = new Date();
    // Construir el título con tipo de servicio y plagas si existen
    let tipoServicio = body.tipoServicio || body.internalNotes || '';
    let plagas = '';
    if (body.plagas) {
      if (Array.isArray(body.plagas)) {
        plagas = body.plagas.join(', ');
      } else {
        plagas = body.plagas;
      }
    } else if (body.notes) {
      plagas = body.notes;
    }
    let title = '';
    if (tipoServicio && plagas) {
      title = `${tipoServicio} - Fumigación - ${plagas}`;
    } else if (tipoServicio) {
      title = `${tipoServicio} - Fumigación`;
    } else if (plagas) {
      title = `Fumigación - ${plagas}`;
    } else {
      title = body.title || 'Fumigación';
    }
    const citaData = {
      appointmentNumber: body.appointmentNumber || `APT-${Date.now()}`,
      appointmentType: body.appointmentType || 'CONSULTATION',
      status: 'SCHEDULED',
      title,
      description: body.description || 'Solicitado desde formulario web',
      scheduledDate: body.scheduledDate ? new Date(body.scheduledDate) : now,
      scheduledTime: body.scheduledTime ? new Date(body.scheduledTime) : now,
      durationMinutes: body.durationMinutes || 60,
      clientName: body.clientName || 'Sin nombre',
      clientEmail: body.clientEmail || 'Sin email',
      clientPhone: body.clientPhone || '',
      clientAddress: body.clientAddress || '',
      notes: body.notes || '',
      internalNotes: body.internalNotes || '',
      completionNotes: '',
      userId: undefined,
      quoteId: undefined,
      orderId: undefined,
      assignedTo: undefined,
      createdBy: undefined,
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    };

    const cita = await appointmentCrud.create(citaData);
    return NextResponse.json({ cita });
  } catch (error) {
    console.error('Error al crear cita:', error);
    return NextResponse.json({ error: 'No se pudo agendar la cita.' }, { status: 500 });
  }
}
