"use client";
import './hide-scrollbar.css';
import React, { useState, useRef } from "react";

import {
  Home,
  Building2,
  Ship,
  Car,
  HelpCircle,
} from "lucide-react";

const tiposServicio = [
  { tipo: "Residencial", icon: <Home className="w-6 h-6" /> },
  { tipo: "Comercial", icon: <Building2 className="w-6 h-6" /> },
  { tipo: "Marítimo", icon: <Ship className="w-6 h-6" /> },
  { tipo: "Vehículos", icon: <Car className="w-6 h-6" /> },
  { tipo: "Otro", icon: <HelpCircle className="w-6 h-6" /> },
];

const plagas = [
  {
    nombre: "Cucarachas",
    imgBtn: "https://res.cloudinary.com/df6cxn8ga/image/upload/e_background_removal/f_png/v1743295355/cucaracha_wam48j.png",
    imgCircle: "https://bioprotect.es/wp-content/uploads/2024/06/cucaracha-americana_480f17b0_230615105345_900x900.jpg",
    imgBg: "https://www.clarin.com/2022/06/08/mWaBu9enc_2000x1500__1.jpg",
  },
  {
    nombre: "Roedores",
    imgBtn: "https://res.cloudinary.com/df6cxn8ga/image/upload/e_background_removal/f_png/v1743295357/raton_qsxzu7.png",
    imgCircle: "https://perimeterwildlifecontrol.com/wp-content/uploads/2025/01/rat-on-power-pack-1024x683.webp",
    imgBg: "https://live-production.wcms.abc-cdn.net.au/e8c20c340301889481fcd82a517ba750?impolicy=wcms_crop_resize&cropH=1080&cropW=1920&xPos=0&yPos=0&width=862&height=485",
  },
  {
    nombre: "Hormigas",
    imgBtn: "https://res.cloudinary.com/df6cxn8ga/image/upload/v1743295349/hormiga_dn4xct.png",
    imgCircle: "https://cdn2.salud180.com/sites/default/files/como-eliminar-hormigas-cocina_1.jpg",
    imgBg: "https://thumbs.dreamstime.com/b/hormigas-en-la-cocina-50325848.jpg",
  },
  {
    nombre: "Mosquitos",
    imgBtn: "https://res.cloudinary.com/df6cxn8ga/image/upload/v1743295346/mosquito_lwzvd7.png",
    imgCircle: "https://remihogar.es/cdn/shop/articles/mosquito-picando-piel_905x.jpg?v=1721391561",
    imgBg: "https://n.com.do/wp-content/uploads/2019/09/Picaduras-mosquitos-1.jpg",
  },
  {
    nombre: "Pulgas y garrapatas",
    imgBtn: "https://res.cloudinary.com/df6cxn8ga/image/upload/v1743295348/pulga_enuvno.png",
    imgCircle: "https://www.club-caza.com/img/article/garrapataencerradaenbolsaponecientosdehuevos.jpg",
    imgBg: "https://a.storyblok.com/f/160385/3f29688df8/garrapata_bovino.jpg/m/?w=256&q=100",
  },
  {
    nombre: "Moscas",
    imgBtn: "https://res.cloudinary.com/df6cxn8ga/image/upload/v1743295352/mosca_qnfewc.png",
    imgCircle: "https://tn.com.ar/resizer/v2/pocas-personas-lo-saben-la-hierba-que-tenes-que-poner-en-la-mesada-para-ahuyentar-a-las-moscas-de-la-cocina-foto-gemini-NS7CH3723JEVPJEWQ74T45SMLQ.png?auth=302e5c0bc2bacaf8ecbc9639699bcbd4d24e69342cf3194bd5e0bbbf212862ad&width=767",
    imgBg: "https://88b463d9cf.cbaul-cdnwnd.com/21288239b7190b1f8dfe699972585d7f/200000029-00a3000a32/MOSCASC.jpg?ph=88b463d9cf",
  },
  {
    nombre: "Termitas",
    imgBtn: "https://res.cloudinary.com/df6cxn8ga/image/upload/v1743295347/comejen_xb4rp4.png",
    imgCircle: "https://i0.wp.com/holanews.com/wp-content/uploads/2023/03/rss-efeef86a5fda96564815a33eb317691847b222538abw.jpg?fit=1920%2C1344&ssl=1",
    imgBg: "https://clientes.ecolatina.com.py/backend/assets/uploads/blog/nido_de_termitas69630.jpg",
  },
  {
    nombre: "Otra",
    imgBtn: "https://res.cloudinary.com/df6cxn8ga/image/upload/v1743295351/murcielago_i8jn7e.png",
    imgCircle: "https://media.es.wired.com/photos/6541313838775b6e711ea9e2/16:9/w_2560%2Cc_limit/Vampire%2520Bat_GettyImages-150370788.jpg",
    imgBg: "https://almomento.mx/wp-content/uploads/2017/07/murcielagos.jpg",
  },
];

