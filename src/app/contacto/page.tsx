// app/contacto/page.jsx
export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col md:flex-row items-center justify-center px-6 py-16 gap-12 pt-25">
      {/* Info lateral */}
      <div className="max-w-md text-left space-y-6">
        <h1 className="text-5xl font-extrabold text-[#181818]">Contáctanos</h1>
        <p className="text-lg text-gray-700">
          ¿Tienes dudas, necesitas una cotización o quieres solicitar un servicio? Estamos aquí para ayudarte.
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>📍 Dirección:</strong> Panamá City, Panamá</p>
          <p><strong>📞 Teléfono:</strong> +507 6000-0000</p>
          <p><strong>✉️ Correo:</strong> contacto@tuservicio.com</p>
        </div>
      </div>

      {/* Formulario */}
      <form className="w-full max-w-xl bg-[#f9f9f9] border border-[#94C11F] rounded-2xl shadow-xl p-10 space-y-6">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-[#181818]">Nombre</label>
          <input
            type="text"
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:border-[#94C11F] text-gray-800"
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-[#181818]">Correo electrónico</label>
          <input
            type="email"
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:border-[#94C11F] text-gray-800"
            placeholder="tucorreo@ejemplo.com"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-[#181818]">Asunto</label>
          <input
            type="text"
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:border-[#94C11F] text-gray-800"
            placeholder="¿Sobre qué quieres hablar?"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-[#181818]">Mensaje</label>
          <textarea
            rows={5}
            className="p-3 rounded-md border border-gray-300 focus:outline-none focus:border-[#94C11F] text-gray-800"
            placeholder="Escribe tu mensaje aquí..."
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-[#94C11F] text-black font-bold hover:bg-[#181818] hover:text-[#94C11F] transition-all"
        >
          Enviar mensaje
        </button>
      </form>
    </div>
  );
}
