import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-8 ">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex gap-4 mb-2">
            <a href="https://www.facebook.com/profile.php?id=61577289763556" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="w-7 h-7 sm:w-8 sm:h-8 hover:text-blue-400 transition-all" />
            </a>
            <a href="https://www.instagram.com/fumigpestpty/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="w-7 h-7 sm:w-8 sm:h-8.5 hover:text-pink-400 transition-all" />
            </a>
            <a href="https://www.tiktok.com/@fumigpestpty" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <FaTiktok className="w-7 h-7 sm:w-8 sm:h-8 hover:text-gray-400 transition-all" />
            </a>
          </div>
          <div className="text-sm">
            <span className="font-semibold">Tel:</span>{' '}
            <a href="tel:6000-0000" className="hover:underline">
              6000-0000
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs bg-green-700 px-3 py-1 rounded-full mb-2">
            Empresa Certificada
          </span>
          <div className="flex gap-4 flex-wrap justify-center">
            <a
            >
              <img
                src="https://res.cloudinary.com/df6cxn8ga/image/upload/v1743290386/poster_login_municipio_david_gomjcz.png"
                alt="Certificado 1"
                className="h-12 w-auto max-w-[120px] sm:h-14 md:h-16 rounded shadow hover:scale-105 transition object-contain p-0"
              />
            </a>
              <img
                src="https://res.cloudinary.com/df6cxn8ga/image/upload/v1753484431/Imagen1_bftq9h.png"
                className="h-12 w-auto max-w-[120px] sm:h-14 md:h-16 rounded shadow hover:scale-105 transition object-contain p-1"
              />
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-6">
        © {new Date().getFullYear()} Fumigadora PT. Todos los derechos reservados.
      </div>
    </footer>
  );
}