const infoPlagas: Record<string, { descripcion: string; enfermedades: string[] }> = {
  "Cucarachas": {
    descripcion: "¡Las cucarachas son una amenaza directa para tu salud! Contaminan todo a su paso con bacterias peligrosas como Salmonella y E. coli. Se esconden en rincones oscuros y salen por la noche, invadiendo tus alimentos y utensilios.",
    enfermedades: ["Salmonelosis", "Gastroenteritis", "Alergias respiratorias severas"]
  },
  "Roedores": {
    descripcion: "¡No pongas en riesgo tu vida! Los roedores no solo destruyen paredes y cables: son portadores de enfermedades mortales. Su orina y excremento pueden contaminar superficies sin que te des cuenta.",
    enfermedades: ["Leptospirosis (puede causar falla renal)", "Hantavirus (letal en humanos)", "Tifus murino"]
  },
  "Hormigas": {
    descripcion: "Parece inofensiva, ¡pero una plaga de hormigas puede infestar tu cocina y contaminar tu comida! Algunas especies pueden morder y causar reacciones alérgicas.",
    enfermedades: ["Bacterias transmitidas a través de alimentos", "Reacciones alérgicas por contacto o picadura"]
  },
  "Mosquitos": {
    descripcion: "¡Fumiga ya! Un solo mosquito puede transmitir enfermedades potencialmente mortales. Se reproducen en cualquier acumulación de agua y atacan sin avisar.",
    enfermedades: ["Dengue (puede ser hemorrágico)", "Zika (afecta a embarazadas)", "Chikungunya", "Malaria"]
  },
  "Pulgas y garrapatas": {
    descripcion: "¡Pequeñas pero peligrosas! Las pulgas no solo afectan a tus mascotas: pueden causar reacciones severas en humanos y transmitir enfermedades históricamente letales.",
    enfermedades: ["Tifus transmitido por pulgas", "Peste bubónica", "Dermatitis alérgica"]
  },
  "Moscas": {
    descripcion: "¡Son más que una molestia! Las moscas transportan gérmenes desde basura y excremento hasta tu comida. En minutos pueden contaminar toda tu cocina.",
    enfermedades: ["Diarreas infecciosas", "Disentería", "Salmonelosis"]
  },
  "Termitas": {
    descripcion: "Silenciosas pero destructivas. Las termitas pueden derribar vigas, techos y estructuras enteras si no se controlan a tiempo. El daño económico puede ser devastador.",
    enfermedades: ["No transmiten enfermedades directas, pero sus daños estructurales representan un gran riesgo"]
  },
  "Otra": {
    descripcion: "¿Notas algo extraño en casa? No lo ignores. Podrías estar frente a una plaga silenciosa. Consulta con nuestros expertos y actúa antes de que sea tarde.",
    enfermedades: ["Dependiendo del tipo, pueden ir desde alergias hasta enfermedades graves"]
  },
};


