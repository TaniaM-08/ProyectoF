'use client';

import React, { useState, useEffect, useRef  } from 'react';
import { useCart } from '@/app/cart/context';

const ChatbotPopup = () => {
  
  
  const { addToCart } = useCart();
  function renderCitaPasos() {
    if (!agendarCita) return null;
    if (citaPaso === 1) {
      return (
        <div style={{ margin: '16px 0' }}>
          <div>¿Quieres agendar una cita para fumigar?</div>
          <button onClick={() => setCitaPaso(2)} style={{ marginTop: 8, background: '#94C11F', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Sí</button>
          <button onClick={() => { setAgendarCita(false); setCitaPaso(0); }} style={{ marginLeft: 8, background: '#eee', color: '#222', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>No</button>
        </div>
      );
    }
    if (citaPaso === 2) {
      return (
        <div style={{ margin: '16px 0' }}>
          <div>Selecciona el tipo de servicio:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {tiposServicio.map(tipo => (
              <button key={tipo} onClick={() => { setCitaServicio(tipo); setCitaPaso(3); }} style={{ background: '#94C11F', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>{tipo}</button>
            ))}
          </div>
        </div>
      );
    }
    if (citaPaso === 3) {
      return (
        <div style={{ margin: '16px 0' }}>
          <div>¿Qué plagas deseas eliminar?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {plagasOpciones.map(plaga => (
              <button key={plaga} onClick={() => setCitaPlagas(prev => prev.includes(plaga) ? prev.filter(p => p !== plaga) : [...prev, plaga])} style={{ background: citaPlagas.includes(plaga) ? '#94C11F' : '#eee', color: citaPlagas.includes(plaga) ? '#fff' : '#222', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>{plaga}</button>
            ))}
          </div>
          <button onClick={() => setCitaPaso(4)} style={{ marginTop: 12, background: '#94C11F', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente</button>
        </div>
      );
    }
    if (citaPaso === 4) {
      return (
        <div style={{ margin: '16px 0' }}>
          <div>Datos del cliente:</div>
          <input type="text" value={citaNombre} onChange={e => setCitaNombre(e.target.value)} placeholder="Nombre completo" style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <input type="email" value={citaEmail} onChange={e => setCitaEmail(e.target.value)} placeholder="Correo electrónico" style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <input type="tel" value={citaTelefono} onChange={e => setCitaTelefono(e.target.value)} placeholder="Teléfono" style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <input type="text" value={citaDireccion} onChange={e => setCitaDireccion(e.target.value)} placeholder="Dirección" style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <button onClick={() => setCitaPaso(5)} style={{ marginTop: 12, background: '#94C11F', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente</button>
        </div>
      );
    }
    if (citaPaso === 5) {
      return (
        <div style={{ margin: '16px 0' }}>
          <div>Fecha y hora de la cita:</div>
          <input type="date" value={citaFecha} onChange={e => setCitaFecha(e.target.value)} style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <input type="time" value={citaHora} onChange={e => setCitaHora(e.target.value)} style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <textarea value={citaMensaje} onChange={e => setCitaMensaje(e.target.value)} placeholder="Mensaje adicional (opcional)" style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} rows={2} />
          <button onClick={async () => {
            // Validar horario de cita
            const fechaObj = new Date(citaFecha);
            const horaObj = new Date(`${citaFecha}T${citaHora}`);
            const dia = fechaObj.getDay(); 
            const hora = horaObj.getHours();
            const minutos = horaObj.getMinutes();
            let horarioValido = false;
            if (dia === 0) {
              if ((hora > 11 && hora < 16) || (hora === 11 && minutos >= 0) || (hora === 16 && minutos === 0)) {
                horarioValido = true;
              }
            } else if (dia >= 1 && dia <= 6) {
              if ((hora > 8 && hora < 18) || (hora === 8 && minutos >= 0) || (hora === 18 && minutos === 0)) {
                horarioValido = true;
              }
            }
            if (!horarioValido) {
              setMensajes(prev => [...prev, { texto: '⏰ Solo puedes agendar citas dentro del horario: lunes a sábado de 8:00 a.m. a 6:00 p.m. y domingos de 11:00 a.m. a 4:00 p.m. Si es una emergencia, chatea al 6000-0000.', tipo: 'bot' }]);
              return;
            }
            // Enviar cita
            const citaData = {
              appointmentNumber: `APT-${Date.now()}`,
              appointmentType: 'CONSULTATION',
              status: 'SCHEDULED',
              title: `${citaServicio} - Fumigación - ${citaPlagas.join(", ")}`,
              description: citaMensaje || `Solicitado desde chatbot`,
              scheduledDate: fechaObj,
              scheduledTime: horaObj,
              durationMinutes: 60,
              clientName: citaNombre,
              clientEmail: citaEmail,
              clientPhone: citaTelefono,
              clientAddress: citaDireccion,
              notes: `Plagas: ${citaPlagas.join(", ")}`,
              internalNotes: citaServicio,
              completionNotes: '',
              userId: undefined,
              quoteId: undefined,
              orderId: undefined,
              assignedTo: undefined,
              createdBy: undefined,
            };
            const res = await fetch("/api/appointment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(citaData),
            });
            if (res.ok) {
              setMensajes(prev => [...prev, { texto: '✅ ¡Cita agendada con éxito! Pronto te contactaremos.', tipo: 'bot' }]);
            } else {
              setMensajes(prev => [...prev, { texto: '❌ No se pudo agendar la cita. Intenta de nuevo.', tipo: 'bot' }]);
            }
            setAgendarCita(false);
            setCitaPaso(0);
          }} style={{ marginTop: 12, background: '#94C11F', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Agendar cita</button>
        </div>
      );
    }
    return null;
  }
  const [agendarCita, setAgendarCita] = useState(false);
  const [citaPaso, setCitaPaso] = useState(0);
  const [citaServicio, setCitaServicio] = useState('');
  const [citaPlagas, setCitaPlagas] = useState<string[]>([]);
  const [citaNombre, setCitaNombre] = useState('');
  const [citaEmail, setCitaEmail] = useState('');
  const [citaTelefono, setCitaTelefono] = useState('');
  const [citaDireccion, setCitaDireccion] = useState('');
  const [citaFecha, setCitaFecha] = useState('');
  const [citaHora, setCitaHora] = useState('');
  const [citaMensaje, setCitaMensaje] = useState('');
  const tiposServicio = ["Residencial", "Comercial", "Marítimo", "Vehículos", "Otro"];
  const plagasOpciones = ["Cucarachas", "Roedores", "Hormigas", "Mosquitos", "Pulgas y garrapatas", "Moscas", "Termitas", "Otra"];
  const [open, setOpen] = useState(false);
  const [productos, setProductos] = useState<any[]>([]);
  const [pregunta, setPregunta] = useState('');
  const [mensajes, setMensajes] = useState<{ texto: string; tipo: 'user' | 'bot'; producto?: any }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes]);
  const [productoSugerido, setProductoSugerido] = useState<any>(null);

  useEffect(() => {
    if (open) {
      fetch('/api/chatbot/productos')
        .then(res => res.json())
        .then(data => setProductos(data.productos || []));

      setMensajes([
        { texto: '👋 ¡Hola! ¿En qué producto estás interesado? Puedes buscarlo por nombre.', tipo: 'bot' }
      ]);
    } else {
      setMensajes([]);
      setProductoSugerido(null);
    }
  }, [open]);

  
  const agregarAlCarrito = (producto: any) => {
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!user) {
      setMensajes(mensajes => [...mensajes, {
        texto: '⚠️ Debes iniciar sesión para agregar productos al carrito.',
        tipo: 'bot'
      }]);
      return;
    }
    addToCart({
      id: producto.id,
      name: producto.name,
      price: producto.price,
      imageUrl: producto.imageUrl,
      quantity: 0,
    }, 1);
    setMensajes(mensajes => [...mensajes, {
      texto: `🛒 "${producto.name}" ha sido agregado al carrito.`,
      tipo: 'bot'
    }]);
    setProductoSugerido(null);
  };
    const manejarBusqueda = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!pregunta.trim()) return;

      const userMensaje = pregunta.trim();
      const userMensajeLower = userMensaje.toLowerCase();
      setMensajes(prev => [...prev, { texto: pregunta, tipo: 'user' }]);
      setPregunta('');
      fetch('/api/chatbot/mensaje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'user', text: pregunta }),
      });

      if (["hola", "buenas", "buenos días", "buenas tardes", "hi"].includes(userMensajeLower)) {
        setMensajes(prev => [...prev, { texto: '👋 ¡Hola! ¿En qué producto estás interesado?', tipo: 'bot' }]);
        return;
      }

      if (["adiós", "gracias", "hasta luego" , "chao"].some(frase => userMensajeLower.includes(frase))) {
        setMensajes(prev => [...prev, { texto: '👋 ¡Gracias por tu visita! Que tengas un buen día.', tipo: 'bot' }]);
        return;
      }

      if (userMensajeLower.includes('horariom')) {
        setMensajes(prev => [...prev, { texto: '🕒 Nuestro horario es de lunes a sábado, de 8:00 a.m. a 6:00 p.m.', tipo: 'bot' }]);
        return;
      }

      const horarioTriggers = [
        'horario', 'hora', 'horarios', 'fin de semana', 'domingo', 'sábados', 'sabado', 'sábado', 'dias', 'días', 'atención', 'atencion', 'abren', 'cierran', 'abierto', 'cerrado'
      ];
      if (horarioTriggers.some(trigger => userMensajeLower.includes(trigger))) {
        setMensajes(prev => [...prev, { texto: '🕒 Nuestro horario es de lunes a sábado de 8:00 a.m. a 6:00 p.m. y domingos de 11:00 a.m. a 4:00 p.m.', tipo: 'bot' }]);
        return;
      }

  const palabrasCita = ["servicio", "servicios", "quiero un servicio", "tengo un problema","cita", "fumigacion", "quiero fumigar","quiero una fumigacion",...plagasOpciones.map(p => p.toLowerCase())];
  if (palabrasCita.some(palabra => userMensajeLower.includes(palabra.toLowerCase()))) {
    setMensajes(prev => [...prev, {
      texto: '¿Quieres agendar una cita para fumigar? Elige "Sí" para continuar.',
      tipo: 'bot',
      producto: null
    }]);
    let tipoDetectado = "";
    if (userMensajeLower.includes("residencial")) tipoDetectado = "Residencial";
    else if (userMensajeLower.includes("comercial")) tipoDetectado = "Comercial";
    else if (userMensajeLower.includes("marítimo")) tipoDetectado = "Marítimo";
    else if (userMensajeLower.includes("vehículos")) tipoDetectado = "Vehículos";
    else if (userMensajeLower.includes("otro")) tipoDetectado = "Otro";
    if (tipoDetectado) {
      fetch('/api/chatbot/mensaje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'user', text: `Intento cita (${tipoDetectado})`, tipoServicio: tipoDetectado }),
      });
    }
    setAgendarCita(true);
    setCitaPaso(1);
    return;
  }

  try {
    const res = await fetch(`/api/chatbot/buscar?name=${encodeURIComponent(userMensaje)}`);
    const data = await res.json();

    if (data?.name) {
      const textoBot = `✅ El producto "${data.name}" está disponible por $${data.price}.\n📝 ${data.description}\n¿Deseas agregarlo al carrito?`;
      setMensajes(prev => [...prev, { texto: textoBot, tipo: 'bot', producto: data }]);
      setProductoSugerido(data);
    } else {
      setMensajes(prev => [...prev, { texto: '❌ No se encontró el producto en la base de datos.', tipo: 'bot' }]);
    }
  } catch (err) {
    setMensajes(prev => [...prev, { texto: '⚠️ Hubo un error al buscar el producto.', tipo: 'bot' }]);
  }

  const renderCitaPasos = () => {
    if (!agendarCita) return null;
    if (citaPaso === 1) {
      return (
        <div style={{ margin: '16px 0' }}>
          <div>¿Quieres agendar una cita para fumigar?</div>
          <button onClick={() => setCitaPaso(2)} style={{ marginTop: 8, background: '#94C11F', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Sí</button>
          <button onClick={() => { setAgendarCita(false); setCitaPaso(0); }} style={{ marginLeft: 8, background: '#eee', color: '#222', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>No</button>
        </div>
      );
    }
    if (citaPaso === 2) {
      return (
        <div style={{ margin: '16px 0' }}>
          <div>Selecciona el tipo de servicio:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {tiposServicio.map(tipo => (
              <button key={tipo} onClick={() => { setCitaServicio(tipo); setCitaPaso(3); }} style={{ background: '#94C11F', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>{tipo}</button>
            ))}
          </div>
        </div>
      );
    }
    if (citaPaso === 3) {
      return (
        <div style={{ margin: '16px 0' }}>
          <div>¿Qué plagas deseas eliminar?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {plagasOpciones.map(plaga => (
              <button key={plaga} onClick={() => setCitaPlagas(prev => prev.includes(plaga) ? prev.filter(p => p !== plaga) : [...prev, plaga])} style={{ background: citaPlagas.includes(plaga) ? '#94C11F' : '#eee', color: citaPlagas.includes(plaga) ? '#fff' : '#222', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}>{plaga}</button>
            ))}
          </div>
          <button onClick={() => setCitaPaso(4)} style={{ marginTop: 12, background: '#94C11F', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente</button>
        </div>
      );
    }
    if (citaPaso === 4) {
      return (
        <div style={{ margin: '16px 0' }}>
          <div>Datos del cliente:</div>
          <input type="text" value={citaNombre} onChange={e => setCitaNombre(e.target.value)} placeholder="Nombre completo" style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <input type="email" value={citaEmail} onChange={e => setCitaEmail(e.target.value)} placeholder="Correo electrónico" style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <input type="tel" value={citaTelefono} onChange={e => setCitaTelefono(e.target.value)} placeholder="Teléfono" style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <input type="text" value={citaDireccion} onChange={e => setCitaDireccion(e.target.value)} placeholder="Dirección" style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <button onClick={() => setCitaPaso(5)} style={{ marginTop: 12, background: '#94C11F', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Siguiente</button>
        </div>
      );
    }
    if (citaPaso === 5) {
      return (
        <div style={{ margin: '16px 0' }}>
          <div>Fecha y hora de la cita:</div>
          <input type="date" value={citaFecha} onChange={e => setCitaFecha(e.target.value)} style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <input type="time" value={citaHora} onChange={e => setCitaHora(e.target.value)} style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
          <textarea value={citaMensaje} onChange={e => setCitaMensaje(e.target.value)} placeholder="Mensaje adicional (opcional)" style={{ marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} rows={2} />
          <button onClick={async () => {
            // Validar horario de cita
            const fechaObj = new Date(citaFecha);
            const horaObj = new Date(`${citaFecha}T${citaHora}`);
            const dia = fechaObj.getDay(); // 0=Domingo, 1=Lunes, ... 6=Sábado
            const hora = horaObj.getHours();
            const minutos = horaObj.getMinutes();
            let horarioValido = false;
            if (dia === 0) {
              if ((hora > 11 && hora < 16) || (hora === 11 && minutos >= 0) || (hora === 16 && minutos === 0)) {
                horarioValido = true;
              }
            } else if (dia >= 1 && dia <= 6) {
              if ((hora > 8 && hora < 18) || (hora === 8 && minutos >= 0) || (hora === 18 && minutos === 0)) {
                horarioValido = true;
              }
            }
            if (!horarioValido) {
              setMensajes(prev => [...prev, { texto: '⏰ Solo puedes agendar citas dentro del horario: lunes a sábado de 8:00 a.m. a 6:00 p.m. y domingos de 11:00 a.m. a 4:00 p.m. Si es una emergencia, chatea al 6000-0000.', tipo: 'bot' }]);
              return;
            }
            // Enviar cita
            const citaData = {
              appointmentNumber: `APT-${Date.now()}`,
              appointmentType: 'CONSULTATION',
              status: 'SCHEDULED',
              title: `${citaServicio} - Fumigación - ${citaPlagas.join(", ")}`,
              description: citaMensaje || `Solicitado desde chatbot`,
              scheduledDate: fechaObj,
              scheduledTime: horaObj,
              durationMinutes: 60,
              clientName: citaNombre,
              clientEmail: citaEmail,
              clientPhone: citaTelefono,
              clientAddress: citaDireccion,
              notes: `Plagas: ${citaPlagas.join(", ")}`,
              internalNotes: citaServicio,
              completionNotes: '',
              userId: undefined,
              quoteId: undefined,
              orderId: undefined,
              assignedTo: undefined,
              createdBy: undefined,
            };
            const res = await fetch("/api/appointment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(citaData),
            });
            if (res.ok) {
              setMensajes(prev => [...prev, { texto: '✅ ¡Cita agendada con éxito! Pronto te contactaremos.', tipo: 'bot' }]);
            } else {
              setMensajes(prev => [...prev, { texto: '❌ No se pudo agendar la cita. Intenta de nuevo.', tipo: 'bot' }]);
            }
            setAgendarCita(false);
            setCitaPaso(0);
          }} style={{ marginTop: 12, background: '#94C11F', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>Agendar cita</button>
        </div>
      );
    }
    return null;
  };
};


  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#94C11F',
            color: '#fff',
            border: 'none',
            fontSize: 24,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            zIndex: 1000
          }}
          aria-label="Abrir chatbot"
        >
          💬
        </button>
      )}

      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: 360,
            height: 500,
            backgroundColor: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            fontFamily: 'sans-serif',
            color: '#222'
          }}
        >
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#94C11F',
            color: '#fff',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            Chatbot
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: 20,
                color: '#fff',
                cursor: 'pointer'
              }}
              aria-label="Cerrar chatbot"
            >
              ×
            </button>
          </div>

          <div style={{ padding: 16, flex: 1, overflowY: 'auto', fontSize: 14 }}>
            {mensajes.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.tipo === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    backgroundColor: msg.tipo === 'bot' ? '#f1f1f1' : '#DCF8C6',
                    color: '#222',
                    padding: 10,
                    borderRadius: 12,
                    maxWidth: '75%',
                    whiteSpace: 'pre-wrap',
                    textAlign: 'left',
                    borderTopLeftRadius: msg.tipo === 'bot' ? 0 : 12,
                    borderTopRightRadius: msg.tipo === 'user' ? 0 : 12,
                  }}
                >
                  {msg.texto}

                  {msg.tipo === 'bot' && msg.producto && productoSugerido?.id === msg.producto.id && (
                    <div style={{ marginTop: 8 }}>
                      <button
                        onClick={() => agregarAlCarrito(msg.producto)}
                        style={{
                          backgroundColor: '#94C11F',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: 13
                        }}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {renderCitaPasos()}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={manejarBusqueda}
            style={{
              display: 'flex',
              padding: 12,
              borderTop: '1px solid #eee',
              gap: 8
            }}
          >
            <input
              type="text"
              value={pregunta}
              onChange={e => setPregunta(e.target.value)}
              placeholder="Escribe tu pregunta..."
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: '1px solid #ccc',
                fontSize: 14
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 12px',
                backgroundColor: '#94C11F',
                color: '#fff',
                borderRadius: 8,
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotPopup;
