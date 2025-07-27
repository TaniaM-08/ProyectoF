"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../cart/context';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
      setProfileOpen(false);
    }
  }
  if (profileOpen) {
    document.addEventListener('click', handleClickOutside); 
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
  return () => document.removeEventListener('click', handleClickOutside);
}, [profileOpen]);


  let cartCount = 0;
  try {
    cartCount = useCart().cartCount;
  } catch {}
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('user');
      const parsed = u ? JSON.parse(u) : null;
      setUser(parsed);
      setIsAdmin(parsed?.role === 'admin');
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-black shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="https://res.cloudinary.com/df6cxn8ga/image/upload/v1742264805/LOGO_lwyljz.png"
            alt="Logo Fumigadora"
            className="w-[15%] h-auto object-contain block"
            style={{ minWidth: 40, minHeight: 40 }}
          />
        </div>

        {/* Menú de escritorio */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Enlaces solo para no-admin */}
          {!isAdmin && (
            <>
              <a href="/" className="text-gray-200 hover:text-[#94C11F] font-medium transition-colors">Inicio</a>
              <a href="/products" className="text-gray-200 hover:text-[#94C11F] font-medium transition-colors">Productos</a>
              <a href="/servicios" className="text-gray-200 hover:text-[#94C11F] font-medium transition-colors">Servicios</a>
              <Link href="/contacto" className="text-gray-200 hover:text-[#94C11F] font-medium transition-colors">Contacto</Link>
              <Link href="/cart" className="relative ml-4 flex items-center group">
                <ShoppingCart className="w-7 h-7 text-[#94C11F] group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#94C11F] text-black text-xs font-bold rounded-full px-2 py-0.5 border border-black shadow-lg">{cartCount}</span>
                )}
              </Link>
            </>
          )}
          {/* Perfil siempre visible para cualquier usuario logueado */}
          {user && (
            <div className="ml-4 relative" ref={profileRef}>
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#181818] border border-[#232323] text-[#94C11F] hover:bg-[#232323] focus:outline-none"
                onClick={() => setProfileOpen((v) => !v)}
                aria-label="Perfil"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M6 20c0-2.2 3.6-3.5 6-3.5s6 1.3 6 3.5" /></svg>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#181818] border border-[#232323] rounded-lg shadow-lg z-50 p-4 animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#232323] flex items-center justify-center">
                      <svg className="w-7 h-7 text-[#94C11F]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M6 20c0-2.2 3.6-3.5 6-3.5s6 1.3 6 3.5" /></svg>
                    </div>
                    <div>
                      <div className="text-[#94C11F] font-bold text-lg">{user.name}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </div>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 mb-2 rounded-lg bg-[#232323] text-gray-200 hover:bg-[#94C11F] hover:text-black transition-all"
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      router.push('/auth/profile');
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M15.232 15.232l2.768-2.768M9 11l2 2 4-4" /></svg>
                    Editar perfil
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-[#94C11F] text-black font-semibold hover:bg-black hover:text-[#94C11F] border border-[#94C11F] transition-all"
                    onClick={() => {
                      localStorage.removeItem('user');
                      setUser(null);
                      setProfileOpen(false);
                      window.location.reload();
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" /><path d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" /></svg>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Si no hay usuario, mostrar login */}
          {!user && (
            <Link
              href="/auth/login"
              className="ml-4 inline-flex items-center justify-center gap-2 px-6 h-10 rounded-full bg-[#94C11F] hover:bg-[#181818] border border-[#94C11F] transition-all font-semibold text-black hover:text-[#94C11F] whitespace-nowrap"
              aria-label="Acceder"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20c0-2.2 3.6-3.5 6-3.5s6 1.3 6 3.5" />
              </svg>
              <span className="text-sm">Log in</span>
            </Link>
          )}
        </nav>

        <div className="md:hidden flex items-center gap-2">
          {/* Carrito solo para no-admin */}
          {!isAdmin && (
            <Link href="/cart" className="relative flex items-center group">
              <ShoppingCart className="w-7 h-7 text-[#94C11F] group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#94C11F] text-black text-xs font-bold rounded-full px-2 py-0.5 border border-black shadow-lg">{cartCount}</span>
              )}
            </Link>
          )}
          {user ? (
            <div className="ml-2 relative" ref={profileRef}>
              <button
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#181818] border border-[#232323] text-[#94C11F] hover:bg-[#232323] focus:outline-none"
                onClick={() => setProfileOpen((v) => !v)}
                aria-label="Perfil"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M6 20c0-2.2 3.6-3.5 6-3.5s6 1.3 6 3.5" /></svg>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#181818] border border-[#232323] rounded-lg shadow-lg z-50 p-4 animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#232323] flex items-center justify-center">
                      <svg className="w-7 h-7 text-[#94C11F]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M6 20c0-2.2 3.6-3.5 6-3.5s6 1.3 6 3.5" /></svg>
                    </div>
                    <div>
                      <div className="text-[#94C11F] font-bold text-lg">{user.name}</div>
                      <div className="text-gray-400 text-sm">{user.email}</div>
                    </div>
                  </div>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 mb-2 rounded-lg bg-[#232323] text-gray-200 hover:bg-[#94C11F] hover:text-black transition-all"
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      router.push('/auth/profile');
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M15.232 15.232l2.768-2.768M9 11l2 2 4-4" /></svg>
                    Editar perfil
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-[#94C11F] text-black font-semibold hover:bg-black hover:text-[#94C11F] border border-[#94C11F] transition-all"
                    onClick={() => {
                      localStorage.removeItem('user');
                      setUser(null);
                      setProfileOpen(false);
                      window.location.reload();
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7" /><path d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" /></svg>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/auth/login" className="ml-2 flex items-center gap-2 justify-center px-4 h-10 rounded-full bg-[#94C11F] hover:bg-[#181818] border border-[#94C11F] transition-all font-semibold text-black hover:text-[#94C11F] text-sm" aria-label="Acceder">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20c0-2.2 3.6-3.5 6-3.5s6 1.3 6 3.5" />
              </svg>
              <span>Log in</span>
            </Link>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-[#94C11F] focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && !isAdmin && (
  <nav className="md:hidden bg-white shadow-lg px-4 pt-3 pb-4 space-y-2">
    <a href="/" className="block text-gray-700 hover:text-[#94C11F] font-medium">
      Inicio
    </a>
    <a href="/products" className="block text-gray-700 hover:text-[#94C11F] font-medium">
      Productos
    </a>
    <a href="/servicios" className="block text-gray-700 hover:text-[#94C11F] font-medium">
      Servicios
    </a>
    <a href="/contacto" className="block text-gray-700 hover:text-[#94C11F] font-medium">
      Contacto
    </a>
  </nav>
)}

    </header>
  );
}