export default function ServiciosPage() {
  const detalleRef = useRef<HTMLDivElement | null>(null);
  const [servicio, setServicio] = useState("");
  const [plagasSeleccionadas, setPlagasSeleccionadas] = useState<string[]>([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [paso, setPaso] = useState(0); // 0: info, 1: formulario
  const [plagaInfo, setPlagaInfo] = useState<string | null>(plagas[0]?.nombre || null);
  const totalPasos = 4;

  // Avanzar al siguiente plaga
  const handleSiguientePlaga = () => {
    if (!plagaInfo) return;
    const idx = plagas.findIndex(p => p.nombre === plagaInfo);
    if (idx < plagas.length - 1) {
      setPlagaInfo(plagas[idx + 1].nombre);
    }
  };

  const mostrarDetalle = (nombre: string) => {
    setPlagaInfo(nombre);
    // Eliminado scrollIntoView para evitar que la pantalla se deslice
  };

  const togglePlaga = (nombre: string) => {
    setPlagasSeleccionadas((prev) =>
      prev.includes(nombre) ? prev.filter((p) => p !== nombre) : [...prev, nombre]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!servicio || plagasSeleccionadas.length === 0 || !nombre || !email || !telefono || !direccion || !fecha || !hora) {
      setError("Completa todos los campos obligatorios");
      return;
    }

    // Convertir fecha y hora a objetos Date
    const fechaObj = new Date(fecha);
    const horaObj = new Date(`${fecha}T${hora}`);

    // Construir el objeto para Appointment
    const appointmentData = {
      appointmentNumber: `APT-${Date.now()}`,
      appointmentType: 'CONSULTATION', // valor por defecto
      status: 'SCHEDULED',
      title: `Fumigación - ${plagasSeleccionadas.join(", ")}`,
      description: mensaje || `Solicitado desde formulario web`,
      scheduledDate: fechaObj,
      scheduledTime: horaObj,
      durationMinutes: 60,
      clientName: nombre,
      clientEmail: email,
      clientPhone: telefono,
      clientAddress: direccion,
      notes: `Plagas: ${plagasSeleccionadas.join(", ")}`,
      internalNotes: servicio,
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
      body: JSON.stringify(appointmentData),
    });

    if (res.ok) {
      setEnviado(true);
    } else {
      setError("No se pudo agendar la cita. Intenta de nuevo.");
    }
  };

  // Sección informativa y plagas
  if (paso === 0) {
    return (
      <section className="bg-white px-0 mt-20">
  {/* Hero principal con imagen de fondo */}
 <div
    className="relative w-full h-[90vh] bg-cover bg-center flex items-center"
    style={{
      backgroundImage: `url("https://ingequimica.cl/wp-content/uploads/2024/03/fumigacion-residencial-1024x505.jpg")`,
    }}
  >
    {/* Capa oscura global */}
    <div className="absolute inset-0 bg-black opacity-50" />

<div className="absolute bottom-0 left-0 w-full h-24 z-10" style={{ background: 'linear-gradient(to top, white, transparent)' }} />

    {/* Texto alineado a la izquierda sin márgenes ni bordes redondeados en ese lado */}
    <div className="relative z-10 text-white max-w-2xl px-6 py-10 bg-black bg-opacity-60 rounded-r-xl w-full sm:w-[60%]">
      <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wider ml-20">
        ¡Protege con fumigación profesional!
      </h1>
      <p className="text-lg md:text-xl text-gray-200 mt-4 ml-22">
        Eliminamos plagas de forma segura y eficaz. Atendemos residencias, empresas y espacios abiertos.
      </p>
      <button 
        onClick={() => setPaso(1)}
        className="ml-22 mt-6 bg-[#94C11F] hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg">
        Quiero fumigar
      </button>
    </div>
  </div>

        <div className="max-w-6xl mx-auto">
          {/* Encabezado principal */}
          <header className="text-center space-y-6">
    <h1 className="mt-22 text-5xl font-extrabold text-[#94C11F] uppercase tracking-widest drop-shadow-sm">
      La importancia de la fumigación
    </h1>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
      La fumigación protege tu hogar y salud de plagas transmisoras de enfermedades como dengue, leptospirosis o salmonelosis.
    </p>
  </header>
          {/* Plagas comunes */}
          <section aria-labelledby="plagas-comunes">
            <h2 id="plagas-comunes" className="mb-[-60]"></h2>
          {/* Scroll horizontal de botones circulares con imágenes, sin degradado, más grandes y separados, más cerca del div de información */}
          <div className="relative w-full flex justify-center items-center" style={{ minHeight: '80px' }}>
            <div
              className="hide-scrollbar flex gap-10 overflow-x-auto overflow-y-hidden z-50 pl-[15%] pt-2"
              style={{ scrollSnapType: 'x mandatory', transform: 'translateY(560px)', width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
            >
              {plagas.map((p) => (
                <button
                  key={p.nombre}
                  onClick={() => setPlagaInfo(p.nombre)}
                  className={`aspect-square w-[170px] flex items-center justify-center bg-black rounded-full hover:scale-110 transition shadow-lg scroll-snap-align-start ${plagaInfo === p.nombre ? 'opacity-50 pointer-events-none' : ''}`}
                  style={{ minWidth: '150px', minHeight: '150px', maxWidth: '140px', maxHeight: '120px', boxSizing: 'border-box' }}
                >
                  <img
                    src={p.imgBtn}
                    alt={p.nombre}
                    className="w-[95px] h-[95px] object-contain rounded-full"
                    style={{ aspectRatio: '1/1' }}
                  />
                </button>
              ))}
            </div>
          </div>
            {/* Detalle de plaga seleccionada como primer div debajo del título */}
            {plagaInfo && (
              <>
                {/* Degradado negro arriba (inverso) */}
                <div className="w-full h-10" style={{ minWidth: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', background: 'linear-gradient(to top, #000 0%, transparent 100%)' }} />
                <div
                  ref={detalleRef}
                  className="w-full flex flex-col md:flex-row items-center bg-black text-white shadow-xl relative"
                  style={{ minWidth: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
                >
                  {/* Imagen de fondo semi-transparente ocupando la mitad izquierda */}
                  <div className="absolute left-0 top-0 h-full w-1/2 z-0" style={{ pointerEvents: 'none' }}>
                    <img
                      src={plagas.find(p => p.nombre === plagaInfo)?.imgBg}
                      alt={plagaInfo + ' fondo'}
                      className="w-full h-full object-cover opacity-50"
                    />
                    {/* Degradado negro de izquierda a derecha */}
                    <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'linear-gradient(90deg, transparent 0%, #000 90%)', pointerEvents: 'none' }} />
                    {/* Degradado negro arriba (normal) */}
                    <div className="absolute top-0 left-0 w-full h-1/2" style={{ background: 'linear-gradient(to bottom, #000 0%, transparent 20%)', pointerEvents: 'none' }} />
                    {/* Degradado negro abajo (normal) */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2" style={{ background: 'linear-gradient(to top, #000 0%, transparent 20%)', pointerEvents: 'none' }} />
                  </div>
                  <div className="flex w-full md:w-1/2 p-[5%] pl-[10%] z-10">
                    <div className="rounded-full border-[10px] border-[#94C11F] overflow-hidden w-70 h-70 flex items-center justify-center bg-black">
                      <img
                        src={plagas.find(p => p.nombre === plagaInfo)?.imgCircle}
                        alt={plagaInfo}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 p-6 space-y-4 z-10">
                    <h3 className="text-3xl font-bold text-[#94C11F]">{plagaInfo}</h3>
                    <p className="text-gray-100 text-base">{infoPlagas[plagaInfo]?.descripcion}</p>
                    <div>
                      <h4 className="text-white font-semibold">Enfermedades asociadas:</h4>
                      <ul className="list-disc list-inside text-gray-300">
                        {infoPlagas[plagaInfo]?.enfermedades.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <div className="flex items-center justify-start w-full gap-0">
            <button
              onClick={() => {
                if (!plagaInfo) return;
                const idx = plagas.findIndex(p => p.nombre === plagaInfo);
                if (idx > 0) {
                  setPlagaInfo(plagas[idx - 1].nombre);
                }
              }}
              className={`bg-[#6A9C13] text-black hover:bg-[#4C6F0E] transition flex items-center justify-center ${plagas.findIndex(p => p.nombre === plagaInfo) === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label="Volver"
              style={{ height: '32px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px', borderTopRightRadius: '0', borderBottomRightRadius: '0' }}
              disabled={plagas.findIndex(p => p.nombre === plagaInfo) === 0}
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: 'auto' }}>
                <path d="M12 3L6 9L12 15" stroke="black" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => setPaso(1)}
              className="bg-[#94C11F] text-black font-bold hover:bg-black hover:text-[#94C11F] border border-[#94C11F] transition"
              style={{ borderRadius: '0', height: '32px', paddingLeft: '24px', paddingRight: '24px', display: 'flex', alignItems: 'center' }}
            >
              Contratar
            </button>
            <button
              onClick={handleSiguientePlaga}
              className="bg-[#6A9C13] text-black hover:bg-[#4C6F0E] transition flex items-center justify-center"
              aria-label="Siguiente"
              style={{ height: '32px', width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTopRightRadius: '8px', borderBottomRightRadius: '8px', borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
              disabled={plagas.findIndex(p => p.nombre === plagaInfo) === plagas.length - 1}
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', margin: 'auto' }}>
                <path d="M6 3L12 9L6 15" stroke="black" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Degradado negro abajo (inverso) */}
                <div className="w-full h-15" style={{ minWidth: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', background: 'linear-gradient(to bottom, #000 0%, #000 70%, transparent 100%)' }} />
              </>
            )}
          </section>

          {!plagaInfo && (
            <div className="text-center">
              <button
                onClick={() => setPaso(1)}
                className="bg-[#94C11F] text-black font-semibold py-3 px-8 rounded-lg hover:bg-black hover:text-[#94C11F] border border-[#94C11F] transition-all duration-300"
              >
                Contratar servicio de fumigación
              </button>
            </div>
          )}
        </div>


        <section
          aria-labelledby="beneficios"
          className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border border-gray-100 mt-22 my-10 mx-auto max-w-6xl transition hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)]"
        >
          <h2 id="beneficios" className="text-3xl font-bold text-gray-800 mb-6 text-center">
            ¿Por qué es importante controlar las plagas?
          </h2>
          
         <ul className="grid md:grid-cols-2 text-gray-700">
  <li className="flex items-center justify-center ml-25 gap-3">
    <HelpCircle className="w-7 h-7 text-[#94C11F]" />
    <p >Evita la propagación de bacterias y virus peligrosos.</p>
  </li>
  <li className="flex items-center gap-2 ">
    <Home className="w-7 h-7 text-[#94C11F] gap-3" />
    <p>Cuida la salud de tu familia y mascotas.</p>
  </li>
  <li className="flex items-center ml-28 gap-3">
    <Building2 className="w-7 h-7 text-[#94C11F]" />
    <p>Evita daños en tu vivienda y pertenencias.</p>
  </li>
  <li className="flex items-center gap-3">
    <Ship className="w-7 h-7 text-[#94C11F]" />
    <p >Evita que las plagas afecten la imagen de tu negocio.</p>
  </li>
</ul>


        </section>

        <section className="pb-10 px-4 md:px-0 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Trabajos Realizados
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              'https://res.cloudinary.com/df6cxn8ga/image/upload/v1743293304/WhatsApp_Image_2025-03-26_at_22.03.15_2bedaa05_hv7qjb.jpg',
              'https://res.cloudinary.com/df6cxn8ga/image/upload/v1743293193/WhatsApp_Image_2025-03-26_at_22.03.16_c71bd763_ezahju.jpg',
              'https://res.cloudinary.com/df6cxn8ga/image/upload/v1743293192/WhatsApp_Image_2025-03-26_at_21.51.45_413a36fd_kelwkx.jpg',
              'https://res.cloudinary.com/df6cxn8ga/image/upload/v1743293186/WhatsApp_Image_2025-03-26_at_21.52.23_97126910_cqjtkk.jpg',
              'https://res.cloudinary.com/df6cxn8ga/image/upload/v1743293192/WhatsApp_Image_2025-03-26_at_21.51.46_1f1ded77_yu46lg.jpg',
              'https://res.cloudinary.com/df6cxn8ga/image/upload/v1752704662/ji_i9o_7_z5wkhf.png',
            ].map((src, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl shadow-lg hover:scale-105 transition duration-300"
              >
                <img
                  src={src}
                  alt={`Trabajo ${i + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto bg-[#f9f9f9] rounded-3xl p-10 shadow-xl border border-[#ddd]  mt-15">
        <h1 className="text-4xl font-extrabold text-[#94C11F] mb-10 text-center uppercase tracking-wide">Solicita tu servicio de fumigación</h1>
        <form onSubmit={handleSubmit} className="space-y-10">
          {paso === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">1. Selecciona el tipo de servicio</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {tiposServicio.map((s) => (
                  <button
                    key={s.tipo}
                    type="button"
                    onClick={() => setServicio(s.tipo)}
                    className={`rounded-xl border-2 p-5 flex items-center justify-center gap-3 text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                      servicio === s.tipo ? "bg-[#94C11F] text-black border-[#94C11F]" : "bg-white border-gray-300 text-gray-700"
                    }`}
                  >
                    <span className="text-2xl">{s.icon}</span> {s.tipo}
                  </button>
                ))}
              </div>
            </div>
          )}
          {paso === 2 && (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6">2. ¿Qué plagas deseas eliminar?</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {plagas.map((p) => (
        <button
          key={p.nombre}
          type="button"
          onClick={() => togglePlaga(p.nombre)}
          className={`rounded-xl border-2 p-5 flex flex-col items-center font-medium transition-all duration-300 hover:scale-105 ${
            plagasSeleccionadas.includes(p.nombre)
              ? "bg-[#94C11F] text-black border-[#94C11F]"
              : "bg-white border-gray-300 text-gray-700"
          }`}
        >
          {/* Círculo negro con imagen */}
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-2">
            <img
              src={p.imgBtn}
              alt={p.nombre}
              className="w-10 h-10 object-contain"
            />
          </div>
          {p.nombre}
        </button>
      ))}
    </div>

    {plagasSeleccionadas.includes("Otra") && (
      <input
        type="text"
        placeholder="Especifica otra plaga"
        className="mt-4 w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800"
      />
    )}
  </div>
)}

          {paso === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">3. Datos del cliente</h2>
              <input type="text" placeholder="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800" />
              <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800" />
              <input type="tel" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800" />
              <input type="text" placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800" />
            </div>
          )}
          {paso === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">4. Fecha y hora de la cita</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800" />
                <input type="time" value={hora} onChange={e => setHora(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800" />
              </div>
              <textarea placeholder="Mensaje adicional (opcional)" value={mensaje} onChange={e => setMensaje(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800" rows={3} />

              {/* Validaciones de fecha y hora */}
              {(() => {
                if (!fecha || !hora) return null;
                const now = new Date();
                const selected = new Date(`${fecha}T${hora}`);
                // Validar fecha pasada
                if (selected < now) {
                  return <div className="text-red-500 text-center font-semibold">No puedes agendar una cita en una fecha u hora pasada.</div>;
                }
                // Validar horario permitido
                const day = selected.getDay(); // 0=domingo, 1=lunes...
                const hour = selected.getHours();
                const minute = selected.getMinutes();
                let horarioValido = false;
                let mensajeHorario = "";
                if (day === 0) {
                  // Domingo: 11:00 a 16:00
                  if ((hour > 11 && hour < 16) || (hour === 11 && minute >= 0) || (hour === 16 && minute === 0)) {
                    horarioValido = true;
                  } else {
                    mensajeHorario = "Domingos solo de 11:00 a.m. a 4:00 p.m.";
                  }
                } else if (day >= 1 && day <= 6) {
                  // Lunes a sábado: 8:00 a 18:00
                  if ((hour > 8 && hour < 18) || (hour === 8 && minute >= 0) || (hour === 18 && minute === 0)) {
                    horarioValido = true;
                  } else {
                    mensajeHorario = "Solo puedes agendar de lunes a sábado entre 8:00 a.m. y 6:00 p.m.";
                  }
                }
                if (!horarioValido) {
                  return <div className="text-red-500 text-center font-semibold">{mensajeHorario}<br />Si tienes una emergencia llama al <span className="font-bold">6000-0000</span>.</div>;
                }
                return null;
              })()}

              {error && <div className="text-red-500 text-center">{error}</div>}
              {enviado ? (
                <div className="text-green-500 text-center font-semibold">¡Cita agendada con éxito!</div>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-[#94C11F] text-black font-semibold py-3 rounded-lg hover:bg-black hover:text-[#94C11F] border border-[#94C11F] transition-all duration-300"
                  disabled={(() => {
                    if (!fecha || !hora) return true;
                    const now = new Date();
                    const selected = new Date(`${fecha}T${hora}`);
                    if (selected < now) return true;
                    const day = selected.getDay();
                    const hour = selected.getHours();
                    const minute = selected.getMinutes();
                    if (day === 0) {
                      if (!((hour > 11 && hour < 16) || (hour === 11 && minute >= 0) || (hour === 16 && minute === 0))) return true;
                    } else if (day >= 1 && day <= 6) {
                      if (!((hour > 8 && hour < 18) || (hour === 8 && minute >= 0) || (hour === 18 && minute === 0))) return true;
                    } else {
                      return true;
                    }
                    return false;
                  })()}
                >
                  Agendar cita
                </button>
              )}
            </div>
          )}
          <div className="flex justify-between mt-10">
            {paso > 1 && (
              <button type="button" onClick={() => setPaso((p) => p - 1)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                Anterior
              </button>
            )}
            {paso < totalPasos && (
              <button type="button" onClick={() => setPaso((p) => p + 1)} className="ml-auto px-6 py-2 bg-[#94C11F] text-black rounded-lg hover:bg-black hover:text-[#94C11F] border border-[#94C11F]">
                Siguiente
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
