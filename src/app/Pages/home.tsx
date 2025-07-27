

'use client';

type CounterProps = { end: number; duration: number };
function Counter({ end, duration }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration * 60); 
    let animationFrame: number;

    const updateCounter = () => {
      start += increment;
      if (start < end) {
        setCount(Math.floor(start));
        animationFrame = requestAnimationFrame(updateCounter);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

import { useEffect, useState } from 'react';
import Header from '../Components/Header';

const imageUrls = [
  'https://res.cloudinary.com/df6cxn8ga/image/upload/v1743116154/como-tener-a-punto-jardin-principales-cuidados-cesped-verano_clas4r.jpg',
  'https://res.cloudinary.com/df6cxn8ga/image/upload/v1743116157/portada-contenedoresx640_watiyn.jpg',
  'https://res.cloudinary.com/df6cxn8ga/image/upload/v1743116396/4ca2f7b628f6d1c32ed830c2bbca93c9_s7po3m.jpg',
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />

      <div
        className="fixed top-0 left-0 w-full h-full -z-10 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${imageUrls[currentIndex]})`,
        }}
      />

      <main className="min-h-screen flex flex-col items-start justify-start">
        <div className="relative w-full sm:w-[90%] md:w-[65%] max-w-1xl mt-0 ml-0 md:ml-40 text-white px-15 py-12 rounded-b-[60px] sm:rounded-b-[80px] md:rounded-b-[100px]" style={{ backgroundColor: 'rgba(0, 0, 0, 0.68)' }}>

          <a
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:block absolute top-20 right-[-20%] z-12"
            style={{ maxWidth: '500px' }}
          >
            <img
              src="https://res.cloudinary.com/df6cxn8ga/image/upload/v1752688195/hi_b0jsih.png"
              alt="Certificado 1"
              className="w-full h-auto max-h-[650px] object-contain rounded-lg"
            />
          </a>

          <h1 className="mt-20 font-extrabold mb-4">
            <span className="block text-4xl md:text-5xl lg:text-6xl xl:text-7xl">Protegemos tu</span>
            <span className="block text-[#94C11F] text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">hogar y negocio</span>
          </h1>
          <p className="text-lg md:text-xl font-bold mb-5 text-gray-200 md:mr-30">
            Brindamos soluciones efectivas y seguras para la eliminación de plagas, garantizando tu tranquilidad.
          </p>

          {/* Botón */}
          <a
            href="#"
            className="inline-block font-semibold px-20 py-3 rounded-full transition text-2xl"
            style={{ backgroundColor: '#94C11F', color: '#000', boxShadow: '0 2px 8px 0 #ffffff33' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#7ea81a')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#94C11F')}
          >
            Servicios
          </a>

          <div className="mt-10 flex flex-col md:flex-row gap-4 justify-start">
            <div
              className="bg-black p-4 rounded-1xl shadow-md flex items-center gap-4 border-4"
              style={{ borderColor: '#000000ff', borderRadius: '1rem' }}
            >
              <img
                src="https://res.cloudinary.com/df6cxn8ga/image/upload/v1743295352/mosca_qnfewc.png"
                alt="Icono Plaga"
                className="w-20 h-20 object-contain"
              />
              <p className="font-bold text-white">
                Expertos en el<br />control de Plagas
              </p>
            </div>

            <div
              className="hidden sm:flex bg-black bg-opacity-80 p-4 rounded-1xl shadow-md items-center gap-4 border-4"
              style={{ borderColor: '#000000ff', borderRadius: '1rem' }}
            >
              <img
                src="https://res.cloudinary.com/df6cxn8ga/image/upload/v1743295346/alacran_vkcgop.png"
                alt="Icono Solución"
                className="w-20 h-20 object-contain"
              />
              <p className="font-bold text-white">
                Soluciones<br />efectivas contra plagas
              </p>
            </div>

          </div>

        </div>

        <div className="w-full h-20 bg-gradient-to-b from-transparent to-black"></div>

        <section className="w-full bg-black text-white py-12 flex flex-col md:flex-row justify-around items-center text-center gap-8">
          <div>
            <h2 className="text-4xl font-bold"><Counter end={10} duration={3} />+</h2>
            <p className="text-sm mt-2">Años de experiencia</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold"><Counter end={5000} duration={3} />+</h2>
            <p className="text-sm mt-2">Clientes satisfechos</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold"><Counter end={27} duration={3} />/7</h2>
            <p className="text-sm mt-2">Servicio de emergencia</p>
          </div>
          <div>
            <h2 className="text-4xl font-bold"><Counter end={100} duration={3} />%</h2>
            <p className="text-sm mt-2">Resultados garantizados</p>
          </div>
        </section>

    <section className="w-full bg-black text-white py-16 px-4 md:px-16 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Soluciones Profesionales, Espacios Seguros</h2>
      <div className="w-24 h-1 bg-[#94C11F] mx-auto mb-6 rounded-full"></div>
      <p className="text-gray-300 max-w-3xl mx-auto mb-12">
        Soluciones completas para todas tus necesidades de control de plagas, eliminamos plagas con eficacia y sin riesgos para tu familia.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#111] border-t-4 border-[#94C11F] rounded-xl p-6 hover:scale-105 transition">
          <img src="https://res.cloudinary.com/df6cxn8ga/image/upload/e_background_removal/f_png/v1743295350/serpiente_l3mghw.png" alt="Evaluación" className="w-20 h-20 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Evaluación Profesional</h3>
          <p className="text-sm text-gray-400">
            Inspección detallada para identificar el tipo y origen de la plaga
          </p>
        </div>

        <div className="bg-[#111] border-t-4 border-[#94C11F] rounded-xl p-6 hover:scale-105 transition">
          <img src="https://res.cloudinary.com/df6cxn8ga/image/upload/e_background_removal/f_png/v1743295348/pulga_enuvno.png" alt="Tratamiento" className="w-20 h-20 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Tratamiento Especializado</h3>
          <p className="text-sm text-gray-400">
            Aplicación de productos específicos según cada situación
          </p>
        </div>

        <div className="bg-[#111] border-t-4 border-[#94C11F] rounded-xl p-6 hover:scale-105 transition">
          <img src="https://res.cloudinary.com/df6cxn8ga/image/upload/e_background_removal/f_png/v1743295351/murcielago_i8jn7e.png" alt="Prevención" className="w-20 h-20 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Prevención a Largo Plazo</h3>
          <p className="text-sm text-gray-400">
            Recomendaciones para evitar futuras infestaciones
          </p>
        </div>
      </div>
    </section>

    <section className="w-full bg-black text-white py-16 px-4 md:px-16 text-center">
      <h2 className="text-4xl font-extrabold mb-4">¡La inspección es <span className="underline underline-offset-4">gratis</span>!</h2>
      <p className="text-lg max-w-2xl mx-auto mb-8 font-semibold">
        Agenda tu visita sin compromiso. Nuestros expertos evaluarán tu espacio y te ofrecerán la mejor solución.
      </p>
      <a
        href="#"
        className="inline-block bg-black text-[#94C11F] hover:text-white font-bold px-8 py-3 rounded-full shadow-md transition duration-300"
      >
        Solicitar inspección

      </a>
      
    </section>

    <section className="w-full bg-white text-black">
      <div className="flex flex-col md:flex-row items-stretch relative overflow-hidden">

        <div className="z-10 w-full md:w-1/2 flex flex-col justify-center px-6 py-16 md:pl-[10%] items-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-center">Estamos Certificados</h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-5 text-center">
            Contamos con certificaciones que respaldan la calidad y seguridad de nuestros servicios.
          </p>

          <div className="flex gap-6 justify-center mt-2">
            <div className="w-28 h-auto">
              <img
                src="https://res.cloudinary.com/df6cxn8ga/image/upload/v1743290386/poster_login_municipio_david_gomjcz.png"
                alt="Certificado 1"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="w-36 h-auto">
              <img
                src="https://res.cloudinary.com/df6cxn8ga/image/upload/v1743290561/logo780x520_hebhok.png"
                alt="Certificado 2"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-full md:w-1/2 h-auto items-stretch overflow-hidden">
          <img
            src="https://res.cloudinary.com/df6cxn8ga/image/upload/v1752704662/ji_i9o_7_z5wkhf.png"
            alt="Certificación Destacada"
            className="w-full h-full min-h-full object-cover transition-transform duration-500"
            style={{
              minHeight: '100%',
              minWidth: '100%',
              height: '100%',
              width: '100%',
              transform: 'scale(1.15)',
            }}
          />
        </div>

    <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />

    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        background: 'linear-gradient(to right, white 0%, white 50%, transparent 80%)',
      }}
    />
  </div>
</section>



      </main>
    </>
  );
}
